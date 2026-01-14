import type { McpLocalConfig } from "./types-local"

export function createSequentialThinkingMcp(): McpLocalConfig {
  return {
    type: "local",
    command: ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"],
    enabled: true,
  }
}
