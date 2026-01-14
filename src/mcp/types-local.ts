export type McpLocalConfig = {
  type: "local"
  command: string[]
  environment?: Record<string, string>
  enabled: boolean
}

export type McpRemoteConfig = {
  type: "remote"
  url: string
  headers?: Record<string, string>
  enabled: boolean
}
