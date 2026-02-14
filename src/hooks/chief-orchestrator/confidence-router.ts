/**
 * Confidence-based routing for agent outputs
 * 
 * Parses confidence scores from agent outputs and generates
 * routing recommendations for the orchestrator.
 */

import type { ConfidenceConfig } from "../../config/schema"

const DEFAULT_PASS_THRESHOLD = 0.8
const DEFAULT_POLISH_THRESHOLD = 0.5
const DEFAULT_MAX_REWRITE_ATTEMPTS = 2

/** Per-agent rewrite attempt counter: session -> (agentType -> count) */
const rewriteAttempts = new Map<string, Map<AgentType, number>>()

let routerConfig: ConfidenceConfig | undefined

export type AgentType = "fact-checker" | "researcher" | "writer" | "editor" | "archivist" | "extractor"
export type Recommendation = "pass" | "polish" | "rewrite" | "escalate"

export interface ConfidenceResult {
  confidence: number | null
  recommendation: Recommendation | null
  directive: string | null
  agentType?: AgentType
}

export function setConfidenceConfig(config: ConfidenceConfig | undefined): void {
  routerConfig = config
}

export function getConfidenceConfig(): ConfidenceConfig | undefined {
  return routerConfig
}

interface ResolvedThresholds {
  pass: number
  polish: number
}

function getThresholdsForAgent(agentType: AgentType): ResolvedThresholds {
  if (!routerConfig) {
    return { pass: DEFAULT_PASS_THRESHOLD, polish: DEFAULT_POLISH_THRESHOLD }
  }

  const agentThresholds = routerConfig.by_agent?.[agentType]
  if (agentThresholds) {
    return {
      pass: agentThresholds.pass ?? routerConfig.default?.pass ?? DEFAULT_PASS_THRESHOLD,
      polish: agentThresholds.polish ?? routerConfig.default?.polish ?? DEFAULT_POLISH_THRESHOLD,
    }
  }

  if (routerConfig.default) {
    return {
      pass: routerConfig.default.pass ?? DEFAULT_PASS_THRESHOLD,
      polish: routerConfig.default.polish ?? DEFAULT_POLISH_THRESHOLD,
    }
  }

  return { pass: DEFAULT_PASS_THRESHOLD, polish: DEFAULT_POLISH_THRESHOLD }
}

function getMaxRewriteAttempts(): number {
  return routerConfig?.max_rewrite_attempts ?? DEFAULT_MAX_REWRITE_ATTEMPTS
}

/**
 * Extract confidence score from fact-checker output
 * Looks for pattern: **CONFIDENCE: X.XX**
 */
export function extractConfidence(output: string): number | null {
  // Match **CONFIDENCE: X.XX** pattern
  const match = output.match(/\*\*CONFIDENCE:\s*(\d+\.?\d*)\*\*/i)
  if (match) {
    const value = parseFloat(match[1])
    if (!isNaN(value) && value >= 0 && value <= 1) {
      return value
    }
  }
  return null
}

/**
 * Determine routing recommendation based on confidence score
 * Uses agent-specific thresholds when configured
 */
export function getRecommendation(confidence: number, agentType?: AgentType): "pass" | "polish" | "rewrite" {
  const thresholds: ResolvedThresholds = agentType 
    ? getThresholdsForAgent(agentType) 
    : {
        pass: routerConfig?.default?.pass ?? DEFAULT_PASS_THRESHOLD,
        polish: routerConfig?.default?.polish ?? DEFAULT_POLISH_THRESHOLD,
      }
  
  if (confidence >= thresholds.pass) {
    return "pass"
  } else if (confidence >= thresholds.polish) {
    return "polish"
  } else {
    return "rewrite"
  }
}

/**
 * Get current rewrite attempt count for a session and agent type
 */
export function getRewriteAttempts(sessionId: string, agentType: AgentType): number {
  return rewriteAttempts.get(sessionId)?.get(agentType) ?? 0
}

/**
 * Increment and return the new rewrite attempt count for a session and agent type
 */
export function incrementRewriteAttempts(sessionId: string, agentType: AgentType): number {
  let sessionMap = rewriteAttempts.get(sessionId)
  if (!sessionMap) {
    sessionMap = new Map()
    rewriteAttempts.set(sessionId, sessionMap)
  }
  const current = sessionMap.get(agentType) ?? 0
  const next = current + 1
  sessionMap.set(agentType, next)
  return next
}

/**
 * Clear rewrite attempts for a session (call on session cleanup)
 */
export function clearRewriteAttempts(sessionId: string): void {
  rewriteAttempts.delete(sessionId)
}

/**
 * Build routing directive for Chief based on confidence
 */
