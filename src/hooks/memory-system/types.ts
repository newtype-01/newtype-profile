export interface MemoryEntry {
  sessionID: string
  timestamp: string
  summary: string
  keyPoints: string[]
  decisions?: string[]
  todos?: string[]
}

export interface MemoryEntryMessage {
  role: string
  text: string
  timestamp?: string
}

export interface SessionState {
  saved: boolean
  saveTimer?: ReturnType<typeof setTimeout>
  messageCount: number
}

export interface MemorySystemState {
  sessionStates: Map<string, SessionState>
}
