/**
 * Confidence-based routing for fact-check results
 * 
 * Parses confidence scores from fact-checker output and generates
 * routing recommendations for the orchestrator.
 */

export interface ConfidenceResult {
  confidence: number | null
  recommendation: "pass" | "polish" | "rewrite" | null
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
  resume="${sessionId}"

NOTE: Max 2 rewrite attempts. If still failing after 2 rewrites, escalate to user.`
  }
}

/**
 * Analyze fact-check output and generate routing result
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

  const recommendation = getRecommendation(confidence)
  const directive = buildConfidenceDirective(confidence, sessionId)

  return {
    confidence,
    recommendation,
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
