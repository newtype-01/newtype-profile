/**
 * Quality Feedback Loop for chief_task
 *
 * Parses quality scores from agent outputs and determines if automatic retry is needed.
 * This module enables semi-automatic quality improvement without human intervention.
 */

import {
  parseQualityScores,
  buildImprovementDirective,
  hasQualityScores,
  type QualityAssessment,
  type AgentType,
  AGENT_DIMENSIONS,
} from "../../hooks/chief-orchestrator/quality-dimensions"
import { log } from "../../shared/logger"

const LOG_PREFIX = "[quality-feedback]"

/** Maximum number of automatic rewrite attempts before returning result */
export const MAX_REWRITE_ATTEMPTS = 2

/** Threshold below which a dimension is considered "weak" */
export const WEAK_THRESHOLD = 0.7

export interface QualityFeedbackResult {
  /** Original text output from agent */
  originalOutput: string
  /** Parsed quality assessment, null if no quality scores found */
  assessment: QualityAssessment | null
  /** Whether all quality dimensions pass */
  allPass: boolean
  /** Whether retry is recommended (allPass=false and attempts < max) */
  shouldRetry: boolean
  /** Current attempt number (1-indexed) */
  attemptNumber: number
  /** Improvement prompt for retry, null if no retry needed */
  improvementPrompt: string | null
  /** Human-readable status for logging */
  status: "passed" | "needs_improvement" | "max_attempts_reached" | "no_scores"
}

/**
 * Map category to AgentType
 */
export function categoryToAgentType(category?: string): AgentType | null {
  if (!category) return null

  const map: Record<string, AgentType> = {
    "fact-check": "fact-checker",
    research: "researcher",
    writing: "writer",
    editing: "editor",
    archive: "archivist",
    extraction: "extractor",
  }
  return map[category] ?? null
}

/**
 * Map agent name to AgentType
 */
export function agentNameToAgentType(agentName?: string): AgentType | null {
  if (!agentName) return null

  const validTypes: AgentType[] = [
    "fact-checker",
    "researcher",
    "writer",
    "editor",
    "archivist",
    "extractor",
  ]

  if (validTypes.includes(agentName as AgentType)) {
    return agentName as AgentType
  }

  return null
}

/**
 * Detect AgentType from output content heuristically
 */
export function detectAgentTypeFromOutput(output: string): AgentType | null {
  const lowerOutput = output.toLowerCase()

  for (const [agentType, dimensions] of Object.entries(AGENT_DIMENSIONS)) {
    for (const dim of dimensions) {
      if (lowerOutput.includes(dim.label.toLowerCase() + ":")) {
        return agentType as AgentType
      }
    }
  }

  if (
    lowerOutput.includes("fact-check") ||
    lowerOutput.includes("verification") ||
    output.includes("核查")
  ) {
    return "fact-checker"
  }
  if (
    lowerOutput.includes("research") ||
    lowerOutput.includes("findings") ||
    lowerOutput.includes("sources found")
  ) {
    return "researcher"
  }
  if (
    lowerOutput.includes("edited") ||
    lowerOutput.includes("polished") ||
    lowerOutput.includes("revised")
  ) {
    return "editor"
  }
  if (
    lowerOutput.includes("draft") ||
    lowerOutput.includes("wrote") ||
    lowerOutput.includes("created content")
  ) {
    return "writer"
  }
  if (
    lowerOutput.includes("retrieval") ||
    lowerOutput.includes("archive") ||
    lowerOutput.includes("knowledge base")
  ) {
    return "archivist"
  }
  if (
    lowerOutput.includes("extracted") ||
    lowerOutput.includes("extraction") ||
    lowerOutput.includes("pdf")
  ) {
    return "extractor"
  }

  return null
}

/**
 * Build improvement prompt for retry
 */
