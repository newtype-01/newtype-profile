import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { MEMORY_DIR } from "../../hooks/memory-system/constants"
import { parseDailyLogSessions, getFullTranscriptPath } from "../../hooks/memory-system/storage"
import type { MemoryListEntry, MemorySearchResult } from "./types"
import {
  formatMemoryList,
  formatMemorySearchResults,
  extractSnippet,
  extractSummaryLine,
} from "./utils"

export function listMemoryEntries(projectDir: string, limit?: number): string {
  const memoryDir = join(projectDir, MEMORY_DIR)

  if (!existsSync(memoryDir)) {
    return "No memory entries found."
  }

  const files = readdirSync(memoryDir)
    .filter((f) => f.endsWith(".md") && f !== "full")
    .sort()
    .reverse()

  const entries: MemoryListEntry[] = []
  const effectiveLimit = limit ?? 20

  for (const file of files) {
    if (entries.length >= effectiveLimit) break

    const filePath = join(memoryDir, file)
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})\.md$/)
    if (!dateMatch) continue

    const date = dateMatch[1]

    try {
      const content = readFileSync(filePath, "utf-8")
      const sessions = parseDailyLogSessions(content)

      for (const session of sessions) {
        if (entries.length >= effectiveLimit) break

        entries.push({
          date,
          sessionID: session.sessionID,
          tags: session.tags,
          decisionsCount: session.decisions.length,
          todosCount: session.todos.length,
          summaryLine: extractSummaryLine(session.raw),
        })
      }
    } catch {
      continue
    }
  }

  return formatMemoryList(entries)
}

export function searchMemoryEntries(
  projectDir: string,
  query: string,
  limit?: number
): string {
  const memoryDir = join(projectDir, MEMORY_DIR)

  if (!existsSync(memoryDir)) {
    return `No matches found for "${query}".`
  }

  const files = readdirSync(memoryDir)
    .filter((f) => f.endsWith(".md") && f !== "full")
    .sort()
    .reverse()

  const results: MemorySearchResult[] = []
  const effectiveLimit = limit ?? 10
  const lowerQuery = query.toLowerCase()

  for (const file of files) {
    if (results.length >= effectiveLimit) break

    const filePath = join(memoryDir, file)
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})\.md$/)
    if (!dateMatch) continue

    const date = dateMatch[1]

    try {
      const content = readFileSync(filePath, "utf-8")
      const sessions = parseDailyLogSessions(content)

      for (const session of sessions) {
        if (results.length >= effectiveLimit) break

        const lowerRaw = session.raw.toLowerCase()
        if (!lowerRaw.includes(lowerQuery)) continue

        const matches = lowerRaw.split(lowerQuery).length - 1

        results.push({
          date,
          sessionID: session.sessionID,
          tags: session.tags,
          snippet: extractSnippet(session.raw, query),
          matchCount: matches,
        })
      }
    } catch {
      continue
    }
  }

  return formatMemorySearchResults(results, query)
}

export function getMemoryEntry(
  projectDir: string,
  id: string,
  includeFull?: boolean
): string {
  const parts = id.split("/")
  const date = parts[0]
  const sessionID = parts[1]

  const dateMatch = date.match(/^\d{4}-\d{2}-\d{2}$/)
  if (!dateMatch) {
    return `Invalid id format: ${id}. Expected YYYY-MM-DD or YYYY-MM-DD/sessionID`
  }

  const memoryDir = join(projectDir, MEMORY_DIR)
  const filePath = join(memoryDir, `${date}.md`)

  if (!existsSync(filePath)) {
    return `Memory entry not found: ${id}`
  }

  try {
    const content = readFileSync(filePath, "utf-8")
    const sessions = parseDailyLogSessions(content)

    if (!sessionID) {
      const output = sessions.map((s) => s.raw).join("\n\n---\n\n")
      return output || `Memory entry not found: ${id}`
    }

    const session = sessions.find(
      (s) => s.sessionID === sessionID || s.sessionID?.startsWith(sessionID)
    )

    if (!session) {
      return `Memory entry not found: ${id}`
    }

    let output = session.raw

    if (includeFull && session.sessionID) {
      const fullPath = getFullTranscriptPath(projectDir, session.sessionID)
      if (existsSync(fullPath)) {
        try {
          const fullContent = readFileSync(fullPath, "utf-8")
          output += "\n\n---\n\n## Full Transcript\n\n" + fullContent
        } catch {
          output += "\n\n_(Full transcript could not be read)_"
        }
      } else {
        output += "\n\n_(Full transcript not available)_"
      }
    }

    return output
  } catch (error) {
    return `Error reading memory entry: ${error instanceof Error ? error.message : String(error)}`
  }
}
