import { websearch } from "./websearch"
import { createTavilyMcp, type StdioMcpConfig } from "./tavily"
import { createFirecrawlMcp } from "./firecrawl"
import { createFilesystemMcp } from "./filesystem"
import { createSequentialThinkingMcp } from "./sequential-thinking"
import type { McpConfig } from "./types"

export { McpNameSchema, type McpName, McpConfigSchema, type McpConfig } from "./types"
export type { StdioMcpConfig } from "./tavily"

type RemoteMcpConfig = {
  type: "remote"
  url: string
  enabled: boolean
  headers?: Record<string, string>
}

type AnyMcpConfig = RemoteMcpConfig | StdioMcpConfig

const alwaysEnabledMcps: Record<string, RemoteMcpConfig> = {
  websearch,
}

export function createBuiltinMcps(
  disabledMcps: string[] = [],
  mcpConfig?: McpConfig
): Record<string, AnyMcpConfig> {
  const mcps: Record<string, AnyMcpConfig> = {}

  for (const [name, config] of Object.entries(alwaysEnabledMcps)) {
    if (!disabledMcps.includes(name)) {
      mcps[name] = config
    }
  }

  if (!disabledMcps.includes("sequential-thinking")) {
    const seqThinkingConfig = mcpConfig?.["sequential-thinking"]
    if (seqThinkingConfig !== false) {
      mcps["sequential-thinking"] = createSequentialThinkingMcp()
    }
  }

  if (mcpConfig?.tavily && !disabledMcps.includes("tavily")) {
    mcps.tavily = createTavilyMcp(mcpConfig.tavily)
  }

  if (mcpConfig?.firecrawl && !disabledMcps.includes("firecrawl")) {
    mcps.firecrawl = createFirecrawlMcp(mcpConfig.firecrawl)
  }

  if (mcpConfig?.filesystem && !disabledMcps.includes("filesystem")) {
    mcps.filesystem = createFilesystemMcp(mcpConfig.filesystem)
  }

  return mcps
}
