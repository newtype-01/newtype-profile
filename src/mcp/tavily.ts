import type { McpTavilyConfig } from "./types"

export type StdioMcpConfig = {
  type: "stdio"
  command: string
  args: string[]
  env?: Record<string, string>
  enabled: boolean
}

export function createTavilyMcp(config: McpTavilyConfig): StdioMcpConfig {
  return {
    type: "stdio",
    command: "npx",
    args: ["-y", "tavily-mcp@latest"],
    env: {
      TAVILY_API_KEY: config.api_key,
    },
    enabled: true,
  }
}
