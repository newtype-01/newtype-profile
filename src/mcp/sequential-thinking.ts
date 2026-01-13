export type LocalMcpConfig = {
  command: string
  args: string[]
  env?: Record<string, string>
}

export function createSequentialThinkingMcp(): LocalMcpConfig {
  return {
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
  }
}
