import type { McpFilesystemConfig } from "./types"
import type { McpLocalConfig } from "./types-local"
import * as path from "path"
import * as os from "os"

function expandPath(p: string): string {
  if (p.startsWith("~/")) {
    return path.join(os.homedir(), p.slice(2))
  }
  return p
}

export function createFilesystemMcp(config: McpFilesystemConfig): McpLocalConfig {
  const expandedDirs = config.directories.map(expandPath)

  return {
    type: "local",
    command: ["npx", "-y", "@modelcontextprotocol/server-filesystem", ...expandedDirs],
    enabled: true,
  }
}
