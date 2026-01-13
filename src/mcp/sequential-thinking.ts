import type { StdioMcpConfig } from "./tavily"

export function createSequentialThinkingMcp(): StdioMcpConfig {
  return {
    type: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    enabled: true,
  }
}
