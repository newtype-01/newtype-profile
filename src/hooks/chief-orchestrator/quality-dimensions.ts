/**
 * Multi-dimensional quality scoring for agent outputs
 * 
 * Each agent type has specific quality dimensions that are
 * more actionable than a single confidence score.
 */

export type AgentType = "fact-checker" | "researcher" | "writer" | "editor" | "archivist" | "extractor"

/**
 * Dimension definitions for each agent type
 */
export interface DimensionDefinition {
  name: string
  label: string
  description: string
  /** Improvement suggestions when this dimension is weak */
  improvementHints: string[]
}

export const AGENT_DIMENSIONS: Record<AgentType, DimensionDefinition[]> = {
  researcher: [
    {
      name: "coverage",
      label: "Coverage",
      description: "How completely the topic was explored",
      improvementHints: [
        "Search for additional angles and perspectives",
        "Explore related subtopics that were missed",
        "Look for recent developments and updates",
      ],
    },
    {
      name: "sources",
      label: "Sources",
      description: "Quality and reliability of sources found",
      improvementHints: [
        "Find more primary and authoritative sources",
        "Cross-reference claims with official documentation",
        "Replace secondary sources with original publications",
      ],
    },
    {
      name: "relevance",
      label: "Relevance",
      description: "How well findings match the research question",
      improvementHints: [
        "Refine search terms to match the core question",
        "Filter out tangential information",
        "Focus on directly applicable findings",
      ],
    },
  ],

  "fact-checker": [
    {
      name: "accuracy",
      label: "Accuracy",
      description: "Correctness of claims verified",
      improvementHints: [
        "Re-verify claims marked as uncertain",
        "Find additional confirming sources",
        "Check for more recent data that may contradict",
      ],
    },
    {
      name: "authority",
      label: "Authority",
      description: "Authoritativeness of verification sources",
      improvementHints: [
        "Find official or primary sources for verification",
        "Replace news reports with original studies",
        "Verify through domain experts or institutions",
      ],
    },
    {
      name: "completeness",
      label: "Completeness",
      description: "How many claims were actually checked",
      improvementHints: [
        "Identify and verify remaining unchecked claims",
        "Check implicit claims and assumptions",
        "Verify quoted statistics and numbers",
      ],
    },
  ],

  writer: [
    {
      name: "structure",
      label: "Structure",
      description: "Logical organization and flow",
      improvementHints: [
        "Reorganize sections for better flow",
        "Add missing transitions between ideas",
        "Ensure logical progression of arguments",
      ],
    },
    {
      name: "clarity",
      label: "Clarity",
      description: "How clearly ideas are expressed",
      improvementHints: [
        "Simplify complex sentences",
        "Define technical terms on first use",
        "Break down dense paragraphs",
      ],
    },
    {
      name: "grounding",
      label: "Grounding",
      description: "How well content is supported by sources",
      improvementHints: [
        "Add citations for unsupported claims",
        "Link assertions to provided research",
        "Remove or flag unsubstantiated statements",
      ],
    },
  ],

  editor: [
    {
      name: "polish",
      label: "Polish",
      description: "Language refinement and readability",
      improvementHints: [
        "Tighten wordy phrases",
        "Improve sentence rhythm and flow",
        "Eliminate redundancy",
      ],
    },
    {
      name: "logic",
      label: "Logic",
      description: "Soundness of arguments and reasoning",
      improvementHints: [
        "Identify and fix logical gaps",
        "Strengthen weak arguments",
        "Ensure conclusions follow from premises",
      ],
    },
    {
      name: "consistency",
      label: "Consistency",
      description: "Uniformity of tone, style, terminology",
      improvementHints: [
        "Standardize terminology throughout",
        "Align tone across sections",
        "Fix formatting inconsistencies",
      ],
    },
  ],

  archivist: [
    {
      name: "coverage",
      label: "Coverage",
      description: "How much relevant material was found",
      improvementHints: [
        "Try alternative search terms",
        "Search in different folders or categories",
        "Look for related or linked documents",
      ],
    },
    {
      name: "connections",
      label: "Connections",
      description: "Discovery of relationships between materials",
      improvementHints: [
        "Analyze patterns across found materials",
        "Look for contradictions or confirmations",
        "Identify gaps in the knowledge base",
      ],
    },
    {
      name: "relevance",
      label: "Relevance",
      description: "How applicable materials are to the query",
      improvementHints: [
        "Filter out tangentially related items",
        "Prioritize most directly relevant materials",
        "Explain why each item was selected",
      ],
    },
  ],

  extractor: [
    {
      name: "accuracy",
      label: "Accuracy",
      description: "Correctness of extracted content",
      improvementHints: [
        "Re-extract sections with OCR issues",
        "Verify numbers and special characters",
        "Cross-check against original visually",
      ],
    },
    {
      name: "completeness",
      label: "Completeness",
      description: "Whether all content was captured",
      improvementHints: [
        "Check for missing pages or sections",
        "Extract content from images/charts",
        "Include footnotes and sidebars",
      ],
    },
    {
      name: "format",
      label: "Format",
      description: "Preservation of document structure",
      improvementHints: [
        "Reconstruct table structures",
        "Preserve heading hierarchy",
        "Maintain list formatting",
      ],
    },
  ],
}

/**
 * Quality scores for a single dimension
 */
export interface DimensionScore {
  name: string
  label: string
  score: number
  /** Below threshold? */
  weak: boolean
}

/**
 * Complete quality assessment from an agent
 */
export interface QualityAssessment {
  agentType: AgentType
  dimensions: DimensionScore[]
  overall: number
  weakest: DimensionScore | null
  /** All dimensions meet their thresholds */
  allPass: boolean
}

