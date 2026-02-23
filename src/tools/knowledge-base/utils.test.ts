import { describe, test, expect } from "bun:test"
import {
  extractSnippet,
  extractSummaryLine,
  formatMemoryList,
  formatMemorySearchResults,
} from "./utils"
import type { MemoryListEntry, MemorySearchResult } from "./types"

describe("extractSnippet", () => {
  test("extracts context around match in middle of text", () => {
    // #given
    const text = "This is a long piece of text that contains the keyword somewhere in the middle of the content."
    const query = "keyword"

    // #when
    const result = extractSnippet(text, query, 20)

    // #then
    expect(result).toContain("keyword")
    expect(result.startsWith("...")).toBe(true)
    expect(result.endsWith("...")).toBe(true)
  })

  test("handles match at start of text", () => {
    // #given
    const text = "keyword is at the start of this text content here"
    const query = "keyword"

    // #when
    const result = extractSnippet(text, query, 20)

    // #then
    expect(result).toContain("keyword")
    expect(result.startsWith("...")).toBe(false)
  })

  test("handles match at end of text", () => {
    // #given
    const text = "This text has the word at the end keyword"
    const query = "keyword"

    // #when
    const result = extractSnippet(text, query, 20)

    // #then
    expect(result).toContain("keyword")
    expect(result.endsWith("...")).toBe(false)
  })

  test("returns truncated text when no match found", () => {
    // #given
    const text = "This is some text without the search term"
    const query = "notfound"

    // #when
    const result = extractSnippet(text, query, 20)

    // #then
    expect(result).toBe("This is some text without the search ter...")
  })

  test("is case insensitive", () => {
    // #given
    const text = "This text contains KEYWORD in uppercase"
    const query = "keyword"

    // #when
    const result = extractSnippet(text, query, 20)

    // #then
    expect(result).toContain("KEYWORD")
  })

  test("replaces newlines with spaces", () => {
    // #given
    const text = "Line one\nLine two with keyword\nLine three"
    const query = "keyword"

    // #when
    const result = extractSnippet(text, query)

    // #then
    expect(result).not.toContain("\n")
    expect(result).toContain("keyword")
  })
})

describe("extractSummaryLine", () => {
  test("extracts first meaningful line skipping headers", () => {
    // #given
    const rawBlock = `## Session: abc123 (10:30)
SessionID: ses_abc123
Full transcript: \`.opencode/memory/full/ses_abc123.md\`

This is the actual summary content.

**Key Points:**
- Point 1`

    // #when
    const result = extractSummaryLine(rawBlock)

    // #then
    expect(result).toBe("This is the actual summary content.")
  })

  test("skips empty lines", () => {
    // #given
    const rawBlock = `## Header

   

Actual content here`

    // #when
    const result = extractSummaryLine(rawBlock)

    // #then
    expect(result).toBe("Actual content here")
  })

  test("skips section headers", () => {
    // #given
    const rawBlock = `**Tags:**
- tag1
**Decisions:**
- decision1
Actual summary line`

    // #when
    const result = extractSummaryLine(rawBlock)

    // #then
    expect(result).toBe("- tag1")
  })

  test("returns empty string when no meaningful content", () => {
    // #given
    const rawBlock = `## Header
SessionID: ses_123
Full transcript: path`

    // #when
    const result = extractSummaryLine(rawBlock)

    // #then
    expect(result).toBe("")
  })
})

describe("formatMemoryList", () => {
  test("returns no entries message when empty", () => {
    // #given
    const entries: MemoryListEntry[] = []

    // #when
    const result = formatMemoryList(entries)

    // #then
    expect(result).toBe("No memory entries found.")
  })

  test("formats entries as markdown table", () => {
    // #given
    const entries: MemoryListEntry[] = [
      {
        date: "2026-02-20",
        sessionID: "ses_abc123456789",
        tags: ["#project", "#api"],
        decisionsCount: 2,
        todosCount: 1,
        summaryLine: "Discussed API design patterns",
      },
    ]

    // #when
    const result = formatMemoryList(entries)

    // #then
    expect(result).toContain("| Date | Session | Tags | Decisions | Summary |")
    expect(result).toContain("| 2026-02-20 |")
    expect(result).toContain("ses_abc12345")
    expect(result).toContain("#project, #api")
    expect(result).toContain("| 2 |")
  })

  test("truncates long summary lines", () => {
    // #given
    const entries: MemoryListEntry[] = [
      {
        date: "2026-02-20",
        sessionID: "ses_abc123",
        tags: [],
        decisionsCount: 0,
        todosCount: 0,
        summaryLine: "This is a very long summary line that exceeds fifty characters and should be truncated",
      },
    ]

    // #when
    const result = formatMemoryList(entries)

    // #then
    expect(result).toContain("...")
    expect(result.length).toBeLessThan(300)
  })

  test("shows dash for missing sessionID", () => {
    // #given
    const entries: MemoryListEntry[] = [
      {
        date: "2026-02-20",
        sessionID: undefined,
        tags: [],
        decisionsCount: 0,
        todosCount: 0,
        summaryLine: "Summary",
      },
    ]

    // #when
    const result = formatMemoryList(entries)

    // #then
    expect(result).toContain("| - |")
  })
})

describe("formatMemorySearchResults", () => {
  test("returns no matches message when empty", () => {
    // #given
    const results: MemorySearchResult[] = []

    // #when
    const result = formatMemorySearchResults(results, "test query")

    // #then
    expect(result).toBe('No matches found for "test query".')
  })

  test("formats results with numbered list", () => {
    // #given
    const results: MemorySearchResult[] = [
      {
        date: "2026-02-20",
        sessionID: "ses_abc123456789",
        tags: ["#api"],
        snippet: "...discussing the API design...",
        matchCount: 1,
      },
    ]

    // #when
    const result = formatMemorySearchResults(results, "API")

    // #then
    expect(result).toContain('Found 1 match(es) for "API"')
    expect(result).toContain("1. **2026-02-20 (ses_abc12345)**")
    expect(result).toContain("[#api]")
    expect(result).toContain("...discussing the API design...")
  })

  test("shows match count when multiple matches in entry", () => {
    // #given
    const results: MemorySearchResult[] = [
      {
        date: "2026-02-20",
        sessionID: "ses_abc123",
        tags: [],
        snippet: "...snippet...",
        matchCount: 3,
      },
    ]

    // #when
    const result = formatMemorySearchResults(results, "test")

    // #then
    expect(result).toContain("_(3 matches in this entry)_")
  })

  test("omits session display when no sessionID", () => {
    // #given
    const results: MemorySearchResult[] = [
      {
        date: "2026-02-20",
        sessionID: undefined,
        tags: [],
        snippet: "snippet",
        matchCount: 1,
      },
    ]

    // #when
    const result = formatMemorySearchResults(results, "test")

    // #then
    expect(result).toContain("1. **2026-02-20**")
    expect(result).not.toContain("(ses_")
  })
})
