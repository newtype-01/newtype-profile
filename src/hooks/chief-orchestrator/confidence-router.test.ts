import { describe, test, expect, beforeEach } from "bun:test"
import {
  extractConfidence,
  getRecommendation,
  buildConfidenceDirective,
  analyzeFactCheckOutput,
  isFactCheckOutput,
  getRewriteAttempts,
  incrementRewriteAttempts,
  clearRewriteAttempts,
  buildEscalateDirective,
} from "./confidence-router"

describe("extractConfidence", () => {
  test("should extract valid confidence score", () => {
    // #given
    const output = "Some analysis...\n---\n**CONFIDENCE: 0.85**"
    // #when
    const result = extractConfidence(output)
    // #then
    expect(result).toBe(0.85)
  })

  test("should handle confidence without decimal", () => {
    // #given
    const output = "**CONFIDENCE: 1**"
    // #when
    const result = extractConfidence(output)
    // #then
    expect(result).toBe(1)
  })

  test("should handle confidence with spaces", () => {
    // #given
    const output = "**CONFIDENCE:  0.72**"
    // #when
    const result = extractConfidence(output)
    // #then
    expect(result).toBe(0.72)
  })

  test("should be case insensitive", () => {
    // #given
    const output = "**confidence: 0.65**"
    // #when
    const result = extractConfidence(output)
    // #then
    expect(result).toBe(0.65)
  })

  test("should return null for missing confidence", () => {
    // #given
    const output = "No confidence score here"
    // #when
    const result = extractConfidence(output)
    // #then
    expect(result).toBeNull()
  })

  test("should return null for out-of-range values", () => {
    // #given
    const output1 = "**CONFIDENCE: 1.5**"
    const output2 = "**CONFIDENCE: -0.5**"
    // #when
    const result1 = extractConfidence(output1)
    const result2 = extractConfidence(output2)
    // #then
    expect(result1).toBeNull()
    expect(result2).toBeNull()
  })

  test("should return null for malformed patterns", () => {
    // #given
    const output = "CONFIDENCE: 0.8" // missing asterisks
    // #when
    const result = extractConfidence(output)
    // #then
    expect(result).toBeNull()
  })
})

describe("getRecommendation", () => {
  test("should return 'pass' for confidence >= 0.8", () => {
    expect(getRecommendation(0.8)).toBe("pass")
    expect(getRecommendation(0.95)).toBe("pass")
    expect(getRecommendation(1.0)).toBe("pass")
  })

  test("should return 'polish' for confidence 0.5-0.79", () => {
    expect(getRecommendation(0.5)).toBe("polish")
    expect(getRecommendation(0.65)).toBe("polish")
    expect(getRecommendation(0.79)).toBe("polish")
  })

  test("should return 'rewrite' for confidence < 0.5", () => {
    expect(getRecommendation(0.49)).toBe("rewrite")
    expect(getRecommendation(0.3)).toBe("rewrite")
    expect(getRecommendation(0)).toBe("rewrite")
  })
})

describe("buildConfidenceDirective", () => {
  test("should build pass directive for high confidence", () => {
    // #given
    const confidence = 0.9
    const sessionId = "ses-123"
    // #when
    const result = buildConfidenceDirective(confidence, sessionId)
    // #then
    expect(result).toContain("[FACT-CHECK PASSED]")
    expect(result).toContain("90%")
    expect(result).toContain("HIGH")
    expect(result).toContain("Ready for delivery")
  })

  test("should build polish directive for medium confidence", () => {
    // #given
    const confidence = 0.65
    const sessionId = "ses-456"
    // #when
    const result = buildConfidenceDirective(confidence, sessionId)
    // #then
    expect(result).toContain("[FACT-CHECK: NEEDS POLISH]")
    expect(result).toContain("65%")
    expect(result).toContain("MEDIUM")
    expect(result).toContain('category="editing"')
    expect(result).toContain(`resume="${sessionId}"`)
  })

  test("should build rewrite directive for low confidence", () => {
    // #given
    const confidence = 0.3
    const sessionId = "ses-789"
    // #when
    const result = buildConfidenceDirective(confidence, sessionId)
    // #then
    expect(result).toContain("[FACT-CHECK: NEEDS REWRITE]")
    expect(result).toContain("30%")
    expect(result).toContain("LOW")
    expect(result).toContain('category="writing"')
  })
})

describe("analyzeFactCheckOutput", () => {
  test("should return full result for valid output", () => {
    // #given
    const output = "Analysis complete.\n---\n**CONFIDENCE: 0.75**"
    const sessionId = "ses-test"
    // #when
    const result = analyzeFactCheckOutput(output, sessionId)
    // #then
    expect(result.confidence).toBe(0.75)
    expect(result.recommendation).toBe("polish")
    expect(result.directive).toContain("[FACT-CHECK: NEEDS POLISH]")
  })

  test("should return nulls for output without confidence", () => {
    // #given
    const output = "Analysis without confidence score"
    const sessionId = "ses-test"
    // #when
    const result = analyzeFactCheckOutput(output, sessionId)
    // #then
    expect(result.confidence).toBeNull()
    expect(result.recommendation).toBeNull()
    expect(result.directive).toBeNull()
  })
})

