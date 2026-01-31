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
  DEEP_SUMMARY_TAGS,
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

export interface FullTranscriptBlock {
  role: string
  content: string
}

export interface MemorySummary {
  userPreferences: string[]
  decisions: string[]
  lessons: string[]
}

export interface DailyLogSession {
  sessionID?: string
  raw: string
  tags: string[]
  decisions: string[]
  todos: string[]
}

function extractSectionItems(block: string, title: string): string[] {
  const pattern = new RegExp(`\\*\\*${title}:\\*\\*\\n([\\s\\S]*?)(?:\\n\\*\\*|$)`)
  const match = block.match(pattern)
  if (!match) return []
  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^\-\s+/, ""))
    .filter(Boolean)
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

export async function archiveOldMemories(
  projectDir: string,
  options?: {
    deepSummarizer?: (session: DailyLogSession, fullContent: string) => Promise<string | null>
  }
): Promise<ArchiveResult> {
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
      const sessions = parseDailyLogSessions(content)
      
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/)
      const dateStr = dateMatch ? dateMatch[1] : file
      archivedContent.push(`### From ${dateStr}\n\n`)

      const summaryBlocks: string[] = []
      const deepBlocks: string[] = []

      for (const session of sessions) {
        summaryBlocks.push(session.raw, "", "---", "")

        if (session.sessionID && shouldDeepSummarize(session)) {
          const fullPath = getFullTranscriptPath(projectDir, session.sessionID)
          if (existsSync(fullPath)) {
            const fullContent = readFileSync(fullPath, "utf-8")
            let deepSummary: string | null = null
            if (options?.deepSummarizer) {
              deepSummary = await options.deepSummarizer(session, fullContent)
            }

            if (!deepSummary) {
              const summary = summarizeFullTranscript(fullContent)
              if (
                summary.userPreferences.length > 0 ||
                summary.decisions.length > 0 ||
                summary.lessons.length > 0
              ) {
                deepSummary = [
                  summary.userPreferences.length > 0
                    ? [
                        "**User Preferences:**",
                        ...summary.userPreferences.map((item) => `- ${item}`),
                        "",
                      ].join("\n")
                    : "",
                  summary.decisions.length > 0
                    ? [
                        "**Decisions Made:**",
                        ...summary.decisions.map((item) => `- ${item}`),
                        "",
                      ].join("\n")
                    : "",
                  summary.lessons.length > 0
                    ? [
                        "**Lessons Learned:**",
                        ...summary.lessons.map((item) => `- ${item}`),
                        "",
                      ].join("\n")
                    : "",
                ]
                  .filter(Boolean)
                  .join("\n")
              }
            }

            if (deepSummary) {
              deepBlocks.push(
                `#### Deep Summary (${session.sessionID.slice(0, 12)})`,
                "",
                deepSummary.trim(),
                "",
                "---",
                ""
              )
            }
          }
        }
      }

      archivedContent.push(summaryBlocks.join("\n"))
      if (deepBlocks.length > 0) {
        archivedContent.push("#### Deep Summaries\n\n")
        archivedContent.push(deepBlocks.join("\n"))
      }
      
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

export function parseDailyLogSessions(content: string): DailyLogSession[] {
  const cleaned = content.replace(/^# Memory Log.*\n\n?/, "")
  const blocks = cleaned
    .split(/\n---\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks.map((block) => {
    const sessionMatch = block.match(/SessionID:\s*(.+)/)
    const tags = extractSectionItems(block, "Tags")
    const decisions = extractSectionItems(block, "Decisions")
    const todos = extractSectionItems(block, "TODOs").map((item) =>
      item.replace(/^\[ \]\s+/, "")
    )

    return {
      sessionID: sessionMatch?.[1]?.trim(),
      raw: block,
      tags,
      decisions,
      todos,
    }
  })
}

export function shouldDeepSummarize(session: DailyLogSession): boolean {
  if (session.decisions.length > 0 || session.todos.length > 0) return true
  return session.tags.some((tag) =>
    (DEEP_SUMMARY_TAGS as readonly string[]).includes(tag.toLowerCase())
  )
}

export function getFullTranscriptPath(projectDir: string, sessionID: string): string {
  const safeSessionID = sessionID.replace(/[^a-zA-Z0-9_-]/g, "_")
  return join(projectDir, FULL_MEMORY_DIR, `${safeSessionID}.md`)
}

export function parseFullTranscript(content: string): FullTranscriptBlock[] {
  const cleaned = content.replace(/^# Full Transcript.*\n.*\n\n?/, "")
  const blocks = cleaned
    .split(/\n---\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks.map((block) => {
    const lines = block.split("\n")
    const title = lines.shift() || ""
    const roleMatch = title.match(/^##\s+([A-Z]+)\b/)
    return {
      role: roleMatch?.[1]?.toLowerCase() || "unknown",
      content: lines.join("\n").trim(),
    }
  })
}

export function summarizeFullTranscript(content: string): MemorySummary {
  const blocks = parseFullTranscript(content)
  const userPreferences: string[] = []
  const decisions: string[] = []
  const lessons: string[] = []

  for (const block of blocks) {
    const text = block.content
    const preferencePatterns = [
      /偏好[：:](.+)/g,
      /喜欢[：:](.+)/g,
      /prefer(?:s|red)?[：:](.+)/gi,
      /preference(?:s)?[：:](.+)/gi,
    ]
    for (const pattern of preferencePatterns) {
      for (const match of text.matchAll(pattern)) {
        if (match[1]) userPreferences.push(match[1].trim())
      }
    }

    const decisionPatterns = [
      /决定[：:](.+)/g,
      /决策[：:](.+)/g,
      /decided?[：:](.+)/gi,
      /chosen?[：:](.+)/gi,
      /going with\s+(.+)/gi,
      /will use\s+(.+)/gi,
    ]
    for (const pattern of decisionPatterns) {
      for (const match of text.matchAll(pattern)) {
        if (match[1]) decisions.push(match[1].trim())
      }
    }

    const lessonPatterns = [
      /结论[：:](.+)/g,
      /经验[：:](.+)/g,
      /教训[：:](.+)/g,
      /lesson(?:s)?[：:](.+)/gi,
      /insight(?:s)?[：:](.+)/gi,
    ]
    for (const pattern of lessonPatterns) {
      for (const match of text.matchAll(pattern)) {
        if (match[1]) lessons.push(match[1].trim())
      }
    }
  }

  const unique = (items: string[]) => Array.from(new Set(items)).slice(0, 10)
  return {
    userPreferences: unique(userPreferences),
    decisions: unique(decisions),
    lessons: unique(lessons),
  }
}

export function appendMemoryEntry(projectDir: string, entry: MemoryEntry): boolean {
  try {
    const memoryDir = ensureMemoryDir(projectDir)
    const filePath = join(memoryDir, getDateFileName())

    const sections: string[] = [
      `## Session: ${entry.sessionID.slice(0, 12)} (${formatTime(new Date(entry.timestamp))})`,
      `SessionID: ${entry.sessionID}`,
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

    if (entry.tags && entry.tags.length > 0) {
      sections.push("**Tags:**")
      entry.tags.forEach((tag) => sections.push(`- ${tag}`))
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
    return (
      content.includes(`SessionID: ${sessionID}`) ||
      content.includes(`Session: ${sessionID.slice(0, 12)}`)
    )
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