export function buildConfidenceDirective(confidence: number, sessionId: string, agentType: AgentType = "fact-checker"): string {
  const recommendation = getRecommendation(confidence)
  const confidencePercent = Math.round(confidence * 100)
  
  const agentLabels: Record<AgentType, string> = {
    "fact-checker": "FACT-CHECK",
    "researcher": "RESEARCH",
    "writer": "DRAFT",
    "editor": "EDIT",
    "archivist": "ARCHIVE",
    "extractor": "EXTRACTION",
  }
  const label = agentLabels[agentType]
  
  switch (recommendation) {
    case "pass":
      return `[${label} PASSED]
Confidence: ${confidencePercent}% (HIGH)
Action: ${getPassAction(agentType)}`

    case "polish":
      return `[${label}: NEEDS POLISH]
Confidence: ${confidencePercent}% (MEDIUM)
Action: ${getPolishAction(agentType)}

REQUIRED: Call chief_task with:
  category="${getPolishCategory(agentType)}"
  prompt="${getPolishPrompt(agentType)}"
  resume="${sessionId}"`

    case "rewrite":
      return `[${label}: NEEDS REWRITE]
Confidence: ${confidencePercent}% (LOW)
Action: ${getRewriteAction(agentType)}

REQUIRED: Call chief_task with:
  category="${getRewriteCategory(agentType)}"
  prompt="${getRewritePrompt(agentType)}"
  resume="${sessionId}"`
  }
}

function getPassAction(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Content verified. Ready for delivery."
    case "researcher": return "Research complete. Proceed to writing."
    case "writer": return "Draft complete. Send to editor."
    case "editor": return "Edit complete. Send to fact-check."
    case "archivist": return "Retrieval complete. Materials ready for use."
    case "extractor": return "Extraction complete. Content ready for processing."
  }
}

function getPolishAction(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Send to Editor for refinement."
    case "researcher": return "Needs additional research on specific gaps."
    case "writer": return "Draft needs improvement before editing."
    case "editor": return "Needs another editing pass."
    case "archivist": return "Needs deeper search or alternative queries."
    case "extractor": return "Some sections need re-extraction or clarification."
  }
}

function getPolishCategory(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "editing"
    case "researcher": return "research"
    case "writer": return "writing"
    case "editor": return "editing"
    case "archivist": return "archive"
    case "extractor": return "extraction"
  }
}

function getPolishPrompt(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Polish the content based on fact-check feedback. Address minor uncertainties while preserving verified claims."
    case "researcher": return "Continue research on the identified gaps. Focus on: [list specific gaps from research report]"
    case "writer": return "Improve the draft addressing the identified issues. Focus on: [list specific issues]"
    case "editor": return "Continue editing to address remaining issues. Focus on: [list specific issues]"
    case "archivist": return "Search deeper for missing materials. Try: [alternative search terms or locations]"
    case "extractor": return "Re-extract the unclear sections. Focus on: [list specific sections]"
  }
}

function getRewriteAction(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Significant issues found. Send back to Writer."
    case "researcher": return "Research insufficient. Restart with different approach."
    case "writer": return "Draft has fundamental issues. Needs major revision."
    case "editor": return "Content not ready for editing. Send back to Writer."
    case "archivist": return "Retrieval failed. May need external research instead."
    case "extractor": return "Extraction failed. Try different format or manual extraction."
  }
}

function getRewriteCategory(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "writing"
    case "researcher": return "research"
    case "writer": return "writing"
    case "editor": return "writing"
    case "archivist": return "research"
    case "extractor": return "extraction"
  }
}

function getRewritePrompt(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Rewrite the content addressing the fact-check issues. Focus on: [list specific issues from fact-check report]"
    case "researcher": return "Restart research with a different approach. Previous attempt was insufficient because: [list reasons]"
    case "writer": return "Rewrite the draft addressing fundamental issues. Focus on: [list specific issues]"
    case "editor": return "Content needs rewriting before editing. Issues: [list specific issues]"
    case "archivist": return "Knowledge base search failed. Consider external research or different query strategy."
    case "extractor": return "Extraction quality too low. Try: different tool, manual extraction, or request clearer source."
  }
}

/**
 * Build escalate directive when max rewrite attempts exceeded
 */
export function buildEscalateDirective(confidence: number, attempts: number): string {
  const confidencePercent = Math.round(confidence * 100)
  const maxAttempts = getMaxRewriteAttempts()
  return `[FACT-CHECK: ESCALATE TO USER]
Confidence: ${confidencePercent}% (LOW)
Rewrite attempts: ${attempts}/${maxAttempts} (LIMIT REACHED)

⚠️ AUTOMATIC REWRITING HAS FAILED.

The content has been rewritten ${attempts} times but still fails fact-check.
This requires human judgment.

ACTION REQUIRED:
1. Present the fact-check issues to the user
2. Ask for guidance on how to proceed
3. Do NOT attempt another automatic rewrite

Possible user decisions:
- Provide additional sources or context
- Accept lower confidence for this content
- Manually revise the problematic claims
- Abandon this content direction`
}

