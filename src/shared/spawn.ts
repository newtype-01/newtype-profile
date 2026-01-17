/**
 * Node.js-compatible spawn utilities
 * Replaces Bun.spawn for Node.js runtime compatibility
 */

import { spawn as nodeSpawn, type ChildProcess, type SpawnOptions } from "node:child_process"
import { writeFile } from "node:fs/promises"

export interface SpawnResult {
  stdout: string
  stderr: string
  exitCode: number
}

export interface SpawnWithPipeOptions {
  cwd?: string
  stdin?: string
  timeout?: number
}

/**
 * Spawn a process and collect stdout/stderr
 */
export function spawnAsync(
  command: string[],
  options: SpawnWithPipeOptions = {}
): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command
    const proc: ChildProcess = nodeSpawn(cmd, args, {
      cwd: options.cwd,
      stdio: [options.stdin ? "pipe" : "ignore", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""
    let killed = false

    const timeoutId = options.timeout
      ? setTimeout(() => {
          killed = true
          proc.kill()
          reject(new Error(`Timeout after ${options.timeout}ms`))
        }, options.timeout)
      : null

    if (options.stdin && proc.stdin) {
      proc.stdin.write(options.stdin)
      proc.stdin.end()
    }

    proc.stdout?.on("data", (data: Buffer) => {
      stdout += data.toString()
    })

    proc.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString()
    })

    proc.on("close", (code) => {
      if (timeoutId) clearTimeout(timeoutId)
      if (!killed) {
        resolve({ stdout, stderr, exitCode: code ?? 1 })
      }
    })

    proc.on("error", (err) => {
      if (timeoutId) clearTimeout(timeoutId)
      reject(err)
    })
  })
}

/**
 * Simple spawn that returns exit code only (for fire-and-forget)
 */
export function spawnSimple(
  command: string[],
  options: { cwd?: string; stdio?: "ignore" | "pipe" } = {}
): Promise<number> {
  return new Promise((resolve) => {
    const [cmd, ...args] = command
    const proc: ChildProcess = nodeSpawn(cmd, args, {
      cwd: options.cwd,
      stdio: options.stdio === "pipe" ? ["ignore", "pipe", "pipe"] : "ignore",
    })

    proc.on("close", (code) => resolve(code ?? 1))
    proc.on("error", () => resolve(1))
  })
}

/**
 * Write file to disk (replacement for Bun.write)
 */
export async function writeFileSafe(path: string, data: ArrayBuffer | Buffer | string): Promise<void> {
  if (data instanceof ArrayBuffer) {
    await writeFile(path, Buffer.from(data))
  } else {
    await writeFile(path, data)
  }
}