export function buildImprovementPrompt(assessment: QualityAssessment): string {
  const { agentType, dimensions, overall, weakest } = assessment

  if (!weakest) {
    return "Please review and improve the quality of your previous output."
  }

  const dimDef = AGENT_DIMENSIONS[agentType].find(
    (d) => d.name === weakest.name
  )
  const hints = dimDef?.improvementHints ?? []

  const weakDimensions = dimensions
    .filter((d) => d.weak)
    .map((d) => `- ${d.label}: ${d.score.toFixed(2)} (below ${WEAK_THRESHOLD})`)
    .join("\n")

  let prompt = `Your previous output has quality issues that need improvement.

**Overall Score:** ${(overall * 100).toFixed(0)}%

**Weak Dimensions:**
${weakDimensions}

**Primary Focus: ${weakest.label}** (${weakest.score.toFixed(2)})

**Improvement Hints:**
${hints.map((h) => `• ${h}`).join("\n")}
`

  if (dimDef?.goodExample && dimDef?.badExample) {
    prompt += `
**Examples:**
✓ GOOD: ${dimDef.goodExample}
✗ BAD: ${dimDef.badExample}
`
  }

  prompt += `
**Instructions:**
1. Focus on improving the ${weakest.label.toLowerCase()} dimension
2. Do NOT redo work that already meets standards
3. Make targeted improvements, not wholesale changes
4. Output your improved result with updated quality scores

Continue improving your previous work.`

  return prompt
}

/**
 * Analyze agent output and determine if retry is needed
 */
export function analyzeQualityForRetry(
  output: string,
  attemptNumber: number,
  category?: string,
  agentName?: string
): QualityFeedbackResult {
  const agentType =
    categoryToAgentType(category) ??
    agentNameToAgentType(agentName) ??
    detectAgentTypeFromOutput(output)

  if (!hasQualityScores(output)) {
    log(`${LOG_PREFIX} No quality scores found in output`)
    return {
      originalOutput: output,
      assessment: null,
      allPass: true,
      shouldRetry: false,
      attemptNumber,
      improvementPrompt: null,
      status: "no_scores",
    }
  }

  if (!agentType) {
    log(`${LOG_PREFIX} Could not detect agent type`)
    return {
      originalOutput: output,
      assessment: null,
      allPass: true,
      shouldRetry: false,
      attemptNumber,
      improvementPrompt: null,
      status: "no_scores",
    }
  }

  const assessment = parseQualityScores(output, agentType)

  if (!assessment) {
    log(`${LOG_PREFIX} Failed to parse quality scores`)
    return {
      originalOutput: output,
      assessment: null,
      allPass: true,
      shouldRetry: false,
      attemptNumber,
      improvementPrompt: null,
      status: "no_scores",
    }
  }

  if (assessment.allPass) {
    log(`${LOG_PREFIX} Quality check passed`, {
      agentType,
      overall: assessment.overall,
    })
    return {
      originalOutput: output,
      assessment,
      allPass: true,
      shouldRetry: false,
      attemptNumber,
      improvementPrompt: null,
      status: "passed",
    }
  }

  if (attemptNumber >= MAX_REWRITE_ATTEMPTS) {
    log(`${LOG_PREFIX} Max rewrite attempts reached`, {
      agentType,
      attemptNumber,
      overall: assessment.overall,
    })
    return {
      originalOutput: output,
      assessment,
      allPass: false,
      shouldRetry: false,
      attemptNumber,
      improvementPrompt: null,
      status: "max_attempts_reached",
    }
  }

  const improvementPrompt = buildImprovementPrompt(assessment)
  log(`${LOG_PREFIX} Quality check failed, will retry`, {
    agentType,
    attemptNumber,
    overall: assessment.overall,
    weakest: assessment.weakest?.name,
  })

  return {
    originalOutput: output,
    assessment,
    allPass: false,
    shouldRetry: true,
    attemptNumber,
    improvementPrompt,
    status: "needs_improvement",
  }
}

/**
 * Format final output with quality status
 */
export function formatFinalOutput(
  result: QualityFeedbackResult,
  sessionId: string
): string {
  const { originalOutput, assessment, status, attemptNumber } = result

  if (status === "no_scores") {
    return originalOutput
  }

  if (status === "passed" && assessment) {
    const directive = buildImprovementDirective(assessment, sessionId)
    return `${originalOutput}

---
${directive}`
  }

  if (status === "max_attempts_reached" && assessment) {
    const directive = buildImprovementDirective(assessment, sessionId)
    return `${originalOutput}

---
${directive}

⚠️ **MAX REWRITE ATTEMPTS REACHED (${attemptNumber}/${MAX_REWRITE_ATTEMPTS})**

Automatic improvement has been attempted ${attemptNumber} times but quality still below threshold.
This output is returned as-is. Consider:
1. Manual review and improvement
2. Adjusting the task requirements
3. Providing additional context or sources`
  }

  return originalOutput
}
