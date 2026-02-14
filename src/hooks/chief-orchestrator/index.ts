import type { PluginInput } from "@opencode-ai/plugin"
import { execSync } from "node:child_process"
import { existsSync, readdirSync, appendFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import {
  readBoulderState,
  appendSessionId,
  getPlanProgress,
} from "../../features/boulder-state"
import { getMainSessionID, subagentSessions } from "../../features/claude-code-session-state"
import { findNearestMessageWithFields, MESSAGE_STORAGE } from "../../features/hook-message-injector"
import { log } from "../../shared/logger"
import type { BackgroundManager } from "../../features/background-agent"
import { summarizeOutput, formatSummarizedOutput } from "./output-summarizer"
import { getTrackerForSession, clearTrackerForSession } from "./task-progress-tracker"
import { analyzeAgentOutput, hasConfidenceScore, detectAgentType, clearRewriteAttempts, buildFailureJournalEntry, formatFailureJournalMarkdown } from "./confidence-router"
import { parseQualityScores, buildImprovementDirective, hasQualityScores, buildMissingScoresWarning } from "./quality-dimensions"
import type { AgentType } from "./quality-dimensions"
import {
  parseArtifacts,
  addArtifact,
  buildContextSummary,
  buildDetailedContextSummary,
  hasArtifacts,
  clearContext,
  type AgentType as SharedAgentType,
} from "./shared-context"

export const HOOK_NAME = "chief-orchestrator"

const ALLOWED_PATH_PREFIX = ".chief/"
const WRITE_EDIT_TOOLS = ["Write", "Edit", "write", "edit"]

const DEPUTY_SHOULD_DELEGATE_TOOLS: Record<string, string> = {
  web_search_exa: "researcher",
  websearch_web_search_exa: "researcher",
  tavily_search: "researcher",
  tavily_extract: "researcher",
  firecrawl_scrape: "researcher",
  firecrawl_search: "researcher",
  firecrawl_crawl: "researcher",
  webfetch: "researcher",
  context7_resolve_library_id: "researcher",
  "context7_resolve-library-id": "researcher",
  context7_query_docs: "researcher",
  "context7_query-docs": "researcher",
  grep_app_searchGitHub: "researcher",
}

function shouldDelegateToSpecialist(tool: string): boolean {
  return tool in DEPUTY_SHOULD_DELEGATE_TOOLS
}

function getRecommendedSpecialist(tool: string): string {
  return DEPUTY_SHOULD_DELEGATE_TOOLS[tool] ?? "researcher"
}

function buildDeputyDelegationReminder(tool: string, specialist: string): string {
  return `

---

[SYSTEM REMINDER - DELEGATION RECOMMENDED]

You (Deputy) are directly calling \`${tool}\`, which is a search/research tool.

**Best practice**: Delegate search tasks to the **${specialist}** agent via:
\`\`\`
chief_task(subagent_type="${specialist}", prompt="[search task]")
\`\`\`

**Why**: The ${specialist} agent has specialized prompts for source evaluation, 
quality scoring, and structured artifact output that you lack.

**Exception**: If this is a quick one-off lookup (< 1 query), proceed.
For systematic research (multiple queries, source comparison), delegate.

---
`
}

const FAILURE_JOURNAL_DIR = ".opencode/memory"
const FAILURE_JOURNAL_FILE = "escalation-log.md"

function writeFailureJournal(directory: string, entry: ReturnType<typeof buildFailureJournalEntry>): void {
  try {
    const memDir = join(directory, FAILURE_JOURNAL_DIR)
    if (!existsSync(memDir)) {
      mkdirSync(memDir, { recursive: true })
    }
    const filePath = join(memDir, FAILURE_JOURNAL_FILE)
    const needsHeader = !existsSync(filePath)
    if (needsHeader) {
      appendFileSync(filePath, "# Escalation Log\n\nAutomatic failure journal for quality escalations.\n\n")
    }
    appendFileSync(filePath, formatFailureJournalMarkdown(entry))
    log(`[${HOOK_NAME}] Failure journal entry written`, {
      agentType: entry.agentType,
      confidence: entry.confidence,
      file: filePath,
    })
  } catch (err) {
    log(`[${HOOK_NAME}] Failed to write failure journal`, { error: String(err) })
  }
}

const DIRECT_WORK_REMINDER = `

---

[SYSTEM REMINDER - DELEGATION REQUIRED]

You just performed direct file modifications outside \`.chief/\`.

**You are an ORCHESTRATOR, not an IMPLEMENTER.**

As an orchestrator, you should:
- **DELEGATE** implementation work to subagents via \`chief_task\`
- **VERIFY** the work done by subagents
- **COORDINATE** multiple tasks and ensure completion

You should NOT:
- Write code directly (except for \`.chief/\` files like plans and notepads)
- Make direct file edits outside \`.chief/\`
- Implement features yourself

**If you need to make changes:**
1. Use \`chief_task\` to delegate to an appropriate subagent
2. Provide clear instructions in the prompt
3. Verify the subagent's work after completion

---
`

const BOULDER_CONTINUATION_PROMPT = `[SYSTEM REMINDER - BOULDER CONTINUATION]

You have an active work plan with incomplete tasks. Continue working.

RULES:
- Proceed without asking for permission
- Mark each checkbox [x] in the plan file when done
- Use the notepad at .chief/notepads/{PLAN_NAME}/ to record learnings
- Do not stop until all tasks are complete
- If blocked, document the blocker and move to the next task`

const VERIFICATION_REMINDER = `**MANDATORY VERIFICATION - SUBAGENTS LIE**

Subagents FREQUENTLY claim completion when:
- Tests are actually FAILING
- Code has type/lint ERRORS
- Implementation is INCOMPLETE
- Patterns were NOT followed

**YOU MUST VERIFY EVERYTHING YOURSELF:**

1. Run \`lsp_diagnostics\` on changed files - Must be CLEAN
2. Run tests yourself - Must PASS (not "agent said it passed")
3. Read the actual code - Must match requirements
4. Check build/typecheck - Must succeed

DO NOT TRUST THE AGENT'S SELF-REPORT.
VERIFY EACH CLAIM WITH YOUR OWN TOOL CALLS.

**HANDS-ON QA REQUIRED (after ALL tasks complete):**

| Deliverable Type | Verification Tool | Action |
|------------------|-------------------|--------|
| **Frontend/UI** | \`/playwright\` skill | Navigate, interact, screenshot evidence |
| **TUI/CLI** | \`interactive_bash\` (tmux) | Run interactively, verify output |
| **API/Backend** | \`bash\` with curl | Send requests, verify responses |

Static analysis CANNOT catch: visual bugs, animation issues, user flow breakages, integration problems.
**FAILURE TO DO HANDS-ON QA = INCOMPLETE WORK.**`

const ORCHESTRATOR_DELEGATION_REQUIRED = `

---

⚠️⚠️⚠️ [CRITICAL SYSTEM DIRECTIVE - DELEGATION REQUIRED] ⚠️⚠️⚠️

**STOP. YOU ARE VIOLATING ORCHESTRATOR PROTOCOL.**

You (chief) are attempting to directly modify a file outside \`.chief/\`.

**Path attempted:** $FILE_PATH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 **THIS IS FORBIDDEN** (except for VERIFICATION purposes)

As an ORCHESTRATOR, you MUST:
1. **DELEGATE** all implementation work via \`chief_task\`
2. **VERIFY** the work done by subagents (reading files is OK)
3. **COORDINATE** - you orchestrate, you don't implement

**ALLOWED direct file operations:**
- Files inside \`.chief/\` (plans, notepads, drafts)
- Reading files for verification
- Running diagnostics/tests

**FORBIDDEN direct file operations:**
- Writing/editing source code
- Creating new files outside \`.chief/\`
- Any implementation work

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**IF THIS IS FOR VERIFICATION:**
Proceed if you are verifying subagent work by making a small fix.
But for any substantial changes, USE \`chief_task\`.

**CORRECT APPROACH:**
\`\`\`
chief_task(
  category="...",
  prompt="[specific single task with clear acceptance criteria]"
)
\`\`\`

⚠️⚠️⚠️ DELEGATE. DON'T IMPLEMENT. ⚠️⚠️⚠️

---
`

const SINGLE_TASK_DIRECTIVE = `

[SYSTEM DIRECTIVE - FOCUS ON YOUR TASK]

**Execute the task you've been given.**

- Focus on delivering high-quality results
- If the task has multiple parts, work through them systematically
- If something is unclear, make reasonable assumptions and proceed
- Do NOT refuse or push back on the task — just do your best work

**Your job is to execute, not to judge the task itself.**
`

function buildVerificationReminder(sessionId: string): string {
  return `${VERIFICATION_REMINDER}

---

**If ANY verification fails, use this immediately:**
\`\`\`
chief_task(resume="${sessionId}", prompt="fix: [describe the specific failure]")
\`\`\``
}

function buildOrchestratorReminder(planName: string, progress: { total: number; completed: number }, sessionId: string): string {
  const remaining = progress.total - progress.completed
  return `
---

**State:** Plan: ${planName} | ${progress.completed}/${progress.total} done, ${remaining} left

---

${buildVerificationReminder(sessionId)}

ALL pass? → commit atomic unit, mark \`[x]\`, next task.`
}

function buildStandaloneVerificationReminder(sessionId: string): string {
  return `
---

${buildVerificationReminder(sessionId)}`
}

function extractSessionIdFromOutput(output: string): string {
  const match = output.match(/Session ID:\s*(ses_[a-zA-Z0-9]+)/)
  return match?.[1] ?? "<session_id>"
}

interface GitFileStat {
  path: string
  added: number
  removed: number
  status: "modified" | "added" | "deleted"
}

function getGitDiffStats(directory: string): GitFileStat[] {
  try {
    const output = execSync("git diff --numstat HEAD", {
      cwd: directory,
      encoding: "utf-8",
      timeout: 5000,
    }).trim()

    if (!output) return []

    const statusOutput = execSync("git status --porcelain", {
      cwd: directory,
      encoding: "utf-8",
      timeout: 5000,
    }).trim()

    const statusMap = new Map<string, "modified" | "added" | "deleted">()
    for (const line of statusOutput.split("\n")) {
      if (!line) continue
      const status = line.substring(0, 2).trim()
      const filePath = line.substring(3)
      if (status === "A" || status === "??") {
        statusMap.set(filePath, "added")
      } else if (status === "D") {
        statusMap.set(filePath, "deleted")
      } else {
        statusMap.set(filePath, "modified")
      }
    }

    const stats: GitFileStat[] = []
    for (const line of output.split("\n")) {
      const parts = line.split("\t")
      if (parts.length < 3) continue

      const [addedStr, removedStr, path] = parts
      const added = addedStr === "-" ? 0 : parseInt(addedStr, 10)
      const removed = removedStr === "-" ? 0 : parseInt(removedStr, 10)

      stats.push({
        path,
        added,
        removed,
        status: statusMap.get(path) ?? "modified",
      })
    }

    return stats
  } catch {
    return []
  }
}

function formatFileChanges(stats: GitFileStat[], notepadPath?: string): string {
  if (stats.length === 0) return "[FILE CHANGES SUMMARY]\nNo file changes detected.\n"

  const modified = stats.filter((s) => s.status === "modified")
  const added = stats.filter((s) => s.status === "added")
  const deleted = stats.filter((s) => s.status === "deleted")

  const lines: string[] = ["[FILE CHANGES SUMMARY]"]

  if (modified.length > 0) {
    lines.push("Modified files:")
    for (const f of modified) {
      lines.push(`  ${f.path}  (+${f.added}, -${f.removed})`)
    }
    lines.push("")
  }

  if (added.length > 0) {
    lines.push("Created files:")
    for (const f of added) {
      lines.push(`  ${f.path}  (+${f.added})`)
    }
    lines.push("")
  }

  if (deleted.length > 0) {
    lines.push("Deleted files:")
    for (const f of deleted) {
      lines.push(`  ${f.path}  (-${f.removed})`)
    }
    lines.push("")
  }

  if (notepadPath) {
    const notepadStat = stats.find((s) => s.path.includes("notepad") || s.path.includes(".chief"))
    if (notepadStat) {
      lines.push("[NOTEPAD UPDATED]")
      lines.push(`  ${notepadStat.path}  (+${notepadStat.added})`)
      lines.push("")
    }
  }

  return lines.join("\n")
}

interface ToolExecuteAfterInput {
  tool: string
  sessionID?: string
  callID?: string
}

interface ToolExecuteAfterOutput {
  title: string
  output: string
  metadata: Record<string, unknown>
}

function getMessageDir(sessionID: string): string | null {
  if (!existsSync(MESSAGE_STORAGE)) return null

  const directPath = join(MESSAGE_STORAGE, sessionID)
  if (existsSync(directPath)) return directPath

  for (const dir of readdirSync(MESSAGE_STORAGE)) {
    const sessionPath = join(MESSAGE_STORAGE, dir, sessionID)
    if (existsSync(sessionPath)) return sessionPath
  }

  return null
}

function isCallerOrchestrator(sessionID?: string): boolean {
  if (!sessionID) return false
  const messageDir = getMessageDir(sessionID)
  if (!messageDir) return false
  const nearest = findNearestMessageWithFields(messageDir)
  return nearest?.agent === "chief"
}

function isCallerDeputy(sessionID?: string): boolean {
  if (!sessionID) return false
  const messageDir = getMessageDir(sessionID)
  if (!messageDir) return false
  const nearest = findNearestMessageWithFields(messageDir)
  return nearest?.agent === "deputy"
}

function isCallerChiefOrDeputy(sessionID?: string): boolean {
  return isCallerOrchestrator(sessionID) || isCallerDeputy(sessionID)
}

interface SessionState {
  lastEventWasAbortError?: boolean
}

export interface ChiefOrchestratorHookOptions {
  directory: string
  backgroundManager?: BackgroundManager
}

function isAbortError(error: unknown): boolean {
  if (!error) return false

  if (typeof error === "object") {
    const errObj = error as Record<string, unknown>
    const name = errObj.name as string | undefined
    const message = (errObj.message as string | undefined)?.toLowerCase() ?? ""

    if (name === "MessageAbortedError" || name === "AbortError") return true
    if (name === "DOMException" && message.includes("abort")) return true
    if (message.includes("aborted") || message.includes("cancelled") || message.includes("interrupted")) return true
  }

  if (typeof error === "string") {
    const lower = error.toLowerCase()
    return lower.includes("abort") || lower.includes("cancel") || lower.includes("interrupt")
  }

  return false
}

export function createChiefOrchestratorHook(
  ctx: PluginInput,
  options?: ChiefOrchestratorHookOptions
) {
  const backgroundManager = options?.backgroundManager
  const sessions = new Map<string, SessionState>()
  const pendingFilePaths = new Map<string, string>()

  function getState(sessionID: string): SessionState {
    let state = sessions.get(sessionID)
    if (!state) {
      state = {}
      sessions.set(sessionID, state)
    }
    return state
  }

  async function injectContinuation(sessionID: string, planName: string, remaining: number, total: number): Promise<void> {
    const hasRunningBgTasks = backgroundManager
      ? backgroundManager.getTasksByParentSession(sessionID).some(t => t.status === "running")
      : false

    if (hasRunningBgTasks) {
      log(`[${HOOK_NAME}] Skipped injection: background tasks running`, { sessionID })
      return
    }

    const prompt = BOULDER_CONTINUATION_PROMPT
      .replace(/{PLAN_NAME}/g, planName) +
      `\n\n[Status: ${total - remaining}/${total} completed, ${remaining} remaining]`

    try {
      log(`[${HOOK_NAME}] Injecting boulder continuation`, { sessionID, planName, remaining })

      await ctx.client.session.prompt({
        path: { id: sessionID },
        body: {
          agent: "chief",
          parts: [{ type: "text", text: prompt }],
        },
        query: { directory: ctx.directory },
      })

      log(`[${HOOK_NAME}] Boulder continuation injected`, { sessionID })
    } catch (err) {
      log(`[${HOOK_NAME}] Boulder continuation failed`, { sessionID, error: String(err) })
    }
  }

  return {
    handler: async ({ event }: { event: { type: string; properties?: unknown } }): Promise<void> => {
      const props = event.properties as Record<string, unknown> | undefined

      if (event.type === "session.error") {
        const sessionID = props?.sessionID as string | undefined
        if (!sessionID) return

        const state = getState(sessionID)
        const isAbort = isAbortError(props?.error)
        state.lastEventWasAbortError = isAbort

        log(`[${HOOK_NAME}] session.error`, { sessionID, isAbort })
        return
      }

      if (event.type === "session.idle") {
        const sessionID = props?.sessionID as string | undefined
        if (!sessionID) return

        log(`[${HOOK_NAME}] session.idle`, { sessionID })

        // Read boulder state FIRST to check if this session is part of an active boulder
        const boulderState = readBoulderState(ctx.directory)
        const isBoulderSession = boulderState?.session_ids.includes(sessionID) ?? false

        const mainSessionID = getMainSessionID()
        const isMainSession = sessionID === mainSessionID
        const isBackgroundTaskSession = subagentSessions.has(sessionID)

        // Allow continuation if: main session OR background task OR boulder session
        if (mainSessionID && !isMainSession && !isBackgroundTaskSession && !isBoulderSession) {
          log(`[${HOOK_NAME}] Skipped: not main, background task, or boulder session`, { sessionID })
          return
        }

        const state = getState(sessionID)

        if (state.lastEventWasAbortError) {
          state.lastEventWasAbortError = false
          log(`[${HOOK_NAME}] Skipped: abort error immediately before idle`, { sessionID })
          return
        }

        const hasRunningBgTasks = backgroundManager
          ? backgroundManager.getTasksByParentSession(sessionID).some(t => t.status === "running")
          : false

        if (hasRunningBgTasks) {
          log(`[${HOOK_NAME}] Skipped: background tasks running`, { sessionID })
          return
        }


        if (!boulderState) {
          log(`[${HOOK_NAME}] No active boulder`, { sessionID })
          return
        }

        if (!isCallerOrchestrator(sessionID)) {
          log(`[${HOOK_NAME}] Skipped: last agent is not chief`, { sessionID })
          return
        }

        const progress = getPlanProgress(boulderState.active_plan)
        if (progress.isComplete) {
          log(`[${HOOK_NAME}] Boulder complete`, { sessionID, plan: boulderState.plan_name })
          return
        }

        const remaining = progress.total - progress.completed
        injectContinuation(sessionID, boulderState.plan_name, remaining, progress.total)
        return
      }

      if (event.type === "message.updated") {
        const info = props?.info as Record<string, unknown> | undefined
        const sessionID = info?.sessionID as string | undefined

        if (!sessionID) return

        const state = sessions.get(sessionID)
        if (state) {
          state.lastEventWasAbortError = false
        }
        return
      }

      if (event.type === "message.part.updated") {
        const info = props?.info as Record<string, unknown> | undefined
        const sessionID = info?.sessionID as string | undefined
        const role = info?.role as string | undefined

        if (sessionID && role === "assistant") {
          const state = sessions.get(sessionID)
          if (state) {
            state.lastEventWasAbortError = false
          }
        }
        return
      }

      if (event.type === "tool.execute.before" || event.type === "tool.execute.after") {
        const sessionID = props?.sessionID as string | undefined
        if (sessionID) {
          const state = sessions.get(sessionID)
          if (state) {
            state.lastEventWasAbortError = false
          }
        }
        return
      }

      if (event.type === "session.deleted") {
        const sessionInfo = props?.info as { id?: string } | undefined
        if (sessionInfo?.id) {
          sessions.delete(sessionInfo.id)
          clearTrackerForSession(sessionInfo.id)
          clearRewriteAttempts(sessionInfo.id)
          clearContext(sessionInfo.id)
          log(`[${HOOK_NAME}] Session deleted: cleaned up`, { sessionID: sessionInfo.id })
        }
        return
      }
    },

    "tool.execute.before": async (
      input: { tool: string; sessionID?: string; callID?: string },
      output: { args: Record<string, unknown>; message?: string }
    ): Promise<void> => {
      const callerIsChief = isCallerOrchestrator(input.sessionID)
      const callerIsDeputy = isCallerDeputy(input.sessionID)
      
      if (input.tool === "chief_task") {
        log(`[${HOOK_NAME}] chief_task detected`, {
          sessionID: input.sessionID,
          callID: input.callID,
          caller: callerIsChief ? "chief" : callerIsDeputy ? "deputy" : "other",
        })
      }

      if (!callerIsChief && !callerIsDeputy) {
        return
      }

      if (WRITE_EDIT_TOOLS.includes(input.tool)) {
        // Only Chief gets the delegation warning (Deputy is allowed to edit directly)
        if (!callerIsChief) {
          return
        }
        const filePath = (output.args.filePath ?? output.args.path ?? output.args.file) as string | undefined
        if (filePath && !filePath.includes(ALLOWED_PATH_PREFIX)) {
          if (input.callID) {
            pendingFilePaths.set(input.callID, filePath)
          }
          const warning = ORCHESTRATOR_DELEGATION_REQUIRED.replace("$FILE_PATH", filePath)
          output.message = (output.message || "") + warning
          log(`[${HOOK_NAME}] Injected delegation warning for direct file modification`, {
            sessionID: input.sessionID,
            tool: input.tool,
            filePath,
          })
        }
        return
      }

      if (callerIsDeputy && shouldDelegateToSpecialist(input.tool)) {
        const specialist = getRecommendedSpecialist(input.tool)
        output.message = (output.message || "") + buildDeputyDelegationReminder(input.tool, specialist)
        log(`[${HOOK_NAME}] Deputy delegation reminder`, {
          sessionID: input.sessionID,
          tool: input.tool,
          recommendedSpecialist: specialist,
        })
      }

      if (input.tool === "chief_task") {
        const prompt = output.args.prompt as string | undefined
        if (prompt && !prompt.includes("[SYSTEM DIRECTIVE - SINGLE TASK ONLY]")) {
          let enhancedPrompt = prompt
          
          if (input.sessionID) {
            const downstreamAgent = output.args.subagent_type as string | undefined
            const sharedContext = buildDetailedContextSummary(input.sessionID, downstreamAgent)
              ?? buildContextSummary(input.sessionID)
            if (sharedContext) {
              enhancedPrompt = `${sharedContext}\n\n${enhancedPrompt}`
              log(`[${HOOK_NAME}] Injected shared context to chief_task`, {
                sessionID: input.sessionID,
                downstreamAgent,
                detailed: sharedContext.includes("DETAILED"),
              })
            }
          }
          
          output.args.prompt = enhancedPrompt + `\n<system-reminder>${SINGLE_TASK_DIRECTIVE}</system-reminder>`
          log(`[${HOOK_NAME}] Injected single-task directive to chief_task`, {
            sessionID: input.sessionID,
          })
        }

        if (input.sessionID && input.callID) {
          const tracker = getTrackerForSession(input.sessionID)
          const description = output.args.description as string | undefined ?? "Task"
          const category = output.args.category as string | undefined
          const agent = output.args.subagent_type as string | undefined ?? "deputy"

          tracker.addTask({
            id: input.callID,
            agent,
            category,
            description,
          })
          log(`[${HOOK_NAME}] Task started`, {
            sessionID: input.sessionID,
            callID: input.callID,
            agent,
            category,
          })
        }
      }
    },

    "tool.execute.after": async (
      input: ToolExecuteAfterInput,
      output: ToolExecuteAfterOutput
    ): Promise<void> => {
      const callerIsChief = isCallerOrchestrator(input.sessionID)
      const callerIsDeputy = isCallerDeputy(input.sessionID)
      
      if (!callerIsChief && !callerIsDeputy) {
        return
      }

      if (WRITE_EDIT_TOOLS.includes(input.tool)) {
        // Only Chief gets the direct work reminder (Deputy is allowed to edit)
        if (!callerIsChief) {
          return
        }
        let filePath = input.callID ? pendingFilePaths.get(input.callID) : undefined
        if (input.callID) {
          pendingFilePaths.delete(input.callID)
        }
        if (!filePath) {
          filePath = output.metadata?.filePath as string | undefined
        }
        if (filePath && !filePath.includes(ALLOWED_PATH_PREFIX)) {
          output.output = (output.output || "") + DIRECT_WORK_REMINDER
          log(`[${HOOK_NAME}] Direct work reminder appended`, {
            sessionID: input.sessionID,
            tool: input.tool,
            filePath,
          })
        }
        return
      }

      if (input.tool !== "chief_task") {
        return
      }

      const outputStr = output.output && typeof output.output === "string" ? output.output : ""
      const isBackgroundLaunch = outputStr.includes("Background task launched") || outputStr.includes("Background task resumed")
      
      if (isBackgroundLaunch) {
        return
      }

      if (input.sessionID && input.callID) {
        const tracker = getTrackerForSession(input.sessionID)
        const subagentSessionId = extractSessionIdFromOutput(outputStr)
        const isError = outputStr.includes("❌")

        if (isError) {
          tracker.failTask(input.callID)
        } else {
          tracker.completeTask(input.callID, subagentSessionId)
        }
      }
      
      if (output.output && typeof output.output === "string") {
        const gitStats = getGitDiffStats(ctx.directory)
        const fileChanges = formatFileChanges(gitStats)
        const subagentSessionId = extractSessionIdFromOutput(output.output)

        const progressTable = input.sessionID
          ? getTrackerForSession(input.sessionID).formatProgress()
          : ""

        const boulderState = readBoulderState(ctx.directory)

        if (boulderState) {
          const progress = getPlanProgress(boulderState.active_plan)

          if (input.sessionID && !boulderState.session_ids.includes(input.sessionID)) {
            appendSessionId(ctx.directory, input.sessionID)
            log(`[${HOOK_NAME}] Appended session to boulder`, {
              sessionID: input.sessionID,
              plan: boulderState.plan_name,
            })
          }

          output.output = `
## SUBAGENT WORK COMPLETED

${progressTable}

${fileChanges}
<system-reminder>
${buildOrchestratorReminder(boulderState.plan_name, progress, subagentSessionId)}
</system-reminder>`

          log(`[${HOOK_NAME}] Output transformed for orchestrator mode (boulder)`, {
            plan: boulderState.plan_name,
            progress: `${progress.completed}/${progress.total}`,
            fileCount: gitStats.length,
          })
        } else {
          const categoryMatch = output.output.match(/category:\s*(\w+)/)
          const category = categoryMatch?.[1]
          const summarized = summarizeOutput(output.output, { category })
          const formattedSummary = formatSummarizedOutput(summarized)

          let confidenceDirective = ""
          const agentType = detectAgentType(output.output, category) as AgentType | null
          
          if (input.sessionID && agentType && hasArtifacts(output.output)) {
            const tracker = getTrackerForSession(input.sessionID)
            const tasks = tracker.getProgress()
            const currentTask = input.callID ? tasks.find(t => t.id === input.callID) : tasks[tasks.length - 1]
            const taskDescription = currentTask?.description ?? "Unknown task"
            
            const artifact = parseArtifacts(output.output, agentType as SharedAgentType, taskDescription)
            if (artifact) {
              const artifactId = addArtifact(input.sessionID, artifact)
              log(`[${HOOK_NAME}] Artifact stored`, {
                sessionID: input.sessionID,
                artifactId,
                agentType,
              })
            }
          }
          
          if (agentType && hasQualityScores(output.output)) {
            const qualityAssessment = parseQualityScores(output.output, agentType)
            if (qualityAssessment) {
              confidenceDirective = `\n\n---\n${buildImprovementDirective(qualityAssessment, subagentSessionId)}\n---`
              log(`[${HOOK_NAME}] Multi-dimensional quality routing`, {
                sessionID: input.sessionID,
                agentType,
                overall: qualityAssessment.overall,
                weakest: qualityAssessment.weakest?.name,
                allPass: qualityAssessment.allPass,
              })
              if (qualityAssessment.overall < 0.5) {
                const journalEntry = buildFailureJournalEntry(
                  agentType,
                  qualityAssessment.overall,
                  1,
                  output.output,
                  subagentSessionId,
                )
                writeFailureJournal(ctx.directory, journalEntry)
              }
            }
          } else if (hasConfidenceScore(output.output) && agentType) {
            const confidenceResult = analyzeAgentOutput(output.output, subagentSessionId, agentType)
            if (confidenceResult.directive) {
              confidenceDirective = `\n\n---\n${confidenceResult.directive}\n---`
              log(`[${HOOK_NAME}] Legacy confidence routing`, {
                sessionID: input.sessionID,
                agentType,
                confidence: confidenceResult.confidence,
                recommendation: confidenceResult.recommendation,
              })
            }
            if (confidenceResult.recommendation === "escalate" && confidenceResult.confidence !== null) {
              const journalEntry = buildFailureJournalEntry(
                agentType,
                confidenceResult.confidence,
                3,
                output.output,
                subagentSessionId,
              )
              writeFailureJournal(ctx.directory, journalEntry)
            }
          } else if (agentType && !hasQualityScores(output.output) && !hasConfidenceScore(output.output)) {
            confidenceDirective = buildMissingScoresWarning(agentType, subagentSessionId)
            log(`[${HOOK_NAME}] Quality scores missing from agent output`, {
              sessionID: input.sessionID,
              agentType,
            })
          }

          output.output = `${formattedSummary}

${progressTable}

${fileChanges ? `\n${fileChanges}` : ""}${confidenceDirective}
<system-reminder>
${buildStandaloneVerificationReminder(subagentSessionId)}
</system-reminder>`

          log(`[${HOOK_NAME}] Output summarized for orchestrator`, {
            sessionID: input.sessionID,
            originalLength: summarized.originalLength,
            summaryLength: summarized.summary.length,
            wasTruncated: summarized.wasTruncated,
            fileCount: gitStats.length,
          })
        }
      }
    },
  }
}
