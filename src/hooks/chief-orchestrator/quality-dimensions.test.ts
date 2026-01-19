import { describe, test, expect } from "bun:test"
import {
  parseQualityScores,
  buildImprovementDirective,
  hasQualityScores,
  AGENT_DIMENSIONS,
} from "./quality-dimensions"

describe("parseQualityScores", () => {
  test("should parse multi-dimensional researcher output", () => {
    // #given
    const output = `
Research complete. Here are my findings...

---
**QUALITY SCORES:**
- Coverage: 0.85
- Sources: 0.70
- Relevance: 0.90
**OVERALL: 0.82**
**WEAKEST: Sources**
---
`
    // #when
    const result = parseQualityScores(output, "researcher")
    
    // #then
    expect(result).not.toBeNull()
    expect(result!.agentType).toBe("researcher")
    expect(result!.overall).toBe(0.82)
    expect(result!.dimensions).toHaveLength(3)
    expect(result!.dimensions.find(d => d.name === "coverage")?.score).toBe(0.85)
    expect(result!.dimensions.find(d => d.name === "sources")?.score).toBe(0.70)
    expect(result!.dimensions.find(d => d.name === "relevance")?.score).toBe(0.90)
    expect(result!.allPass).toBe(true)
    expect(result!.weakest).toBeNull()
  })

  test("should identify weak dimension below threshold", () => {
    // #given
    const output = `
---
**QUALITY SCORES:**
- Coverage: 0.85
- Sources: 0.55
- Relevance: 0.90
**OVERALL: 0.77**
---
`
    // #when
    const result = parseQualityScores(output, "researcher")
    
    // #then
    expect(result).not.toBeNull()
    expect(result!.allPass).toBe(false)
    expect(result!.weakest).not.toBeNull()
    expect(result!.weakest!.name).toBe("sources")
    expect(result!.weakest!.weak).toBe(true)
  })

  test("should parse fact-checker dimensions", () => {
    // #given
    const output = `
---
**QUALITY SCORES:**
- Accuracy: 0.95
- Authority: 0.88
- Completeness: 0.90
**OVERALL: 0.91**
---
`
    // #when
    const result = parseQualityScores(output, "fact-checker")
    
    // #then
    expect(result).not.toBeNull()
    expect(result!.dimensions.find(d => d.name === "accuracy")?.score).toBe(0.95)
    expect(result!.dimensions.find(d => d.name === "authority")?.score).toBe(0.88)
    expect(result!.allPass).toBe(true)
  })

  test("should parse writer dimensions", () => {
    // #given
    const output = `
---
**QUALITY SCORES:**
- Structure: 0.80
- Clarity: 0.75
- Grounding: 0.65
**OVERALL: 0.73**
---
`
    // #when
    const result = parseQualityScores(output, "writer")
    
    // #then
    expect(result).not.toBeNull()
    expect(result!.weakest?.name).toBe("grounding")
    expect(result!.allPass).toBe(false)
  })

  test("should fall back to legacy CONFIDENCE format", () => {
    // #given
    const output = `
Analysis complete.
---
**CONFIDENCE: 0.85**
`
    // #when
    const result = parseQualityScores(output, "researcher")
    
    // #then
    expect(result).not.toBeNull()
    expect(result!.overall).toBe(0.85)
    expect(result!.dimensions).toHaveLength(1)
    expect(result!.dimensions[0].name).toBe("overall")
    expect(result!.allPass).toBe(true)
  })

  test("should detect weak dimension in legacy format", () => {
    // #given
    const output = "**CONFIDENCE: 0.55**"
    
    // #when
    const result = parseQualityScores(output, "fact-checker")
    
    // #then
    expect(result).not.toBeNull()
    expect(result!.overall).toBe(0.55)
    expect(result!.allPass).toBe(false)
    expect(result!.weakest?.weak).toBe(true)
  })

  test("should return null for no scores", () => {
    // #given
    const output = "Just regular text without any scores"
    
    // #when
    const result = parseQualityScores(output, "researcher")
    
    // #then
    expect(result).toBeNull()
  })
})

