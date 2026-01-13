import { describe, expect, test } from "bun:test"
import { createBuiltinMcps } from "./index"

describe("createBuiltinMcps", () => {
  test("should return websearch and sequential-thinking by default", () => {
    //#given
    const disabledMcps: string[] = []

    //#when
    const result = createBuiltinMcps(disabledMcps)

    //#then
    expect(result).toHaveProperty("websearch")
    expect(result).toHaveProperty("sequential-thinking")
    expect(Object.keys(result)).toHaveLength(2)
  })

  test("should filter out disabled built-in MCPs", () => {
    //#given
    const disabledMcps = ["websearch"]

    //#when
    const result = createBuiltinMcps(disabledMcps)

    //#then
    expect(result).not.toHaveProperty("websearch")
    expect(result).toHaveProperty("sequential-thinking")
  })

  test("should filter out all built-in MCPs when all disabled", () => {
    //#given
    const disabledMcps = ["websearch", "sequential-thinking"]

    //#when
    const result = createBuiltinMcps(disabledMcps)

    //#then
    expect(result).not.toHaveProperty("websearch")
    expect(result).not.toHaveProperty("sequential-thinking")
    expect(Object.keys(result)).toHaveLength(0)
  })

  test("should ignore custom MCP names in disabled_mcps", () => {
    //#given
    const disabledMcps = ["playwright", "custom"]

    //#when
    const result = createBuiltinMcps(disabledMcps)

    //#then
    expect(result).toHaveProperty("websearch")
    expect(result).toHaveProperty("sequential-thinking")
  })

  test("should handle empty disabled_mcps by default", () => {
    //#given
    //#when
    const result = createBuiltinMcps()

    //#then
    expect(result).toHaveProperty("websearch")
    expect(result).toHaveProperty("sequential-thinking")
  })

  test("should only filter built-in MCPs, ignoring unknown names", () => {
    //#given
    const disabledMcps = ["playwright", "sqlite", "unknown-mcp"]

    //#when
    const result = createBuiltinMcps(disabledMcps)

    //#then
    expect(result).toHaveProperty("websearch")
    expect(result).toHaveProperty("sequential-thinking")
  })

  test("should add tavily MCP when config provided", () => {
    //#given
    const mcpConfig = {
      tavily: { api_key: "test-key" },
    }

    //#when
    const result = createBuiltinMcps([], mcpConfig)

    //#then
    expect(result).toHaveProperty("tavily")
    expect(result.tavily).toMatchObject({
      type: "stdio",
      command: "npx",
      enabled: true,
    })
  })

  test("should add firecrawl MCP when config provided", () => {
    //#given
    const mcpConfig = {
      firecrawl: { api_key: "fc-test" },
    }

    //#when
    const result = createBuiltinMcps([], mcpConfig)

    //#then
    expect(result).toHaveProperty("firecrawl")
    expect(result.firecrawl).toMatchObject({
      type: "stdio",
      command: "npx",
      enabled: true,
    })
  })

  test("should add filesystem MCP when directories provided", () => {
    //#given
    const mcpConfig = {
      filesystem: { directories: ["/tmp", "/home"] },
    }

    //#when
    const result = createBuiltinMcps([], mcpConfig)

    //#then
    expect(result).toHaveProperty("filesystem")
    expect(result.filesystem).toMatchObject({
      type: "stdio",
      command: "npx",
      enabled: true,
    })
  })

  test("should disable sequential-thinking when set to false", () => {
    //#given
    const mcpConfig = {
      "sequential-thinking": false,
    }

    //#when
    const result = createBuiltinMcps([], mcpConfig)

    //#then
    expect(result).not.toHaveProperty("sequential-thinking")
    expect(result).toHaveProperty("websearch")
  })

  test("should not add tavily when disabled even with config", () => {
    //#given
    const disabledMcps = ["tavily"]
    const mcpConfig = {
      tavily: { api_key: "test-key" },
    }

    //#when
    const result = createBuiltinMcps(disabledMcps, mcpConfig)

    //#then
    expect(result).not.toHaveProperty("tavily")
  })
})