/**
 * Analyze fact-check output and generate routing result
 * Tracks rewrite attempts and escalates after MAX_REWRITE_ATTEMPTS
 */
export function analyzeFactCheckOutput(output: string, sessionId: string): ConfidenceResult {
  return analyzeAgentOutput(output, sessionId, "fact-checker")
}

/**
 * Generic analyzer for any agent type with confidence scoring
 */
export function analyzeAgentOutput(output: string, sessionId: string, agentType: AgentType): ConfidenceResult {
  const confidence = extractConfidence(output)
  
  if (confidence === null) {
    return {
      confidence: null,
      recommendation: null,
      directive: null,
      agentType,
    }
  }

  const baseRecommendation = getRecommendation(confidence, agentType)
  
  if (baseRecommendation === "rewrite") {
    const attempts = incrementRewriteAttempts(sessionId, agentType)
    const maxAttempts = getMaxRewriteAttempts()
    
    if (attempts > maxAttempts) {
      return {
        confidence,
        recommendation: "escalate",
        directive: buildEscalateDirective(confidence, attempts),
        agentType,
      }
    }
    
    const directive = buildConfidenceDirective(confidence, sessionId, agentType) +
      `\n\nRewrite attempt: ${attempts}/${maxAttempts}`
    
    return {
      confidence,
      recommendation: "rewrite",
      directive,
      agentType,
    }
  }

  const directive = buildConfidenceDirective(confidence, sessionId, agentType)

  return {
    confidence,
    recommendation: baseRecommendation,
    directive,
    agentType,
  }
}

/**
 * Check if output is from a fact-check task
 */
export function isFactCheckOutput(output: string): boolean {
  return output.includes("CONFIDENCE:") || 
         output.toLowerCase().includes("fact-check") ||
         output.includes("核查") ||
         output.includes("verification")
}

/**
 * Detect agent type from output content
 */
export function detectAgentType(output: string, category?: string): AgentType | null {
  if (category) {
    const categoryToAgent: Record<string, AgentType> = {
      "fact-check": "fact-checker",
      "research": "researcher",
      "writing": "writer",
      "editing": "editor",
      "archive": "archivist",
      "extraction": "extractor",
    }
    if (categoryToAgent[category]) {
      return categoryToAgent[category]
    }
  }

  const lowerOutput = output.toLowerCase()
  
  if (lowerOutput.includes("fact-check") || lowerOutput.includes("verification") || output.includes("核查")) {
    return "fact-checker"
  }
  if (lowerOutput.includes("research") || lowerOutput.includes("findings") || lowerOutput.includes("sources found")) {
    return "researcher"
  }
  if (lowerOutput.includes("edited") || lowerOutput.includes("polished") || lowerOutput.includes("revised")) {
    return "editor"
  }
  if (lowerOutput.includes("draft") || lowerOutput.includes("wrote") || lowerOutput.includes("created content")) {
    return "writer"
  }
  if (lowerOutput.includes("retrieval") || lowerOutput.includes("archive") || lowerOutput.includes("knowledge base") || lowerOutput.includes("found:")) {
    return "archivist"
  }
  if (lowerOutput.includes("extracted") || lowerOutput.includes("extraction") || lowerOutput.includes("pdf") || lowerOutput.includes("document conversion")) {
    return "extractor"
  }
  
  return null
}

/**
 * Check if output contains a confidence score
 */
export function hasConfidenceScore(output: string): boolean {
  return extractConfidence(output) !== null
}

export interface FailureJournalEntry {
  timestamp: string
  agentType: AgentType
  confidence: number
  attempts: number
  outputExcerpt: string
  sessionId: string
}

export function buildFailureJournalEntry(
  agentType: AgentType,
  confidence: number,
  attempts: number,
  output: string,
  sessionId: string,
): FailureJournalEntry {
  const excerpt = output.slice(0, 1000).replace(/\n{3,}/g, "\n\n")
  return {
    timestamp: new Date().toISOString(),
    agentType,
    confidence,
    attempts,
    outputExcerpt: excerpt,
    sessionId,
  }
}

export function formatFailureJournalMarkdown(entry: FailureJournalEntry): string {
  const confPct = Math.round(entry.confidence * 100)
  return `## Escalation: ${entry.agentType} (${entry.timestamp.split("T")[0]})

- **Agent**: ${entry.agentType}
- **Confidence**: ${confPct}%
- **Rewrite attempts**: ${entry.attempts}
- **Session**: ${entry.sessionId}

### Last Output Excerpt
\`\`\`
${entry.outputExcerpt}
\`\`\`

---
`
}
