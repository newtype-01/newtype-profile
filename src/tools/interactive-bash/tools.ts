import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool"
import { spawn, type ChildProcess } from "node:child_process"
import { BLOCKED_TMUX_SUBCOMMANDS, DEFAULT_TIMEOUT_MS, INTERACTIVE_BASH_DESCRIPTION } from "./constants"
import { getCachedTmuxPath } from "./utils"

/**
 * Quote-aware command tokenizer with escape handling
 * Handles single/double quotes and backslash escapes without external dependencies
 */
export function tokenizeCommand(cmd: string): string[] {
  const tokens: string[] = []
  let current = ""
  let inQuote = false
  let quoteChar = ""
  let escaped = false

  for (let i = 0; i < cmd.length; i++) {
    const char = cmd[i]

    if (escaped) {
      current += char
      escaped = false
      continue
    }

    if (char === "\\") {
      escaped = true
      continue
    }

    if ((char === "'" || char === '"') && !inQuote) {
      inQuote = true
      quoteChar = char
    } else if (char === quoteChar && inQuote) {
      inQuote = false
      quoteChar = ""
    } else if (char === " " && !inQuote) {
      if (current) {
        tokens.push(current)
        current = ""
      }
    } else {
      current += char
    }
  }

  if (current) tokens.push(current)
  return tokens
}

export const interactive_bash: ToolDefinition = tool({
  description: INTERACTIVE_BASH_DESCRIPTION,
  args: {
    tmux_command: tool.schema.string().describe("The tmux command to execute (without 'tmux' prefix)"),
  },
  execute: async (args) => {
    try {
      const tmuxPath = getCachedTmuxPath() ?? "tmux"

      const parts = tokenizeCommand(args.tmux_command)

      if (parts.length === 0) {
        return "Error: Empty tmux command"
      }

      const subcommand = parts[0].toLowerCase()
      if (BLOCKED_TMUX_SUBCOMMANDS.includes(subcommand)) {
        return `Error: '${parts[0]}' is blocked. Use bash tool instead for capturing/printing terminal output.`
      }

      const result = await new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve, reject) => {
        const proc: ChildProcess = spawn(tmuxPath, parts, {
          stdio: ["ignore", "pipe", "pipe"],
        })

        let stdout = ""
        let stderr = ""
        let killed = false

        const timeout = setTimeout(() => {
          killed = true
          proc.kill()
          reject(new Error(`Timeout after ${DEFAULT_TIMEOUT_MS}ms`))
        }, DEFAULT_TIMEOUT_MS)

        proc.stdout?.on("data", (data: Buffer) => { stdout += data.toString() })
        proc.stderr?.on("data", (data: Buffer) => { stderr += data.toString() })

        proc.on("close", (code) => {
          clearTimeout(timeout)
          if (!killed) {
            resolve({ stdout, stderr, exitCode: code ?? 1 })
          }
        })

        proc.on("error", (err) => {
          clearTimeout(timeout)
          reject(err)
        })
      })

      // Check exitCode properly - return error even if stderr is empty
      if (result.exitCode !== 0) {
        const errorMsg = result.stderr.trim() || `Command failed with exit code ${result.exitCode}`
        return `Error: ${errorMsg}`
      }

      return result.stdout || "(no output)"
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})