/**
 * Parse multi-dimensional quality scores from agent output
 * 
 * Expected format:
 * ---
 * **QUALITY SCORES:**
 * - Coverage: 0.85
 * - Sources: 0.70
 * - Relevance: 0.90
 * **OVERALL: 0.82**
 * **WEAKEST: Sources**
 * ---
 */
export function parseQualityScores(output: string, agentType: AgentType): QualityAssessment | null {
  const multiDimMatch = output.match(/\*\*QUALITY SCORES:\*\*\s*([\s\S]*?)\*\*OVERALL:\s*([\d.]+)\*\*/i)
  
  if (multiDimMatch) {
    const dimensionBlock = multiDimMatch[1]
    const overall = parseFloat(multiDimMatch[2])
    
    const dimensions: DimensionScore[] = []
    const dimensionDefs = AGENT_DIMENSIONS[agentType]
    
    for (const def of dimensionDefs) {
      const pattern = new RegExp(`-\\s*${def.label}:\\s*([\\d.]+)`, "i")
      const match = dimensionBlock.match(pattern)
      if (match) {
        const score = parseFloat(match[1])
        dimensions.push({
          name: def.name,
          label: def.label,
          score,
          weak: score < 0.7,
        })
      }
    }
    
    if (dimensions.length === 0) {
      return null
    }
    
    const weakest = dimensions.reduce((min, d) => 
      d.score < min.score ? d : min
    , dimensions[0])
    
    return {
      agentType,
      dimensions,
      overall: isNaN(overall) ? dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length : overall,
      weakest: weakest.weak ? weakest : null,
      allPass: dimensions.every(d => !d.weak),
    }
  }
  
  const legacyMatch = output.match(/\*\*CONFIDENCE:\s*([\d.]+)\*\*/i)
  if (legacyMatch) {
    const score = parseFloat(legacyMatch[1])
    if (!isNaN(score) && score >= 0 && score <= 1) {
      return {
        agentType,
        dimensions: [{
          name: "overall",
          label: "Overall",
          score,
          weak: score < 0.7,
        }],
        overall: score,
        weakest: score < 0.7 ? { name: "overall", label: "Overall", score, weak: true } : null,
        allPass: score >= 0.7,
      }
    }
  }
  
  return null
}

/**
 * Build improvement directive based on weak dimensions
 */
export function buildImprovementDirective(
  assessment: QualityAssessment,
  sessionId: string
): string {
  const { agentType, dimensions, overall, weakest, allPass } = assessment
  
  const agentLabels: Record<AgentType, string> = {
    "fact-checker": "FACT-CHECK",
    researcher: "RESEARCH",
    writer: "DRAFT",
    editor: "EDIT",
    archivist: "ARCHIVE",
    extractor: "EXTRACTION",
  }
  const label = agentLabels[agentType]
  
  const dimLines = dimensions.map(d => {
    const status = d.weak ? "⚠" : "✓"
    const weakLabel = d === weakest ? " (WEAKEST)" : ""
    return `- ${d.label}: ${d.score.toFixed(2)} ${status}${weakLabel}`
  }).join("\n")
  
  if (allPass) {
    return `[${label} PASSED]
Quality Scores:
${dimLines}
Overall: ${(overall * 100).toFixed(0)}% (HIGH)

Action: ${getPassAction(agentType)}`
  }
  
  const recommendation = overall >= 0.7 ? "POLISH" : overall >= 0.5 ? "IMPROVE" : "REWRITE"
  const weakDim = weakest!
  const dimDef = AGENT_DIMENSIONS[agentType].find(d => d.name === weakDim.name)
  const hints = dimDef?.improvementHints ?? []
  
  return `[${label}: NEEDS ${recommendation}]
Quality Scores:
${dimLines}
Overall: ${(overall * 100).toFixed(0)}%

**PROBLEM:** ${weakDim.label} is below threshold (${weakDim.score.toFixed(2)} < 0.70)

**FOCUS ON:**
${hints.slice(0, 2).map(h => `• ${h}`).join("\n")}

**DO NOT:**
• Redo work that already meets standards
• Make broad changes when specific fixes are needed

REQUIRED: Call chief_task with:
  category="${getImprovementCategory(agentType, weakDim.name)}"
  resume="${sessionId}"
  prompt="Improve ${weakDim.label.toLowerCase()}. ${hints[0]}"`
}

function getPassAction(agentType: AgentType): string {
  switch (agentType) {
    case "fact-checker": return "All claims verified. Content ready for delivery."
    case "researcher": return "Research comprehensive. Proceed to writing phase."
    case "writer": return "Draft complete and well-structured. Send to editor."
    case "editor": return "Content polished. Send to fact-check."
    case "archivist": return "Materials retrieved. Ready for use."
    case "extractor": return "Extraction complete. Content ready for processing."
  }
}

function getImprovementCategory(agentType: AgentType, weakDimension: string): string {
  if (agentType === "archivist" && weakDimension === "coverage") {
    return "research"
  }
  if (agentType === "writer" && weakDimension === "grounding") {
    return "research"
  }
  
  const categoryMap: Record<AgentType, string> = {
    "fact-checker": "fact-check",
    researcher: "research",
    writer: "writing",
    editor: "editing",
    archivist: "archive",
    extractor: "extraction",
  }
  return categoryMap[agentType]
}

/**
 * Check if output has quality scores (either format)
 */
export function hasQualityScores(output: string): boolean {
  return /\*\*QUALITY SCORES:\*\*/i.test(output) || /\*\*CONFIDENCE:\s*[\d.]+\*\*/i.test(output)
}
