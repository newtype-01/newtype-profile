import { describe, test, expect } from "bun:test"
import {
  analyzeQualityForRetry,
  categoryToAgentType,
  agentNameToAgentType,
  detectAgentTypeFromOutput,
  buildImprovementPrompt,
  formatFinalOutput,
  MAX_REWRITE_ATTEMPTS,
} from "./quality-feedback"
import { parseQualityScores, type QualityAssessment } from "../../hooks/chief-orchestrator/quality-dimensions"

describe("quality-feedback", () => {
  describe("categoryToAgentType", () => {
    test("maps fact-check to fact-checker", () => {
      // #given / #when / #then
      expect(categoryToAgentType("fact-check")).toBe("fact-checker")
    })

    test("maps research to researcher", () => {
      // #given / #when / #then
      expect(categoryToAgentType("research")).toBe("researcher")
    })

    test("returns null for unknown category", () => {
      // #given / #when / #then
      expect(categoryToAgentType("unknown")).toBeNull()
    })

    test("returns null for undefined", () => {
      // #given / #when / #then
      expect(categoryToAgentType(undefined)).toBeNull()
    })
  })

  describe("agentNameToAgentType", () => {
    test("returns valid agent types as-is", () => {
      // #given / #when / #then
      expect(agentNameToAgentType("fact-checker")).toBe("fact-checker")
      expect(agentNameToAgentType("researcher")).toBe("researcher")
      expect(agentNameToAgentType("writer")).toBe("writer")
    })

    test("returns null for invalid agent names", () => {
      // #given / #when / #then
      expect(agentNameToAgentType("deputy")).toBeNull()
      expect(agentNameToAgentType("chief")).toBeNull()
    })
  })

  describe("detectAgentTypeFromOutput", () => {
    test("detects fact-checker from quality scores with accuracy dimension", () => {
      // #given
      const output = `**QUALITY SCORES:**
- Accuracy: 0.85
- Authority: 0.70
- Completeness: 0.90
**OVERALL: 0.82**`

      // #when
      const result = detectAgentTypeFromOutput(output)

      // #then
      expect(result).toBe("fact-checker")
    })

    test("detects researcher from quality scores with coverage dimension", () => {
      // #given
      const output = `**QUALITY SCORES:**
- Coverage: 0.75
- Sources: 0.80
- Relevance: 0.85
**OVERALL: 0.80**`

      // #when
      const result = detectAgentTypeFromOutput(output)

      // #then
      expect(result).toBe("researcher")
    })

    test("falls back to content-based detection", () => {
      // #given
      const output = "The fact-check verification found some issues."

      // #when
      const result = detectAgentTypeFromOutput(output)

      // #then
      expect(result).toBe("fact-checker")
    })
  })

  describe("analyzeQualityForRetry", () => {
    test("returns no_scores status when no quality scores present", () => {
      // #given
      const output = "This is a regular output without quality scores."

      // #when
      const result = analyzeQualityForRetry(output, 1, "research")

      // #then
      expect(result.status).toBe("no_scores")
      expect(result.allPass).toBe(true)
      expect(result.shouldRetry).toBe(false)
    })

    test("returns passed status when all dimensions pass", () => {
      // #given
      const output = `**QUALITY SCORES:**
- Coverage: 0.85
- Sources: 0.80
- Relevance: 0.90
**OVERALL: 0.85**`

      // #when
      const result = analyzeQualityForRetry(output, 1, "research")

      // #then
      expect(result.status).toBe("passed")
      expect(result.allPass).toBe(true)
      expect(result.shouldRetry).toBe(false)
    })

    test("returns needs_improvement with shouldRetry=true when dimensions fail", () => {
      // #given
      const output = `**QUALITY SCORES:**
- Coverage: 0.50
- Sources: 0.80
- Relevance: 0.85
**OVERALL: 0.72**`

      // #when
      const result = analyzeQualityForRetry(output, 1, "research")

      // #then
      expect(result.status).toBe("needs_improvement")
      expect(result.allPass).toBe(false)
      expect(result.shouldRetry).toBe(true)
      expect(result.improvementPrompt).not.toBeNull()
    })

    test("returns max_attempts_reached when attempts exceed limit", () => {
      // #given
      const output = `**QUALITY SCORES:**
- Coverage: 0.50
- Sources: 0.80
- Relevance: 0.85
**OVERALL: 0.72**`

      // #when
      const result = analyzeQualityForRetry(output, MAX_REWRITE_ATTEMPTS, "research")

      // #then
      expect(result.status).toBe("max_attempts_reached")
      expect(result.allPass).toBe(false)
      expect(result.shouldRetry).toBe(false)
    })
  })

  describe("buildImprovementPrompt", () => {
    test("builds improvement prompt for researcher with weak coverage", () => {
      // #given
      const assessment: QualityAssessment = {
        agentType: "researcher",
        dimensions: [
          { name: "coverage", label: "Coverage", score: 0.50, weak: true },
          { name: "sources", label: "Sources", score: 0.80, weak: false },
          { name: "relevance", label: "Relevance", score: 0.85, weak: false },
        ],
        overall: 0.72,
        weakest: { name: "coverage", label: "Coverage", score: 0.50, weak: true },
        allPass: false,
      }

      // #when
      const result = buildImprovementPrompt(assessment)

      // #then
      expect(result).toContain("Coverage")
      expect(result).toContain("0.50")
      expect(result).toContain("Improvement Hints")
    })
  })

  describe("formatFinalOutput", () => {
    test("returns original output for no_scores status", () => {
      // #given
      const result = {
        originalOutput: "Original output text",
        assessment: null,
        allPass: true,
        shouldRetry: false,
        attemptNumber: 1,
        improvementPrompt: null,
        status: "no_scores" as const,
      }

      // #when
      const formatted = formatFinalOutput(result, "ses_123")

      // #then
      expect(formatted).toBe("Original output text")
    })

    test("adds max attempts warning for max_attempts_reached status", () => {
      // #given
      const assessment: QualityAssessment = {
        agentType: "researcher",
        dimensions: [
          { name: "coverage", label: "Coverage", score: 0.50, weak: true },
        ],
        overall: 0.50,
        weakest: { name: "coverage", label: "Coverage", score: 0.50, weak: true },
        allPass: false,
      }
      const result = {
        originalOutput: "Original output text",
        assessment,
        allPass: false,
        shouldRetry: false,
        attemptNumber: 2,
        improvementPrompt: null,
        status: "max_attempts_reached" as const,
      }

      // #when
      const formatted = formatFinalOutput(result, "ses_123")

      // #then
      expect(formatted).toContain("MAX REWRITE ATTEMPTS REACHED")
      expect(formatted).toContain("2/2")
    })
  })
})
