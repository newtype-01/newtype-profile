/**
 * Confidence-based routing for agent outputs
 * 
 * Parses confidence scores from agent outputs and generates
 * routing recommendations for the orchestrator.
 */

/** Maximum rewrite attempts before escalating to user */
const MAX_REWRITE_ATTEMPTS = 2

/** Per-agent rewrite attempt counter: session -> (agentType -> count) */
const rewriteAttempts = new Map<string, Map<AgentType, number>>()

export type AgentType = "fact-checker" | "researcher" | "writer" | "editor"
export type Recommendation = "pass" | "polish" | "rewrite" | "escalate"

export interface ConfidenceResult {
  confidence: number | null
  recommendation: Recommendation | null
  directive: string | null
  agentType?: AgentType
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
 */
export function getRecommendation(confidence: number): "pass" | "polish" | "rewrite" {
  if (confidence >= 0.8) {
    return "pass"
  } else if (confidence >= 0.5) {
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
  }
}

function getPolishAction(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Send to Editor for refinement."
    case "researcher": return "Needs additional research on specific gaps."
    case "writer": return "Draft needs improvement before editing."
    case "editor": return "Needs another editing pass."
  }
}

function getPolishCategory(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "editing"
    case "researcher": return "research"
    case "writer": return "writing"
    case "editor": return "editing"
  }
}

function getPolishPrompt(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Polish the content based on fact-check feedback. Address minor uncertainties while preserving verified claims."
    case "researcher": return "Continue research on the identified gaps. Focus on: [list specific gaps from research report]"
    case "writer": return "Improve the draft addressing the identified issues. Focus on: [list specific issues]"
    case "editor": return "Continue editing to address remaining issues. Focus on: [list specific issues]"
  }
}

function getRewriteAction(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Significant issues found. Send back to Writer."
    case "researcher": return "Research insufficient. Restart with different approach."
    case "writer": return "Draft has fundamental issues. Needs major revision."
    case "editor": return "Content not ready for editing. Send back to Writer."
  }
}

function getRewriteCategory(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "writing"
    case "researcher": return "research"
    case "writer": return "writing"
    case "editor": return "writing"
  }
}

function getRewritePrompt(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "Rewrite the content addressing the fact-check issues. Focus on: [list specific issues from fact-check report]"
    case "researcher": return "Restart research with a different approach. Previous attempt was insufficient because: [list reasons]"
    case "writer": return "Rewrite the draft addressing fundamental issues. Focus on: [list specific issues]"
    case "editor": return "Content needs rewriting before editing. Issues: [list specific issues]"
  }
}

/**
 * Build escalate directive when max rewrite attempts exceeded
 */
export function buildEscalateDirective(confidence: number, attempts: number): string {
  const confidencePercent = Math.round(confidence * 100)
  return `[FACT-CHECK: ESCALATE TO USER]
Confidence: ${confidencePercent}% (LOW)
Rewrite attempts: ${attempts}/${MAX_REWRITE_ATTEMPTS} (LIMIT REACHED)

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

  const baseRecommendation = getRecommendation(confidence)
  
  if (baseRecommendation === "rewrite") {
    const attempts = incrementRewriteAttempts(sessionId, agentType)
    
    if (attempts > MAX_REWRITE_ATTEMPTS) {
      return {
        confidence,
        recommendation: "escalate",
        directive: buildEscalateDirective(confidence, attempts),
        agentType,
      }
    }
    
    const directive = buildConfidenceDirective(confidence, sessionId, agentType) +
      `\n\nRewrite attempt: ${attempts}/${MAX_REWRITE_ATTEMPTS}`
    
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
  
  return null
}

/**
 * Check if output contains a confidence score
 */
export function hasConfidenceScore(output: string): boolean {
  return extractConfidence(output) !== null
}
