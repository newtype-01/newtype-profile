import type { McpFilesystemConfig } from "./types"
import type { StdioMcpConfig } from "./tavily"
import * as path from "path"
import * as os from "os"

function expandPath(p: string): string {
  if (p.startsWith("~/")) {
    return path.join(os.homedir(), p.slice(2))
  }
  return p
}

export function createFilesystemMcp(config: McpFilesystemConfig): StdioMcpConfig {
  const expandedDirs = config.directories.map(expandPath)

  return {
    type: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", ...expandedDirs],
    enabled: true,
  }
}