describe("isFactCheckOutput", () => {
  test("should detect CONFIDENCE marker", () => {
    expect(isFactCheckOutput("**CONFIDENCE: 0.8**")).toBe(true)
  })

  test("should detect fact-check keyword", () => {
    expect(isFactCheckOutput("This is a fact-check report")).toBe(true)
  })

  test("should detect Chinese verification keyword", () => {
    expect(isFactCheckOutput("信息核查结果")).toBe(true)
  })

  test("should detect verification keyword", () => {
    expect(isFactCheckOutput("Source verification complete")).toBe(true)
  })

  test("should return false for unrelated output", () => {
    expect(isFactCheckOutput("Just a regular message")).toBe(false)
  })
})

describe("rewrite attempt tracking", () => {
  beforeEach(() => {
    // #given - clean state for each test
    clearRewriteAttempts("test-session")
    clearRewriteAttempts("other-session")
  })

  test("should start at 0 attempts", () => {
    // #when
    const attempts = getRewriteAttempts("test-session")
    // #then
    expect(attempts).toBe(0)
  })

  test("should increment attempts", () => {
    // #when
    const first = incrementRewriteAttempts("test-session")
    const second = incrementRewriteAttempts("test-session")
    // #then
    expect(first).toBe(1)
    expect(second).toBe(2)
  })

  test("should track sessions independently", () => {
    // #when
    incrementRewriteAttempts("test-session")
    incrementRewriteAttempts("test-session")
    incrementRewriteAttempts("other-session")
    // #then
    expect(getRewriteAttempts("test-session")).toBe(2)
    expect(getRewriteAttempts("other-session")).toBe(1)
  })

  test("should clear attempts for a session", () => {
    // #given
    incrementRewriteAttempts("test-session")
    incrementRewriteAttempts("test-session")
    // #when
    clearRewriteAttempts("test-session")
    // #then
    expect(getRewriteAttempts("test-session")).toBe(0)
  })
})

describe("buildEscalateDirective", () => {
  test("should include escalation message", () => {
    // #given
    const confidence = 0.3
    const attempts = 3
    // #when
    const result = buildEscalateDirective(confidence, attempts)
    // #then
    expect(result).toContain("[FACT-CHECK: ESCALATE TO USER]")
    expect(result).toContain("30%")
    expect(result).toContain("3/2")
    expect(result).toContain("LIMIT REACHED")
    expect(result).toContain("AUTOMATIC REWRITING HAS FAILED")
  })
})

describe("analyzeFactCheckOutput with rewrite limits", () => {
  beforeEach(() => {
    // #given - clean state
    clearRewriteAttempts("ses-limit-test")
  })

  test("should return rewrite on first low confidence", () => {
    // #given
    const output = "**CONFIDENCE: 0.3**"
    // #when
    const result = analyzeFactCheckOutput(output, "ses-limit-test")
    // #then
    expect(result.recommendation).toBe("rewrite")
    expect(result.directive).toContain("Rewrite attempt: 1/2")
  })

  test("should return rewrite on second low confidence", () => {
    // #given
    const output = "**CONFIDENCE: 0.3**"
    analyzeFactCheckOutput(output, "ses-limit-test")
    // #when
    const result = analyzeFactCheckOutput(output, "ses-limit-test")
    // #then
    expect(result.recommendation).toBe("rewrite")
    expect(result.directive).toContain("Rewrite attempt: 2/2")
  })

  test("should escalate on third low confidence", () => {
    // #given
    const output = "**CONFIDENCE: 0.3**"
    analyzeFactCheckOutput(output, "ses-limit-test")
    analyzeFactCheckOutput(output, "ses-limit-test")
    // #when
    const result = analyzeFactCheckOutput(output, "ses-limit-test")
    // #then
    expect(result.recommendation).toBe("escalate")
    expect(result.directive).toContain("[FACT-CHECK: ESCALATE TO USER]")
    expect(result.directive).toContain("3/2")
  })

  test("should not increment counter for pass/polish", () => {
    // #given
    const passOutput = "**CONFIDENCE: 0.9**"
    const polishOutput = "**CONFIDENCE: 0.6**"
    // #when
    analyzeFactCheckOutput(passOutput, "ses-limit-test")
    analyzeFactCheckOutput(polishOutput, "ses-limit-test")
    // #then
    expect(getRewriteAttempts("ses-limit-test")).toBe(0)
  })
})
