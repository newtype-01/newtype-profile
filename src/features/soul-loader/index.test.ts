import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { loadSoulFile, DEFAULT_SOUL_TEMPLATE } from "./index"

describe("soul-loader", () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `soul-loader-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe("loadSoulFile", () => {
    test("returns undefined when SOUL.md does not exist", () => {
      // #given - empty directory
      // #when
      const result = loadSoulFile(testDir)
      // #then
      expect(result).toBeUndefined()
    })

    test("returns undefined when .opencode directory does not exist", () => {
      // #given - directory without .opencode
      // #when
      const result = loadSoulFile(testDir)
      // #then
      expect(result).toBeUndefined()
    })

    test("returns content when SOUL.md exists", () => {
      // #given
      const opencodePath = join(testDir, ".opencode")
      mkdirSync(opencodePath, { recursive: true })
      const soulContent = "<Communication_Style>\nTest content\n</Communication_Style>"
      writeFileSync(join(opencodePath, "SOUL.md"), soulContent)

      // #when
      const result = loadSoulFile(testDir)

      // #then
      expect(result).toBe(soulContent)
    })

    test("returns undefined when SOUL.md is empty", () => {
      // #given
      const opencodePath = join(testDir, ".opencode")
      mkdirSync(opencodePath, { recursive: true })
      writeFileSync(join(opencodePath, "SOUL.md"), "")

      // #when
      const result = loadSoulFile(testDir)

      // #then
      expect(result).toBeUndefined()
    })

    test("returns undefined when SOUL.md contains only whitespace", () => {
      // #given
      const opencodePath = join(testDir, ".opencode")
      mkdirSync(opencodePath, { recursive: true })
      writeFileSync(join(opencodePath, "SOUL.md"), "   \n\t\n  ")

      // #when
      const result = loadSoulFile(testDir)

      // #then
      expect(result).toBeUndefined()
    })

    test("trims whitespace from content", () => {
      // #given
      const opencodePath = join(testDir, ".opencode")
      mkdirSync(opencodePath, { recursive: true })
      const soulContent = "  <Communication_Style>Test</Communication_Style>  \n"
      writeFileSync(join(opencodePath, "SOUL.md"), soulContent)

      // #when
      const result = loadSoulFile(testDir)

      // #then
      expect(result).toBe("<Communication_Style>Test</Communication_Style>")
    })
  })

  describe("DEFAULT_SOUL_TEMPLATE", () => {
    test("contains Communication_Style section", () => {
      expect(DEFAULT_SOUL_TEMPLATE).toContain("<Communication_Style>")
      expect(DEFAULT_SOUL_TEMPLATE).toContain("</Communication_Style>")
    })

    test("contains Discussion_Style section", () => {
      expect(DEFAULT_SOUL_TEMPLATE).toContain("<Discussion_Style>")
      expect(DEFAULT_SOUL_TEMPLATE).toContain("</Discussion_Style>")
    })

    test("contains forbidden phrases guidance", () => {
      expect(DEFAULT_SOUL_TEMPLATE).toContain("禁止项")
    })
  })
})
