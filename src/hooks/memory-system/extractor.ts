import type { MemoryEntry } from "./types"

interface MessagePart {
  type: string
  text?: string
}

interface MessageInfo {
  role: string
  id: string
}

interface MessageWrapper {
  info: MessageInfo
  parts: MessagePart[]
}

function extractTextFromParts(parts: MessagePart[]): string {
  return parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)
    .join("\n")
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function extractSessionSummary(
  sessionID: string,
  messages: MessageWrapper[]
): MemoryEntry {
  const userMessages: string[] = []
  const assistantMessages: string[] = []
  const tags: string[] = []

  for (const msg of messages) {
    const text = extractTextFromParts(msg.parts)
    if (!text.trim()) continue

    const tagMatches = text.matchAll(/#([a-zA-Z][\w-]{1,30})/g)
    for (const match of tagMatches) {
      const tag = match[1]?.toLowerCase()
      if (tag) tags.push(`#${tag}`)
    }

    if (msg.info.role === "user") {
      userMessages.push(truncateText(text, 500))
    } else if (msg.info.role === "assistant") {
      assistantMessages.push(truncateText(text, 500))
    }
  }

  const keyPoints: string[] = []
  const decisions: string[] = []
  const todos: string[] = []

  for (const text of [...userMessages, ...assistantMessages]) {
    const decisionPatterns = [
      /决定[：:]\s*(.+)/g,
      /决策[：:]\s*(.+)/g,
      /chosen?[：:]\s*(.+)/gi,
      /decided?[：:]\s*(.+)/gi,
      /will use\s+(.+)/gi,
      /going with\s+(.+)/gi,
    ]
    for (const pattern of decisionPatterns) {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        if (match[1] && match[1].length < 200) {
          decisions.push(truncateText(match[1].trim(), 100))
        }
      }
    }

    const todoPatterns = [
      /TODO[：:]\s*(.+)/gi,
      /待办[：:]\s*(.+)/g,
      /需要[：:]\s*(.+)/g,
      /接下来[：:]\s*(.+)/g,
    ]
    for (const pattern of todoPatterns) {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        if (match[1] && match[1].length < 200) {
          todos.push(truncateText(match[1].trim(), 100))
        }
      }
    }
  }

  const firstUserMessage = userMessages[0] || ""
  const summary = firstUserMessage
    ? `**Topic:** ${truncateText(firstUserMessage, 300)}`
    : "No summary available"

  if (userMessages.length > 0) {
    keyPoints.push(`User asked about: ${truncateText(userMessages[0], 100)}`)
  }
  if (assistantMessages.length > 0) {
    const lastResponse = assistantMessages[assistantMessages.length - 1]
    keyPoints.push(`Final response addressed: ${truncateText(lastResponse, 100)}`)
  }

  return {
    sessionID,
    timestamp: new Date().toISOString(),
    summary,
    keyPoints: [...new Set(keyPoints)].slice(0, 5),
    decisions: [...new Set(decisions)].slice(0, 3),
    todos: [...new Set(todos)].slice(0, 3),
    tags: [...new Set(tags)].slice(0, 5),
  }
}
