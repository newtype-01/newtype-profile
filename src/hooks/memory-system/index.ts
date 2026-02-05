import type { PluginInput } from "@opencode-ai/plugin"
import { HOOK_NAME, SAVE_GRACE_PERIOD_MS } from "./constants"
import {
  appendMemoryEntry,
  hasMemoryForSession,
  checkArchiveNeeded,
  archiveOldMemories,
  saveFullTranscript,
} from "./storage"
import {
  prepareMessagesForSummary,
  formatTranscriptForLLM,
  generateSummaryPrompt,
  parseLLMSummary,
  extractSessionSummaryFallback,
  stripSystemInstructionPrefix,
} from "./extractor"
import { log } from "../../shared/logger"
import { getMainSessionID, subagentSessions } from "../../features/claude-code-session-state"

interface SessionState {
  saved: boolean
  saveTimer?: ReturnType<typeof setTimeout>
}

interface MessagePart {
  type: string
  text?: string
}

interface MessageInfo {
  role: string
  id: string
  sessionID?: string
}

interface MessageWrapper {
  info: MessageInfo
  parts: MessagePart[]
}

interface FullTranscriptMessage {
  role: string
  text: string
  timestamp?: string
}

function extractMessageText(parts: MessagePart[]): string {
  return parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)
    .join("\n")
}

function extractFullTranscript(messages: MessageWrapper[]): FullTranscriptMessage[] {
  return messages
    .map((message) => {
      let text = extractMessageText(message.parts)
      
      if (message.info.role === "user") {
        text = stripSystemInstructionPrefix(text)
      }
      
      return {
        role: message.info.role,
        text,
      }
    })
    .filter((message) => message.text.trim().length > 0)
}

interface ArchiveState {
  inProgress: boolean
  lastCheck: number
}

const ARCHIVE_CHECK_COOLDOWN_MS = 60 * 60 * 1000

