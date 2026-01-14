import type { McpFirecrawlConfig } from "./types"
import type { McpLocalConfig } from "./types-local"

export function createFirecrawlMcp(config: McpFirecrawlConfig): McpLocalConfig {
  const environment: Record<string, string> = {
    FIRECRAWL_API_KEY: config.api_key,
  }
  
  if (config.api_url) {
    environment.FIRECRAWL_API_URL = config.api_url
  }

  return {
    type: "local",
    command: ["npx", "-y", "firecrawl-mcp"],
    environment,
    enabled: true,
  }
}
