export interface KnowledgeBaseArgs {
  action: "list" | "search" | "get"
  source?: "memory" | "archive" | "knowledge"
  query?: string
  id?: string
  limit?: number
  include_full?: boolean
}

export interface MemoryListEntry {
  date: string
  sessionID?: string
  tags: string[]
  decisionsCount: number
  todosCount: number
  summaryLine: string  // first meaningful line of the raw block
}

export interface MemorySearchResult {
  date: string
  sessionID?: string
  tags: string[]
  snippet: string
  matchCount: number
}
