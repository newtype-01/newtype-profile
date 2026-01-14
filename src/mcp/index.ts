import { websearch } from "./websearch"
import { createTavilyMcp } from "./tavily"
import { createFirecrawlMcp } from "./firecrawl"
import { createFilesystemMcp } from "./filesystem"
import { createSequentialThinkingMcp } from "./sequential-thinking"
import type { McpLocalConfig, McpRemoteConfig } from "./types-local"
import type { McpConfig } from "./types"
import { log } from "../shared"

export { McpNameSchema, type McpName, McpConfigSchema, type McpConfig } from "./types"
export { type McpLocalConfig, type McpRemoteConfig } from "./types-local"

type AnyMcpConfig = McpRemoteConfig | McpLocalConfig

const alwaysEnabledMcps: Record<string, McpRemoteConfig> = {
  websearch,
}

export function createBuiltinMcps(
  disabledMcps: string[] = [],
  mcpConfig?: McpConfig
): Record<string, AnyMcpConfig> {
  log("[MCP] createBuiltinMcps called", { disabledMcps, mcpConfig })

  const mcps: Record<string, AnyMcpConfig> = {}

  for (const [name, config] of Object.entries(alwaysEnabledMcps)) {
    if (!disabledMcps.includes(name)) {
      mcps[name] = config
    }
  }

  if (!disabledMcps.includes("sequential-thinking")) {
    const seqThinkingConfig = mcpConfig?.["sequential-thinking"]
    log("[MCP] sequential-thinking config", { seqThinkingConfig, willEnable: seqThinkingConfig !== false })
    if (seqThinkingConfig !== false) {
      mcps["sequential-thinking"] = createSequentialThinkingMcp()
      log("[MCP] sequential-thinking added to mcps", { mcpKeys: Object.keys(mcps) })
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

  log("[MCP] Final mcps object", { mcpKeys: Object.keys(mcps), mcps })
  return mcps
}
