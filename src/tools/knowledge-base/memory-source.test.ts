import { describe, test, expect } from "bun:test"
import { listMemoryEntries, searchMemoryEntries, getMemoryEntry } from "./memory-source"

describe("listMemoryEntries", () => {
  test("returns no entries message for non-existent directory", () => {
    // #given
    const projectDir = "/nonexistent/path/that/does/not/exist"

    // #when
    const result = listMemoryEntries(projectDir)

    // #then
    expect(result).toBe("No memory entries found.")
  })

  test("accepts limit parameter", () => {
    // #given
    const projectDir = "/nonexistent/path"

    // #when
    const result = listMemoryEntries(projectDir, 5)

    // #then
    expect(result).toBe("No memory entries found.")
  })
})

describe("searchMemoryEntries", () => {
  test("returns no matches message for non-existent directory", () => {
    // #given
    const projectDir = "/nonexistent/path/that/does/not/exist"

    // #when
    const result = searchMemoryEntries(projectDir, "test query")

    // #then
    expect(result).toBe('No matches found for "test query".')
  })

  test("accepts limit parameter", () => {
    // #given
    const projectDir = "/nonexistent/path"

    // #when
    const result = searchMemoryEntries(projectDir, "query", 5)

    // #then
    expect(result).toBe('No matches found for "query".')
  })
})

describe("getMemoryEntry", () => {
  test("returns not found message for non-existent date", () => {
    // #given
    const projectDir = "/nonexistent/path"
    const id = "2026-02-20/ses_abc123"

    // #when
    const result = getMemoryEntry(projectDir, id)

    // #then
    expect(result).toBe("Memory entry not found: 2026-02-20/ses_abc123")
  })

  test("returns error for invalid date format", () => {
    // #given
    const projectDir = "/some/path"
    const id = "invalid-date/ses_abc123"

    // #when
    const result = getMemoryEntry(projectDir, id)

    // #then
    expect(result).toContain("Invalid id format")
  })

  test("handles date-only id", () => {
    // #given
    const projectDir = "/nonexistent/path"
    const id = "2026-02-20"

    // #when
    const result = getMemoryEntry(projectDir, id)

    // #then
    expect(result).toBe("Memory entry not found: 2026-02-20")
  })

  test("accepts include_full parameter", () => {
    // #given
    const projectDir = "/nonexistent/path"
    const id = "2026-02-20/ses_abc123"

    // #when
    const result = getMemoryEntry(projectDir, id, true)

    // #then
    expect(result).toBe("Memory entry not found: 2026-02-20/ses_abc123")
  })
})