describe("buildImprovementDirective", () => {
  test("should build pass directive when all dimensions pass", () => {
    // #given
    const assessment = {
      agentType: "researcher" as const,
      dimensions: [
        { name: "coverage", label: "Coverage", score: 0.85, weak: false },
        { name: "sources", label: "Sources", score: 0.80, weak: false },
        { name: "relevance", label: "Relevance", score: 0.90, weak: false },
      ],
      overall: 0.85,
      weakest: null,
      allPass: true,
    }
    
    // #when
    const result = buildImprovementDirective(assessment, "ses_123")
    
    // #then
    expect(result).toContain("[RESEARCH PASSED]")
    expect(result).toContain("Coverage: 0.85 ✓")
    expect(result).toContain("Sources: 0.80 ✓")
    expect(result).toContain("Proceed to writing phase")
  })

  test("should build improvement directive for weak dimension", () => {
    // #given
    const weakest = { name: "sources", label: "Sources", score: 0.55, weak: true }
    const assessment = {
      agentType: "researcher" as const,
      dimensions: [
        { name: "coverage", label: "Coverage", score: 0.85, weak: false },
        weakest,
        { name: "relevance", label: "Relevance", score: 0.90, weak: false },
      ],
      overall: 0.77,
      weakest,
      allPass: false,
    }
    
    // #when
    const result = buildImprovementDirective(assessment, "ses_456")
    
    // #then
    expect(result).toContain("[RESEARCH: NEEDS POLISH]")
    expect(result).toContain("Sources: 0.55 ⚠ (WEAKEST)")
    expect(result).toContain("**PROBLEM:** Sources is below threshold")
    expect(result).toContain("**FOCUS ON:**")
    expect(result).toContain("Find more primary and authoritative sources")
    expect(result).toContain('resume="ses_456"')
  })

  test("should use REWRITE recommendation for very low scores", () => {
    // #given
    const weakest = { name: "structure", label: "Structure", score: 0.30, weak: true }
    const assessment = {
      agentType: "writer" as const,
      dimensions: [
        weakest,
        { name: "clarity", label: "Clarity", score: 0.40, weak: true },
        { name: "grounding", label: "Grounding", score: 0.35, weak: true },
      ],
      overall: 0.35,
      weakest,
      allPass: false,
    }
    
    // #when
    const result = buildImprovementDirective(assessment, "ses_789")
    
    // #then
    expect(result).toContain("[DRAFT: NEEDS REWRITE]")
    expect(result).toContain("35%")
  })

  test("should route archivist coverage failure to research", () => {
    // #given
    const weakest = { name: "coverage", label: "Coverage", score: 0.40, weak: true }
    const assessment = {
      agentType: "archivist" as const,
      dimensions: [
        weakest,
        { name: "connections", label: "Connections", score: 0.70, weak: false },
        { name: "relevance", label: "Relevance", score: 0.75, weak: false },
      ],
      overall: 0.62,
      weakest,
      allPass: false,
    }
    
    // #when
    const result = buildImprovementDirective(assessment, "ses_arc")
    
    // #then
    expect(result).toContain('category="research"')
  })

  test("should route writer grounding failure to research", () => {
    // #given
    const weakest = { name: "grounding", label: "Grounding", score: 0.50, weak: true }
    const assessment = {
      agentType: "writer" as const,
      dimensions: [
        { name: "structure", label: "Structure", score: 0.80, weak: false },
        { name: "clarity", label: "Clarity", score: 0.75, weak: false },
        weakest,
      ],
      overall: 0.68,
      weakest,
      allPass: false,
    }
    
    // #when
    const result = buildImprovementDirective(assessment, "ses_wrt")
    
    // #then
    expect(result).toContain('category="research"')
  })
})

describe("hasQualityScores", () => {
  test("should detect multi-dimensional format", () => {
    expect(hasQualityScores("**QUALITY SCORES:**\n- Coverage: 0.85")).toBe(true)
  })

  test("should detect legacy CONFIDENCE format", () => {
    expect(hasQualityScores("**CONFIDENCE: 0.85**")).toBe(true)
  })

  test("should return false for no scores", () => {
    expect(hasQualityScores("No scores here")).toBe(false)
  })
})

describe("AGENT_DIMENSIONS", () => {
  test("should have 3 dimensions for each agent type", () => {
    expect(AGENT_DIMENSIONS["researcher"]).toHaveLength(3)
    expect(AGENT_DIMENSIONS["fact-checker"]).toHaveLength(3)
    expect(AGENT_DIMENSIONS["writer"]).toHaveLength(3)
    expect(AGENT_DIMENSIONS["editor"]).toHaveLength(3)
    expect(AGENT_DIMENSIONS["archivist"]).toHaveLength(3)
    expect(AGENT_DIMENSIONS["extractor"]).toHaveLength(3)
  })

  test("should have improvement hints for each dimension", () => {
    for (const agentType of Object.keys(AGENT_DIMENSIONS)) {
      const dims = AGENT_DIMENSIONS[agentType as keyof typeof AGENT_DIMENSIONS]
      for (const dim of dims) {
        expect(dim.improvementHints.length).toBeGreaterThan(0)
      }
    }
  })
})
