import {
  existsSync,
  mkdirSync,
  appendFileSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { join } from "node:path"
import {
  MEMORY_DIR,
  MEMORY_FILE,
  MAX_SUMMARY_LENGTH,
  ARCHIVE_AFTER_DAYS,
  FULL_MEMORY_DIR,
} from "./constants"
import type { MemoryEntry, MemoryEntryMessage } from "./types"

function ensureMemoryDir(projectDir: string): string {
  const memoryPath = join(projectDir, MEMORY_DIR)
  if (!existsSync(memoryPath)) {
    mkdirSync(memoryPath, { recursive: true })
  }
  return memoryPath
}

function ensureFullMemoryDir(projectDir: string): string {
  const memoryPath = join(projectDir, FULL_MEMORY_DIR)
  if (!existsSync(memoryPath)) {
    mkdirSync(memoryPath, { recursive: true })
  }
  return memoryPath
}

function getDateFileName(): string {
  const now = new Date()
  return `${now.toISOString().split("T")[0]}.md`
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function parseDateFromFileName(fileName: string): Date | null {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})\.md$/)
  if (!match) return null
  const date = new Date(match[1])
  return isNaN(date.getTime()) ? null : date
}

function getDaysDiff(date: Date): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

export interface ArchiveResult {
  archived: string[]
  totalFiles: number
  needsArchive: boolean
}

export function checkArchiveNeeded(projectDir: string): ArchiveResult {
  const memoryDir = join(projectDir, MEMORY_DIR)
  
  if (!existsSync(memoryDir)) {
    return { archived: [], totalFiles: 0, needsArchive: false }
  }

  const files = readdirSync(memoryDir).filter(f => f.endsWith(".md"))
  const oldFiles: string[] = []

  for (const file of files) {
    const fileDate = parseDateFromFileName(file)
    if (fileDate && getDaysDiff(fileDate) >= ARCHIVE_AFTER_DAYS) {
      oldFiles.push(file)
    }
  }

  return {
    archived: oldFiles,
    totalFiles: files.length,
    needsArchive: oldFiles.length > 0,
  }
}

export function archiveOldMemories(projectDir: string): ArchiveResult {
  const checkResult = checkArchiveNeeded(projectDir)
  
  if (!checkResult.needsArchive) {
    return checkResult
  }

  const memoryDir = join(projectDir, MEMORY_DIR)
  const memoryFilePath = join(projectDir, MEMORY_FILE)
  
  const archiveHeader = `\n\n## Archived: ${new Date().toISOString().split("T")[0]}\n\n`
  const archivedContent: string[] = [archiveHeader]

  for (const file of checkResult.archived.sort()) {
    try {
      const filePath = join(memoryDir, file)
      const content = readFileSync(filePath, "utf-8")
      
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/)
      const dateStr = dateMatch ? dateMatch[1] : file
      archivedContent.push(`### From ${dateStr}\n\n`)
      
      const contentWithoutHeader = content.replace(/^# Memory Log.*\n\n?/, "")
      archivedContent.push(contentWithoutHeader)
      
      unlinkSync(filePath)
    } catch {
      continue
    }
  }

  const needsFileHeader = !existsSync(memoryFilePath)
  if (needsFileHeader) {
    const fileHeader = `# Long-term Memory\n\nThis file contains archived conversation memories.\n`
    appendFileSync(memoryFilePath, fileHeader)
  }

  appendFileSync(memoryFilePath, archivedContent.join(""))

  return {
    archived: checkResult.archived,
    totalFiles: checkResult.totalFiles - checkResult.archived.length,
    needsArchive: false,
  }
}

export function appendMemoryEntry(projectDir: string, entry: MemoryEntry): boolean {
  try {
    const memoryDir = ensureMemoryDir(projectDir)
    const filePath = join(memoryDir, getDateFileName())

    const sections: string[] = [
      `## Session: ${entry.sessionID.slice(0, 12)} (${formatTime(new Date(entry.timestamp))})`,
      "",
    ]

    if (entry.summary) {
      const truncatedSummary =
        entry.summary.length > MAX_SUMMARY_LENGTH
          ? entry.summary.slice(0, MAX_SUMMARY_LENGTH) + "..."
          : entry.summary
      sections.push(truncatedSummary, "")
    }

    if (entry.keyPoints && entry.keyPoints.length > 0) {
      sections.push("**Key Points:**")
      entry.keyPoints.forEach((point) => sections.push(`- ${point}`))
      sections.push("")
    }

    if (entry.decisions && entry.decisions.length > 0) {
      sections.push("**Decisions:**")
      entry.decisions.forEach((decision) => sections.push(`- ${decision}`))
      sections.push("")
    }

    if (entry.todos && entry.todos.length > 0) {
      sections.push("**TODOs:**")
      entry.todos.forEach((todo) => sections.push(`- [ ] ${todo}`))
      sections.push("")
    }

    sections.push("---", "")

    const content = sections.join("\n")

    const needsHeader = !existsSync(filePath)
    if (needsHeader) {
      const header = `# Memory Log - ${new Date().toISOString().split("T")[0]}\n\n`
      appendFileSync(filePath, header)
    }

    appendFileSync(filePath, content)
    return true
  } catch {
    return false
  }
}

export function hasMemoryForSession(projectDir: string, sessionID: string): boolean {
  try {
    const memoryDir = join(projectDir, MEMORY_DIR)
    const filePath = join(memoryDir, getDateFileName())

    if (!existsSync(filePath)) return false

    const content = readFileSync(filePath, "utf-8")
    return content.includes(`Session: ${sessionID.slice(0, 12)}`)
  } catch {
    return false
  }
}

export function saveFullTranscript(
  projectDir: string,
  sessionID: string,
  messages: MemoryEntryMessage[]
): boolean {
  try {
    const memoryDir = ensureFullMemoryDir(projectDir)
    const safeSessionID = sessionID.replace(/[^a-zA-Z0-9_-]/g, "_")
    const filePath = join(memoryDir, `${safeSessionID}.md`)

    const sections: string[] = [
      `# Full Transcript - ${sessionID}`,
      `Generated: ${new Date().toISOString()}`,
      "",
    ]

    for (const message of messages) {
      const timestamp = message.timestamp ? ` (${message.timestamp})` : ""
      sections.push(
        `## ${message.role.toUpperCase()}${timestamp}`,
        "",
        message.text || "",
        "",
        "---",
        ""
      )
    }

    writeFileSync(filePath, sections.join("\n"))
    return true
  } catch {
    return false
  }
}
