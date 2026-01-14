import type { McpTavilyConfig } from "./types"
import type { McpLocalConfig } from "./types-local"

export function createTavilyMcp(config: McpTavilyConfig): McpLocalConfig {
  return {
    type: "local",
    command: ["npx", "-y", "tavily-mcp@latest"],
    environment: {
      TAVILY_API_KEY: config.api_key,
    },
    enabled: true,
  }
}
