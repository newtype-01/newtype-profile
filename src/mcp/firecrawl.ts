import type { McpFirecrawlConfig } from "./types"
import type { StdioMcpConfig } from "./tavily"

export function createFirecrawlMcp(config: McpFirecrawlConfig): StdioMcpConfig {
  const env: Record<string, string> = {
    FIRECRAWL_API_KEY: config.api_key,
  }
  
  if (config.api_url) {
    env.FIRECRAWL_API_URL = config.api_url
  }

  return {
    type: "stdio",
    command: "npx",
    args: ["-y", "firecrawl-mcp"],
    env,
    enabled: true,
  }
}
