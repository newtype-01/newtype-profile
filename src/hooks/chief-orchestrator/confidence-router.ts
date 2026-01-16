/**
 * Confidence-based routing for fact-check results
 * 
 * Parses confidence scores from fact-checker output and generates
 * routing recommendations for the orchestrator.
 */

/** Maximum rewrite attempts before escalating to user */
const MAX_REWRITE_ATTEMPTS = 2

/** Session-level rewrite attempt counter */
const rewriteAttempts = new Map<string, number>()

export type Recommendation = "pass" | "polish" | "rewrite" | "escalate"

export interface ConfidenceResult {
  confidence: number | null
  recommendation: Recommendation | null
  directive: string | null
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
 * Get current rewrite attempt count for a session
 */
export function getRewriteAttempts(sessionId: string): number {
  return rewriteAttempts.get(sessionId) ?? 0
}

/**
 * Increment and return the new rewrite attempt count
 */
export function incrementRewriteAttempts(sessionId: string): number {
  const current = getRewriteAttempts(sessionId)
  const next = current + 1
  rewriteAttempts.set(sessionId, next)
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
export function buildConfidenceDirective(confidence: number, sessionId: string): string {
  const recommendation = getRecommendation(confidence)
  const confidencePercent = Math.round(confidence * 100)
  
  switch (recommendation) {
    case "pass":
      return `[FACT-CHECK PASSED]
Confidence: ${confidencePercent}% (HIGH)
Action: Content verified. Ready for delivery.`

    case "polish":
      return `[FACT-CHECK: NEEDS POLISH]
Confidence: ${confidencePercent}% (MEDIUM)
Action: Send to Editor for refinement.

REQUIRED: Call chief_task with:
  category="editing"
  prompt="Polish the content based on fact-check feedback. Address minor uncertainties while preserving verified claims."
  resume="${sessionId}"`

    case "rewrite":
      return `[FACT-CHECK: NEEDS REWRITE]
Confidence: ${confidencePercent}% (LOW)
Action: Significant issues found. Send back to Writer.

REQUIRED: Call chief_task with:
  category="writing"  
  prompt="Rewrite the content addressing the fact-check issues. Focus on: [list specific issues from fact-check report]"
  resume="${sessionId}"`
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
  const confidence = extractConfidence(output)
  
  if (confidence === null) {
    return {
      confidence: null,
      recommendation: null,
      directive: null,
    }
  }

  const baseRecommendation = getRecommendation(confidence)
  
  if (baseRecommendation === "rewrite") {
    const attempts = incrementRewriteAttempts(sessionId)
    
    if (attempts > MAX_REWRITE_ATTEMPTS) {
      return {
        confidence,
        recommendation: "escalate",
        directive: buildEscalateDirective(confidence, attempts),
      }
    }
    
    const directive = buildConfidenceDirective(confidence, sessionId) +
      `\n\nRewrite attempt: ${attempts}/${MAX_REWRITE_ATTEMPTS}`
    
    return {
      confidence,
      recommendation: "rewrite",
      directive,
    }
  }

  const directive = buildConfidenceDirective(confidence, sessionId)

  return {
    confidence,
    recommendation: baseRecommendation,
    directive,
  }
}

/**
 * Check if output is from a fact-check task
 */
export function isFactCheckOutput(output: string): boolean {
  // Check for fact-check category marker or confidence pattern
  return output.includes("CONFIDENCE:") || 
         output.toLowerCase().includes("fact-check") ||
         output.includes("核查") ||
         output.includes("verification")
}