export function createMemorySystemHook(ctx: PluginInput) {
  const sessionStates = new Map<string, SessionState>()
  const archiveState: ArchiveState = { inProgress: false, lastCheck: 0 }

  async function runArchivistSummary(prompt: string): Promise<string | null> {
    try {
      const createResult = await ctx.client.session.create({
        body: {
          title: "Memory: Deep Summary",
        },
      })

      if (createResult.error) return null

      const sessionID = createResult.data.id
      subagentSessions.add(sessionID)

      await ctx.client.session.prompt({
        path: { id: sessionID },
        body: {
          agent: "archivist",
          parts: [{ type: "text", text: prompt }],
        },
      })

      const messagesResult = await ctx.client.session.messages({
        path: { id: sessionID },
      })
      const messages = ((messagesResult as { data?: unknown }).data ?? messagesResult) as MessageWrapper[]
      const assistantMessages = messages.filter((m) => m.info.role === "assistant")
      const last = assistantMessages[assistantMessages.length - 1]

      const text = last?.parts
        .filter((p) => p.type === "text" && p.text)
        .map((p) => p.text)
        .join("\n")
        .trim()

      return text || null
    } catch {
      return null
    }
  }

  function getOrCreateState(sessionID: string): SessionState {
    let state = sessionStates.get(sessionID)
    if (!state) {
      state = { saved: false }
      sessionStates.set(sessionID, state)
    }
    return state
  }

  function cancelPendingSave(sessionID: string): void {
    const state = sessionStates.get(sessionID)
    if (state?.saveTimer) {
      clearTimeout(state.saveTimer)
      state.saveTimer = undefined
    }
  }

  function cleanup(sessionID: string): void {
    cancelPendingSave(sessionID)
    sessionStates.delete(sessionID)
  }

  async function checkAndArchive(): Promise<void> {
    if (archiveState.inProgress) return
    
    const now = Date.now()
    if (now - archiveState.lastCheck < ARCHIVE_CHECK_COOLDOWN_MS) return
    
    archiveState.lastCheck = now

    const checkResult = checkArchiveNeeded(ctx.directory)
    if (!checkResult.needsArchive) return

    archiveState.inProgress = true

    await ctx.client.tui
      .showToast({
        body: {
          title: "Memory Consolidation",
          message: `Archiving ${checkResult.archived.length} old memory logs...`,
          variant: "warning",
          duration: 3000,
        },
      })
      .catch(() => {})

    log(`[${HOOK_NAME}] Auto-archiving old memories`, {
      files: checkResult.archived,
      count: checkResult.archived.length,
    })

    try {
      const result = await archiveOldMemories(ctx.directory, {
        deepSummarizer: async (session, fullContent) => {
          const prompt = `Summarize the full transcript into long-term memory entries.\n\nRules:\n- Output Markdown only.\n- Use sections only when relevant.\n- Keep each bullet concise (<120 chars).\n- Do NOT include sensitive data or raw conversation.\n- If nothing important, return "".\n\nRequired sections (only if non-empty):\n**User Preferences:**\n- ...\n**Decisions Made:**\n- ...\n**Lessons Learned:**\n- ...\n\nTranscript:\n${fullContent}`

          try {
            return await runArchivistSummary(prompt)
          } catch {
            return null
          }
        },
      })

      await ctx.client.tui
        .showToast({
          body: {
            title: "Memory Archived",
            message: `${result.archived.length} logs consolidated to MEMORY.md`,
            variant: "success",
            duration: 2000,
          },
        })
        .catch(() => {})

      log(`[${HOOK_NAME}] Archive complete`, {
        archived: result.archived.length,
        remaining: result.totalFiles,
      })
    } catch (err) {
      log(`[${HOOK_NAME}] Archive failed`, { error: String(err) })
    } finally {
      archiveState.inProgress = false
    }
  }

  async function saveSessionMemory(sessionID: string): Promise<void> {
    const state = getOrCreateState(sessionID)

    if (state.saved) {
      log(`[${HOOK_NAME}] Already saved`, { sessionID })
      return
    }

    if (hasMemoryForSession(ctx.directory, sessionID)) {
      state.saved = true
      log(`[${HOOK_NAME}] Already has memory entry`, { sessionID })
      return
    }

    try {
      const resp = await ctx.client.session.messages({
        path: { id: sessionID },
        query: { directory: ctx.directory },
      })

      const messages = (resp.data ?? resp) as MessageWrapper[]
      const fullTranscript = extractFullTranscript(messages)
      const fullSuccess = saveFullTranscript(ctx.directory, sessionID, fullTranscript)

      const preparedMessages = prepareMessagesForSummary(messages)

      if (preparedMessages.length === 0) {
        log(`[${HOOK_NAME}] No meaningful content after filtering`, { sessionID })
        state.saved = true
        return
      }

      const transcript = formatTranscriptForLLM(preparedMessages)
      const summaryPrompt = generateSummaryPrompt(transcript)

      let entry = null
      const llmSummary = await runArchivistSummary(summaryPrompt)

      if (llmSummary) {
        entry = parseLLMSummary(sessionID, llmSummary)
        if (entry) {
          log(`[${HOOK_NAME}] LLM summary generated`, { sessionID })
        }
      }

      if (!entry) {
        log(`[${HOOK_NAME}] Using fallback extraction`, { sessionID })
        entry = extractSessionSummaryFallback(sessionID, messages)
      }

      const success = appendMemoryEntry(ctx.directory, entry)

      if (success && fullSuccess) {
        state.saved = true
        log(`[${HOOK_NAME}] Memory saved`, {
          sessionID,
          messageCount: messages.length,
          keyPoints: entry.keyPoints.length,
          usedLLM: llmSummary !== null,
        })

        await checkAndArchive()
      } else {
        log(`[${HOOK_NAME}] Failed to save memory`, {
          sessionID,
          summarySaved: success,
          fullSaved: fullSuccess,
        })
      }
    } catch (err) {
      log(`[${HOOK_NAME}] Error saving memory`, { sessionID, error: String(err) })
    }
  }

  function scheduleSave(sessionID: string): void {
    const state = getOrCreateState(sessionID)

    cancelPendingSave(sessionID)

    state.saveTimer = setTimeout(() => {
      state.saveTimer = undefined
      saveSessionMemory(sessionID)
    }, SAVE_GRACE_PERIOD_MS)

    log(`[${HOOK_NAME}] Save scheduled`, { sessionID, delayMs: SAVE_GRACE_PERIOD_MS })
  }

  return {
    event: async ({ event }: { event: { type: string; properties?: unknown } }) => {
      const props = event.properties as Record<string, unknown> | undefined

      if (event.type === "session.idle") {
        const sessionID = props?.sessionID as string | undefined
        if (!sessionID) return

        const mainSessionID = getMainSessionID()
        const isMainSession = sessionID === mainSessionID
        const isSubagent = subagentSessions.has(sessionID)

        if (isSubagent) {
          log(`[${HOOK_NAME}] Skipping subagent session`, { sessionID })
          return
        }

        if (mainSessionID && !isMainSession) {
          log(`[${HOOK_NAME}] Skipping non-main session`, { sessionID, mainSessionID })
          return
        }

        scheduleSave(sessionID)
      }

      if (event.type === "message.updated") {
        const info = props?.info as MessageInfo | undefined
        const sessionID = info?.sessionID
        if (sessionID) {
          cancelPendingSave(sessionID)
        }
      }

      if (event.type === "session.deleted") {
        const sessionInfo = props?.info as { id?: string } | undefined
        if (sessionInfo?.id) {
          const state = sessionStates.get(sessionInfo.id)
          if (state && !state.saved) {
            cancelPendingSave(sessionInfo.id)
            await saveSessionMemory(sessionInfo.id)
          }
          cleanup(sessionInfo.id)
          log(`[${HOOK_NAME}] Session deleted, cleaned up`, { sessionID: sessionInfo.id })
        }
      }
    },
  }
}

export { HOOK_NAME } from "./constants"
