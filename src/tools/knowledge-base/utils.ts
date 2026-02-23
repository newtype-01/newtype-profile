import type { MemoryListEntry, MemorySearchResult } from "./types"

export function formatMemoryList(entries: MemoryListEntry[]): string {
  if (entries.length === 0) {
    return "No memory entries found."
  }

  const lines: string[] = [
    "| Date | Session | Tags | Decisions | Summary |",
    "|------|---------|------|-----------|---------|",
  ]

  for (const entry of entries) {
    const sessionDisplay = entry.sessionID ? entry.sessionID.slice(0, 12) : "-"
    const tagsDisplay = entry.tags.length > 0 ? entry.tags.join(", ") : "-"
    const summaryDisplay = entry.summaryLine.length > 50
      ? entry.summaryLine.slice(0, 50) + "..."
      : entry.summaryLine

    lines.push(
      `| ${entry.date} | ${sessionDisplay} | ${tagsDisplay} | ${entry.decisionsCount} | ${summaryDisplay} |`
    )
  }

  return lines.join("\n")
}

export function formatMemorySearchResults(
  results: MemorySearchResult[],
  query: string
): string {
  if (results.length === 0) {
    return `No matches found for "${query}".`
  }

  const lines: string[] = [`Found ${results.length} match(es) for "${query}":\n`]

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const sessionDisplay = result.sessionID ? ` (${result.sessionID.slice(0, 12)})` : ""
    const tagsDisplay = result.tags.length > 0 ? ` [${result.tags.join(", ")}]` : ""

    lines.push(`${i + 1}. **${result.date}${sessionDisplay}**${tagsDisplay}`)
    lines.push(`   ${result.snippet}`)
    if (result.matchCount > 1) {
      lines.push(`   _(${result.matchCount} matches in this entry)_`)
    }
    lines.push("")
  }

  return lines.join("\n")
}

export function extractSnippet(
  text: string,
  query: string,
  contextChars: number = 80
): string {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const matchIndex = lowerText.indexOf(lowerQuery)

  if (matchIndex === -1) {
    return text.slice(0, contextChars * 2) + (text.length > contextChars * 2 ? "..." : "")
  }

  const start = Math.max(0, matchIndex - contextChars)
  const end = Math.min(text.length, matchIndex + query.length + contextChars)

  let snippet = text.slice(start, end)

  if (start > 0) {
    snippet = "..." + snippet
  }
  if (end < text.length) {
    snippet = snippet + "..."
  }

  return snippet.replace(/\n+/g, " ").trim()
}

export function extractSummaryLine(rawBlock: string): string {
  const lines = rawBlock.split("\n")

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) continue
    if (trimmed.startsWith("#")) continue
    if (trimmed.startsWith("SessionID:")) continue
    if (trimmed.startsWith("Full transcript:")) continue
    if (trimmed.startsWith("**") && trimmed.endsWith(":**")) continue

    return trimmed
  }

  return ""
}
