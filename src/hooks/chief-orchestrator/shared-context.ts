import { log } from "../../shared/logger"

export type AgentType = "researcher" | "fact-checker" | "archivist" | "extractor" | "writer" | "editor"

export interface Source {
  url?: string
  title: string
  type: "primary" | "secondary" | "official" | "news" | "academic" | "other"
  credibility?: "high" | "medium" | "low"
  excerpt?: string
}

export interface Finding {
  claim: string
  confidence: number
  sourceRefs: string[]
  notes?: string
}

export interface Issue {
  type: "factual" | "logical" | "source" | "completeness" | "clarity"
  severity: "critical" | "major" | "minor"
  description: string
  suggestion?: string
}

export interface Artifact {
  id: string
  agentType: AgentType
  taskDescription: string
  timestamp: number
  sources?: Source[]
  findings?: Finding[]
  content?: string
  issues?: Issue[]
  extractedData?: unknown
  connections?: string[]
}

export interface SharedContext {
  sessionID: string
  artifacts: Artifact[]
  createdAt: number
  updatedAt: number
}

const contextPool = new Map<string, SharedContext>()

export function getOrCreateContext(sessionID: string): SharedContext {
  let ctx = contextPool.get(sessionID)
  if (!ctx) {
    ctx = {
      sessionID,
      artifacts: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    contextPool.set(sessionID, ctx)
  }
  return ctx
}

export function getContext(sessionID: string): SharedContext | undefined {
  return contextPool.get(sessionID)
}

export function clearContext(sessionID: string): void {
  contextPool.delete(sessionID)
}

/**
 * Expected agent output format:
 * **ARTIFACTS:**
 * ```json
 * { "sources": [...], "findings": [...] }
 * ```
 */
export function parseArtifacts(
  output: string,
  agentType: AgentType,
  taskDescription: string
): Partial<Artifact> | null {
  const artifactMatch = output.match(
    /\*\*ARTIFACTS:\*\*\s*```json\s*([\s\S]*?)```/i
  )
  
  if (!artifactMatch) {
    return null
  }
  
  try {
    const jsonStr = artifactMatch[1].trim()
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>
    
    const artifact: Partial<Artifact> = {
      agentType,
      taskDescription,
      timestamp: Date.now(),
    }
    
    if (parsed.sources && Array.isArray(parsed.sources)) {
      artifact.sources = parsed.sources as Source[]
    }
    if (parsed.findings && Array.isArray(parsed.findings)) {
      artifact.findings = parsed.findings as Finding[]
    }
    if (parsed.content && typeof parsed.content === "string") {
      artifact.content = parsed.content
    }
    if (parsed.issues && Array.isArray(parsed.issues)) {
      artifact.issues = parsed.issues as Issue[]
    }
    if (parsed.connections && Array.isArray(parsed.connections)) {
      artifact.connections = parsed.connections as string[]
    }
    if (parsed.extractedData !== undefined) {
      artifact.extractedData = parsed.extractedData
    }
    
    return artifact
  } catch (error) {
    log("[shared-context] Failed to parse ARTIFACTS JSON:", error)
    return null
  }
}

export function addArtifact(sessionID: string, artifact: Partial<Artifact>): string {
  const ctx = getOrCreateContext(sessionID)
  const id = `${artifact.agentType}_${ctx.artifacts.length.toString().padStart(3, "0")}`
  
  const fullArtifact: Artifact = {
    id,
    agentType: artifact.agentType!,
    taskDescription: artifact.taskDescription ?? "Unknown task",
    timestamp: artifact.timestamp ?? Date.now(),
    sources: artifact.sources,
    findings: artifact.findings,
    content: artifact.content,
    issues: artifact.issues,
    connections: artifact.connections,
    extractedData: artifact.extractedData,
  }
  
  ctx.artifacts.push(fullArtifact)
  ctx.updatedAt = Date.now()
  
  log("[shared-context] Artifact added:", { sessionID, id, agentType: artifact.agentType })
  return id
}

export function buildContextSummary(sessionID: string): string | null {
  const ctx = getContext(sessionID)
  if (!ctx || ctx.artifacts.length === 0) {
    return null
  }
  
  const lines: string[] = [
    "<shared-context>",
    "## Previous Work by Other Agents",
    "",
  ]
  
  const byAgent = new Map<AgentType, Artifact[]>()
  for (const a of ctx.artifacts) {
    const list = byAgent.get(a.agentType) ?? []
    list.push(a)
    byAgent.set(a.agentType, list)
  }
  
  for (const [agentType, artifacts] of byAgent) {
    lines.push(`### ${formatAgentName(agentType)} (${artifacts.length} task${artifacts.length > 1 ? "s" : ""})`)
    
    for (const a of artifacts) {
      lines.push(`- **[${a.id}]** ${a.taskDescription}`)
      
      if (a.sources && a.sources.length > 0) {
        lines.push(`  - Found ${a.sources.length} sources`)
        for (const s of a.sources.slice(0, 3)) {
          const credIcon = s.credibility === "high" ? "✓" : s.credibility === "low" ? "⚠" : ""
          lines.push(`    - ${credIcon} ${s.title} (${s.type})`)
        }
        if (a.sources.length > 3) {
          lines.push(`    - ... and ${a.sources.length - 3} more`)
        }
      }
      
      if (a.findings && a.findings.length > 0) {
        lines.push(`  - ${a.findings.length} key findings`)
        for (const f of a.findings.slice(0, 3)) {
          const confPct = Math.round(f.confidence * 100)
          lines.push(`    - ${f.claim} (${confPct}% confident)`)
        }
        if (a.findings.length > 3) {
          lines.push(`    - ... and ${a.findings.length - 3} more`)
        }
      }
      
      if (a.issues && a.issues.length > 0) {
        const critical = a.issues.filter(i => i.severity === "critical").length
        const major = a.issues.filter(i => i.severity === "major").length
        lines.push(`  - Found ${a.issues.length} issues (${critical} critical, ${major} major)`)
      }
      
      if (a.connections && a.connections.length > 0) {
        lines.push(`  - Related: ${a.connections.slice(0, 3).join(", ")}${a.connections.length > 3 ? "..." : ""}`)
      }
      
      if (a.content) {
        const preview = a.content.slice(0, 100).replace(/\n/g, " ")
        lines.push(`  - Draft: "${preview}${a.content.length > 100 ? "..." : ""}"`)
      }
    }
    lines.push("")
  }
  
  lines.push("## How to Use This Context")
  lines.push("- Reference artifacts by ID (e.g., [researcher_001]) in your output")
  lines.push("- Build upon findings rather than re-researching")
  lines.push("- Flag any inconsistencies you find with previous work")
  lines.push("</shared-context>")
  
  return lines.join("\n")
}

export function getArtifactDetails(sessionID: string, artifactIds: string[]): Artifact[] {
  const ctx = getContext(sessionID)
  if (!ctx) return []
  
  return ctx.artifacts.filter(a => artifactIds.includes(a.id))
}

export function getAllSources(sessionID: string): Source[] {
  const ctx = getContext(sessionID)
  if (!ctx) return []
  
  const sources: Source[] = []
  for (const a of ctx.artifacts) {
    if (a.sources) {
      sources.push(...a.sources)
    }
  }
  return sources
}

export function getAllFindings(sessionID: string): Finding[] {
  const ctx = getContext(sessionID)
  if (!ctx) return []
  
  const findings: Finding[] = []
  for (const a of ctx.artifacts) {
    if (a.findings) {
      findings.push(...a.findings)
    }
  }
  return findings
}

function formatAgentName(agentType: AgentType): string {
  const names: Record<AgentType, string> = {
    researcher: "Researcher",
    "fact-checker": "Fact-Checker",
    archivist: "Archivist",
    extractor: "Extractor",
    writer: "Writer",
    editor: "Editor",
  }
  return names[agentType] ?? agentType
}

export function hasArtifacts(output: string): boolean {
  return /\*\*ARTIFACTS:\*\*/i.test(output)
}

const DETAIL_HUNGRY_AGENTS: AgentType[] = ["writer", "editor", "fact-checker"]

export function buildDetailedContextSummary(sessionID: string, downstreamAgent?: string): string | null {
  const ctx = getContext(sessionID)
  if (!ctx || ctx.artifacts.length === 0) {
    return null
  }

  const isDetailHungry = downstreamAgent
    ? DETAIL_HUNGRY_AGENTS.includes(downstreamAgent as AgentType)
    : false

  if (!isDetailHungry) {
    return buildContextSummary(sessionID)
  }

  const lines: string[] = [
    "<shared-context>",
    "## Previous Work by Other Agents (DETAILED)",
    "",
  ]

  const byAgent = new Map<AgentType, Artifact[]>()
  for (const a of ctx.artifacts) {
    const list = byAgent.get(a.agentType) ?? []
    list.push(a)
    byAgent.set(a.agentType, list)
  }

  for (const [agentType, artifacts] of byAgent) {
    lines.push(`### ${formatAgentName(agentType)} (${artifacts.length} task${artifacts.length > 1 ? "s" : ""})`)

    for (const a of artifacts) {
      lines.push(`- **[${a.id}]** ${a.taskDescription}`)

      if (a.sources && a.sources.length > 0) {
        lines.push(`  - **Sources (${a.sources.length} total):**`)
        for (const s of a.sources) {
          const credIcon = s.credibility === "high" ? "✓" : s.credibility === "low" ? "⚠" : "○"
          const urlPart = s.url ? ` — ${s.url}` : ""
          const excerptPart = s.excerpt ? `\n      > ${s.excerpt.slice(0, 200)}${s.excerpt.length > 200 ? "..." : ""}` : ""
          lines.push(`    - ${credIcon} **${s.title}** (${s.type}, ${s.credibility ?? "unknown"} credibility)${urlPart}${excerptPart}`)
        }
      }

      if (a.findings && a.findings.length > 0) {
        lines.push(`  - **Findings (${a.findings.length} total):**`)
        for (const f of a.findings) {
          const confPct = Math.round(f.confidence * 100)
          const refs = f.sourceRefs.length > 0 ? ` [refs: ${f.sourceRefs.join(", ")}]` : ""
          const notes = f.notes ? ` — ${f.notes}` : ""
          lines.push(`    - ${f.claim} (${confPct}% confident)${refs}${notes}`)
        }
      }

      if (a.issues && a.issues.length > 0) {
        lines.push(`  - **Issues (${a.issues.length} total):**`)
        for (const i of a.issues) {
          const sev = i.severity === "critical" ? "🔴" : i.severity === "major" ? "🟡" : "⚪"
          const suggestion = i.suggestion ? ` → ${i.suggestion}` : ""
          lines.push(`    - ${sev} [${i.type}] ${i.description}${suggestion}`)
        }
      }

      if (a.connections && a.connections.length > 0) {
        lines.push(`  - **Connections:** ${a.connections.join(", ")}`)
      }

      if (a.content) {
        const preview = a.content.slice(0, 500).replace(/\n/g, " ")
        lines.push(`  - **Content preview:** "${preview}${a.content.length > 500 ? "..." : ""}"`)
      }
    }
    lines.push("")
  }

  lines.push("## How to Use This Context")
  lines.push("- Reference artifacts by ID (e.g., [researcher_001]) in your output")
  lines.push("- Build upon findings rather than re-researching")
  lines.push("- Cite sources when making claims based on research")
  lines.push("- Flag any inconsistencies you find with previous work")
  lines.push("</shared-context>")

  return lines.join("\n")
}
