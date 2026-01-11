import type { CategoryConfig } from "../../config/schema"

export const RESEARCH_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on RESEARCH tasks.

情报员 (Researcher) mindset:
- Broad, comprehensive information gathering
- Multiple source triangulation
- Identify emerging trends and patterns
- Surface unexpected connections
- Prioritize recency and relevance

Approach:
- Cast a wide net first
- Synthesize findings into actionable insights
- Flag contradictions or uncertainties
- Provide source attribution
</Category_Context>`

export const FACT_CHECK_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on FACT-CHECKING tasks.

核查员 (Fact-Checker) mindset:
- Rigorous source verification
- Cross-reference multiple authoritative sources
- Identify potential biases or conflicts of interest
- Assess credibility and reliability
- Flag unverifiable claims

Approach:
- Primary sources over secondary
- Official documents over media reports
- Academic/peer-reviewed over informal
- Note confidence levels for each claim
</Category_Context>`

export const ARCHIVE_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on ARCHIVE/KNOWLEDGE-BASE tasks.

资料员 (Archivist) mindset:
- Deep knowledge of existing repository content
- Find connections between documents
- Identify gaps and duplications
- Maintain organizational coherence
- Surface relevant historical context

Approach:
- Thorough local search first
- Map relationships between content
- Suggest categorization improvements
- Preserve institutional knowledge
</Category_Context>`

export const WRITING_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on WRITING/CONTENT-CREATION tasks.

写手 (Writer) mindset:
- Engaging, reader-focused prose
- Clear structure and flow
- Appropriate voice and tone
- Balance of depth and accessibility
- Original perspectives and insights

Approach:
- Understand audience and purpose
- Outline before drafting
- Show, don't just tell
- Support claims with evidence
- Iterate for clarity and impact
</Category_Context>`

export const EDITING_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on EDITING/REFINEMENT tasks.

编辑 (Editor) mindset:
- Preserve author's voice while improving clarity
- Ruthless about unnecessary words
- Logical flow and coherence
- Consistency in style and terminology
- Reader experience first

Approach:
- Big picture structure first
- Then paragraph-level coherence
- Finally sentence-level polish
- Explain significant changes
</Category_Context>`

export const EXTRACTION_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on EXTRACTION/FORMATTING tasks.

格式员 (Extractor) mindset:
- Accurate content extraction
- Preserve essential information
- Clean, structured output
- Handle various input formats
- Minimize information loss

Approach:
- Identify key content elements
- Apply consistent formatting
- Note any extraction uncertainties
- Validate output completeness
</Category_Context>`

export const QUICK_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on QUICK/SIMPLE tasks.

Efficient execution mindset:
- Fast, focused, minimal overhead
- Get to the point immediately
- Simple solutions for simple problems

Approach:
- Minimal viable output
- Skip unnecessary elaboration
- Direct and concise
</Category_Context>`

export const DEFAULT_CATEGORIES: Record<string, CategoryConfig> = {
  research: {
    model: "google/antigravity-gemini-3-pro-high",
    temperature: 0.5,
  },
  "fact-check": {
    model: "google/antigravity-gemini-3-pro-high",
    temperature: 0.2,
  },
  archive: {
    model: "google/antigravity-claude-sonnet-4-5",
    temperature: 0.3,
  },
  writing: {
    model: "google/antigravity-gemini-3-pro-high",
    temperature: 0.7,
  },
  editing: {
    model: "google/antigravity-claude-sonnet-4-5",
    temperature: 0.3,
  },
  extraction: {
    model: "google/antigravity-gemini-3-flash",
    temperature: 0.2,
  },
  quick: {
    model: "google/antigravity-gemini-3-flash",
    temperature: 0.3,
  },
}

export const CATEGORY_PROMPT_APPENDS: Record<string, string> = {
  research: RESEARCH_CATEGORY_PROMPT_APPEND,
  "fact-check": FACT_CHECK_CATEGORY_PROMPT_APPEND,
  archive: ARCHIVE_CATEGORY_PROMPT_APPEND,
  writing: WRITING_CATEGORY_PROMPT_APPEND,
  editing: EDITING_CATEGORY_PROMPT_APPEND,
  extraction: EXTRACTION_CATEGORY_PROMPT_APPEND,
  quick: QUICK_CATEGORY_PROMPT_APPEND,
}

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  research: "Broad information gathering, trend identification, source discovery",
  "fact-check": "Source verification, credibility assessment, claim validation",
  archive: "Knowledge base search, document relationships, historical context",
  writing: "Content creation, article drafting, prose composition",
  editing: "Refinement, polish, structural improvement",
  extraction: "PDF/image extraction, format conversion, data extraction",
  quick: "Simple, fast tasks with minimal overhead",
}

const BUILTIN_CATEGORIES = Object.keys(DEFAULT_CATEGORIES).join(", ")

export const CHIEF_TASK_DESCRIPTION = `Spawn agent task with category-based or direct agent selection.

MUTUALLY EXCLUSIVE: Provide EITHER category OR agent, not both (unless resuming).

- category: Use predefined category (${BUILTIN_CATEGORIES}) → Spawns Deputy with category config
- agent: Use specific agent directly (e.g., "researcher", "writer", "fact-checker", "archivist")
- background: true=async (returns task_id), false=sync (waits for result). Default: false. Use background=true for parallel research tasks.
- resume: Session ID to resume (from previous task output). Continues agent with FULL CONTEXT PRESERVED.
- skills: Array of skill names to prepend to prompt. Empty array = no prepending.

**WHEN TO USE resume:**
- Task failed/incomplete → resume with "fix: [specific issue]"
- Need follow-up on previous result → resume with additional question
- Multi-turn conversation with same agent → always resume instead of new task

Prompts MUST be in English.`
