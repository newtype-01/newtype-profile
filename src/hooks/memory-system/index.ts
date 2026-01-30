import type { PluginInput } from "@opencode-ai/plugin"
import { HOOK_NAME, SAVE_GRACE_PERIOD_MS } from "./constants"
import {
  appendMemoryEntry,
  hasMemoryForSession,
  checkArchiveNeeded,
  archiveOldMemories,
  saveFullTranscript,
} from "./storage"
import { extractSessionSummary } from "./extractor"
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
      const text = extractMessageText(message.parts)
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
      const result = archiveOldMemories(ctx.directory)

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

      const entry = extractSessionSummary(sessionID, messages)
      const fullTranscript = extractFullTranscript(messages)
      const success = appendMemoryEntry(ctx.directory, entry)
      const fullSuccess = saveFullTranscript(ctx.directory, sessionID, fullTranscript)

      if (success && fullSuccess) {
        state.saved = true
        log(`[${HOOK_NAME}] Memory saved`, {
          sessionID,
          messageCount: messages.length,
          keyPoints: entry.keyPoints.length,
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
