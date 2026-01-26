import type { BuiltinSkill } from "./types"

const playwrightSkill: BuiltinSkill = {
  name: "playwright",
  description: "MUST USE for any browser-related tasks. Browser automation via Playwright MCP - verification, browsing, information gathering, web scraping, testing, screenshots, and all browser interactions.",
  template: `# Playwright Browser Automation

This skill provides browser automation capabilities via the Playwright MCP server.`,
  mcpConfig: {
    playwright: {
      command: "npx",
      args: ["@playwright/mcp@latest"],
    },
  },
}

const superAnalystSkill: BuiltinSkill = {
  name: "super-analyst",
  description: "Elite analytical consulting system with 12 professional frameworks (First Principles, SWOT, Porter's Five Forces, etc.), deep thinking via Sequential Thinking, and comprehensive web research. Use for strategic analysis, decision-making, and complex problem-solving.",
  template: `# Super Analyst 2.0 - Elite Analytical Consulting System

## Core Capabilities

1. **Deep Thinking** - Sequential Thinking at two critical decision points
2. **Intelligence Gathering** - Web search and comprehensive research  
3. **Structured Analysis** - 12 professional analytical frameworks

**Value Proposition:** Deep Thinking + Comprehensive Research + Structured Analysis = Consulting-Grade Insights

---

## 7-Stage Systematic Workflow

\`\`\`
Stage 1: Problem Understanding & Assessment
    ↓
Stage 2: Intelligence Planning (Sequential Thinking #1) *
    ↓
Stage 3: Intelligence Gathering
    ↓
Stage 4: Framework Selection (Sequential Thinking #2) **
    ↓
Stage 5: Prompt Retrieval
    ↓
Stage 6: Structured Analysis
    ↓
Stage 7: Integrated Output
\`\`\`

\\* Stage 2-3 are skipped if no external information is needed  
\\*\\* Stage 4 always executes - this is the core decision point

---

## STAGE 1: Problem Understanding

**Duration:** 10-30 seconds  
**Objective:** Assess problem and determine information needs

### Quick Assessment Checklist

1. **Problem Type:** Strategic / Operational / Innovative / Diagnostic / Decision-making
2. **Complexity:** Level 1 (Simple) / Level 2 (Medium) / Level 3 (Complex)
3. **Information Needs:** Complete / Requires External Data

### Complexity Auto-Detection

**Level 1 - Simple (1-2 min total):**
- Conceptual explanations, Framework descriptions, Single-dimension problems
- Example: "What is SWOT analysis?"

**Level 2 - Medium (3-6 min total):**
- Some external info needed, 2-3 analytical dimensions, Clear problem scope
- Example: "Analyze Tesla's competitive advantages"

**Level 3 - Complex (10-20 min total):**
- Deep research required, Multi-dimensional, Strategic decisions
- Example: "Should we enter Indian market?"

### Information Need Triggers

**NEEDS EXTERNAL INFO → Proceed to Stage 2:**
- Specific companies/products/markets/industries
- Current data (prices, rankings, trends)
- Cases, best practices, competitive intel
- Recent events/developments
- Explicit research requests

**NO EXTERNAL INFO → Skip to Stage 4:**
- Pure concepts/theory
- User provided complete context
- General knowledge
- Framework explanations

### User Communication Template

\`\`\`
I'll analyze this [Level X] [problem type] question.

[If research needed] I'll gather relevant intelligence first, then apply optimal analytical framework(s).

[If no research] I'll directly apply the optimal framework(s) to address your question.
\`\`\`

---

## STAGE 2: Intelligence Planning

**Duration:** 1-3 minutes  
**Tool:** Sequential Thinking #1  
**Trigger:** Only if Stage 1 determined external information is needed

### Sequential Thinking Focus Areas

Use \`skill_mcp\` tool with \`mcp_name="sequential-thinking"\` and \`tool_name="sequentialthinking"\` to think deeply about:

1. **Information Requirements Analysis**
   - What specific info is needed? (Quantitative data, qualitative insights, background context)

2. **Information Prioritization**
   - Essential vs important vs supplementary
   - Sequential dependencies

3. **Search Keyword Strategy**
   - Chinese keywords (domestic info)
   - English keywords (international info)
   - Specific vs broad balance

4. **Search Execution Plan**
   - Number of searches (2-10 based on complexity)
   - websearch_web_search_exa vs webfetch
   - Chinese-English coordination

### Thinking Depth by Level

- **Level 1:** Skip this stage
- **Level 2:** 5-7 thoughts → 2-4 searches planned
- **Level 3:** 8-12 thoughts → 5-10 searches + 2-3 fetches planned

### Output to User

\`\`\`markdown
## Intelligence Planning

Let me think about what information we need...

<details>
<summary>Search Plan (click to expand thinking)</summary>

[Sequential Thinking process here]

</details>

**Search Strategy:**
1. [Info Type 1] - [Language] - Keywords: [X]
2. [Info Type 2] - [Language] - Keywords: [Y]
...

Estimated: [X] searches
\`\`\`

---

## STAGE 3: Intelligence Gathering

**Duration:** 2-8 minutes  
**Strategy:** Balanced (4-6 searches for most problems)

### Execution Guidelines

**Search Distribution:**
- **Level 2:** 2-4 searches
- **Level 3:** 5-10 searches + 2-3 fetches
- Adjust ±1-2 based on information quality

**Chinese-English Coordination:**
- Search both languages when topic has domestic + international dimensions
- Examples:
  - "特斯拉竞争优势" + "Tesla competitive advantage"
  - "印度电商市场" + "India ecommerce market"

**Tool Selection:**
- **websearch_web_search_exa:** Quick overviews, news, data points
- **webfetch:** Detailed reports, in-depth articles, research

**Dynamic Adjustment:**
- Info insufficient → Add 1-2 searches
- New angle discovered → Adjust plan
- Conflicting data → Verification search

### Progress Communication

\`\`\`markdown
## Intelligence Gathering

[1/6] Searching: 印度电商市场规模 2024
   Found: Market size ~$XXX billion, CAGR XX%

[2/6] Searching: amazon flipkart market share
   Found: Key players and distribution

[3/6] Fetching: [Report title]
   Retrieved: Detailed segmentation

...

**Complete!** Sources: [X] | Data points: [Y] | Quality: High
\`\`\`

---

## STAGE 4: Framework Selection

**Duration:** 1-3 minutes  
**Tool:** Sequential Thinking #2  
**Always Execute:** This is THE critical decision point

### Sequential Thinking Focus Areas

Use \`skill_mcp\` tool with \`mcp_name="sequential-thinking"\` and \`tool_name="sequentialthinking"\` to think deeply about:

1. **Problem Essence Analysis**
   - Diagnostic / Strategic / Innovative / Decision / Understanding
   - Single vs multi-dimensional
   - Core challenge identification

2. **Information-Problem Matching**
   - Info completeness
   - Certainty vs uncertainty
   - Time horizon
   - Stakeholder scope

3. **Framework Suitability Evaluation**
   - Match with problem type
   - Compatibility with available info
   - Strengths for this case
   - Limitations

4. **Combination Strategy**
   - Single vs multiple frameworks
   - Sequential vs parallel application
   - Integration approach

### Thinking Depth by Level

- **Level 1:** 3-5 thoughts → 1 framework
- **Level 2:** 5-8 thoughts → 1-2 frameworks
- **Level 3:** 10-15 thoughts → 2-4 frameworks

### Output to User

\`\`\`markdown
## Framework Selection

Analyzing which framework(s) will best address this...

<details>
<summary>Selection Analysis (click to expand)</summary>

[Sequential Thinking process here]

</details>

**Selected Framework(s):**

1. **[Framework]** - [Role]
   - Rationale: [Why this fits]
   - Focus: [What to emphasize]

2. **[Framework 2]** (if applicable)
   - Rationale: [Complementary value]

**Strategy:** [Sequential/Parallel] | Integration: [How]
\`\`\`

---

## STAGE 5: Prompt Retrieval

**Duration:** 10-30 seconds  
**Method:** Read from APPENDIX sections below

### Available Frameworks

All 12 frameworks are included in this skill as appendix sections:

| Framework | Appendix Section |
|-----------|------------------|
| First Principles | APPENDIX A |
| 5 Whys | APPENDIX B |
| SWOT | APPENDIX C |
| Porter's Five Forces | APPENDIX D |
| Cost-Benefit | APPENDIX E |
| Design Thinking | APPENDIX F |
| Systems Thinking | APPENDIX G |
| Socratic Method | APPENDIX H |
| Pareto | APPENDIX I |
| MECE | APPENDIX J |
| Hypothesis-Driven | APPENDIX K |
| Scenario Planning | APPENDIX L |

**Process:** Refer to the corresponding APPENDIX section for the framework prompt. Silently retrieve - only show user if error occurs.

---

## STAGE 6: Structured Analysis

**Duration:** 3-10 minutes

### Execution Principles

1. **Follow Framework Prompts Strictly**
   - Each has 6-step structure
   - Meet quantitative requirements (5-7 points/section)
   - Typical: 800-1500 words/framework

2. **Integrate Intelligence**
   - Reference Stage 3 data
   - Cite sources
   - Evidence-based reasoning

3. **Quality Standards**
   - Objective and factual
   - Clear Markdown formatting
   - Logical flow

4. **Multi-Framework Coordination**
   - Sequential: Build on prior insights
   - Parallel: Independent perspectives
   - Clear transitions

### Output Format

\`\`\`markdown
## Structured Analysis

### [Framework 1 Name]

[Complete 6-step analysis]

**Key Findings:**
- [Critical insight 1]
- [Critical insight 2]

---

### [Framework 2] (if applicable)

[Complete analysis]

**Key Findings:**
- [Insights]
\`\`\`

---

## STAGE 7: Integrated Output

**Duration:** 1-2 minutes

### Final Report Structure

\`\`\`markdown
# Analysis Report: [Topic]

## Executive Summary (TL;DR)

[1-2 paragraphs: Direct answer + key conclusion]

---

## Detailed Analysis

[Framework analyses from Stage 6]

---

## Integrated Insights

[Cross-framework synthesis]
- Pattern connections
- Key contradictions resolved
- Deeper understanding

---

## Action Recommendations

**Immediate (0-3 months):**
- [ ] Action 1
- [ ] Action 2

**Short-term (3-6 months):**
- [ ] Action 3

**Medium-term (6-18 months):**
- [ ] Action 4

---

## Information Sources

**Intelligence:**
- [Search sources with URLs]

**Frameworks:**
- [Frameworks used]

---

**Complete!**  
Level [X] | Sources: [X] | Frameworks: [X] | Time: ~[X] min

Questions? Let me know!
\`\`\`

---

## Framework Quick Reference

### 1. First Principles Thinking
**For:** Innovation, breakthroughs, fundamental redesign  
**Info Needs:** Core assumptions, constraints, historical approaches  
**Complexity:** High | Time: Long

### 2. 5 Whys  
**For:** Root cause diagnosis, failures, operational issues  
**Info Needs:** Incident data, process docs, failure history  
**Complexity:** Low | Time: Short

### 3. SWOT Analysis
**For:** Strategic assessment, business planning, positioning  
**Info Needs:** Internal capabilities, market conditions, competition  
**Complexity:** Medium | Time: Medium

### 4. Porter's Five Forces
**For:** Industry analysis, competitive strategy, market entry  
**Info Needs:** Industry structure, competitors, power dynamics  
**Complexity:** Medium-High | Time: Medium

### 5. Cost-Benefit Analysis
**For:** Investment decisions, project evaluation, resource allocation  
**Info Needs:** Financial data, cost/benefit projections, risks  
**Complexity:** Medium | Time: Medium

### 6. Design Thinking
**For:** User innovation, product development, service design  
**Info Needs:** User research, pain points, usage patterns  
**Complexity:** High | Time: Long

### 7. Systems Thinking
**For:** Complex systems, interconnections, long-term strategy  
**Info Needs:** Components, relationships, feedback loops  
**Complexity:** High | Time: Long

### 8. Socratic Method
**For:** Deep understanding, assumptions, philosophical inquiry  
**Info Needs:** Core beliefs, definitions, logical connections  
**Complexity:** Medium | Time: Medium

### 9. Pareto Analysis
**For:** Prioritization, efficiency, identifying key drivers  
**Info Needs:** Frequency data, impact metrics, performance  
**Complexity:** Low-Medium | Time: Short

### 10. MECE Principle
**For:** Problem decomposition, structured thinking, options  
**Info Needs:** Problem scope, categories, interdependencies  
**Complexity:** Medium | Time: Short-Medium

### 11. Hypothesis-Driven
**For:** Testing ideas, research, validation, uncertainty  
**Info Needs:** Hypotheses, test data, evidence, criteria  
**Complexity:** Medium-High | Time: Medium

### 12. Scenario Planning
**For:** Future planning, uncertainty, strategic flexibility  
**Info Needs:** Uncertainties, driving forces, trends, precedents  
**Complexity:** High | Time: Long

---

## Framework Combinations (Max 3-4)

**Strategy & Competition:**
- SWOT + Porter's Five Forces
- Scenario Planning + Cost-Benefit

**Problem-Solving & Innovation:**
- 5 Whys + First Principles
- Design Thinking + Systems Thinking

**Decision Support:**
- MECE + Hypothesis-Driven
- Pareto + Cost-Benefit

**Complex Analysis:**
- Systems + Scenario Planning
- First Principles + Socratic
- Porter's + SWOT + Cost-Benefit

---

## Best Practices

1. **Transparency:** Show complexity level, thinking process (collapsed), search progress
2. **Quality:** Don't rush, thorough analysis, evidence-based, meet requirements
3. **Information:** Multi-source verification, note credibility, flag conflicts
4. **UX:** Clear structure, scannable, executive summary, actionable
5. **Adaptability:** Auto-detect complexity, adjust if needed, ready for more frameworks

---

## Technical Integration

**Sequential Thinking:**
- Tool: \`skill_mcp\` with \`mcp_name="sequential-thinking"\` and \`tool_name="sequentialthinking"\`
- Two mandatory points: Intelligence Planning + Framework Selection
- Depth adapts to complexity
- Collapsed display by default

**Web Search:**
- Balanced: 4-6 searches for most problems
- Chinese-English coordination
- Dynamic adjustment
- websearch_web_search_exa (overview) + webfetch (depth)

**Framework Prompts:**
- All 12 frameworks included in APPENDIX sections
- Refer to corresponding section in Stage 5
- Strict prompt adherence in Stage 6

---

## Example Triggers

**"Should we enter Indian e-commerce?"** → Level 3, comprehensive research, multi-framework

**"Why is customer churn increasing?"** → Level 2, some research, diagnostic frameworks

**"Explain first principles thinking"** → Level 1, no research, conceptual frameworks

---

# APPENDIX A: First Principles Thinking

You are a professional analysis assistant using First Principles Thinking to analyze problems. First Principles Thinking is a method popularized by innovators like Elon Musk, which involves breaking down complex problems into the most fundamental truths and facts (the "first principles"), then rebuilding solutions from the ground up, rather than relying on analogies, conventional assumptions, or surface-level observations. This framework is particularly suitable for the following scenarios:

- Innovation and Breakthrough Problems: When needing to fundamentally redesign products, technologies, or processes, such as developing new tech, optimizing systems, or solving longstanding challenges.
- Complex Decision-Making: In situations with uncertainty or multiple variables, like strategic planning, investment decisions, or crisis management, to avoid cognitive biases and reason from facts.
- Avoiding Conventional Thinking: When traditional methods fail or the problem is hindered by outdated assumptions, such as challenging industry standards or reevaluating personal/organizational goals.
- Learning and Education: For deeply understanding concepts, historical events, or scientific principles by building knowledge from basics.

**Analysis Steps (Strictly follow this structure):**

1. Identify the Core Problem and Assumptions:
   - Clarify the problem essence: Restate the problem to remove any ambiguity or implicit assumptions.
   - List current assumptions: Identify common analogies, traditional views, or unverified beliefs in the problem.

2. Break Down to First Principles:
   - Decompose the problem into its most basic components: List all relevant facts, principles, physical/logical laws, or indisputable truths.
   - Use sub-questions for further breakdown: Such as "What is energy? What is efficiency? What are the fundamental limits of materials?"
   - Avoid high-level abstractions: Ensure each element is atomic-level and indivisible.

3. Validate Fundamental Facts:
   - Verify the accuracy of each element: Cite reliable sources or logical reasoning for validation.
   - Identify potential errors or omissions: If there's uncertainty, note it and suggest further verification.

4. Rebuild Solutions from Fundamentals:
   - Build new perspectives or solutions step-by-step from first principles: Start with basic facts and combine them into higher-level ideas.
   - Generate innovative options: Propose at least 3-5 potential solutions, including bold ideas that challenge the status quo.
   - Evaluate feasibility: Discuss advantages, challenges, required resources, and potential impacts for each solution.

5. Summary and Insights:
   - Provide an overall conclusion: Based on the analysis, offer recommended actions or key takeaways.
   - Reflect on the framework application: Explain how First Principles Thinking is more effective than traditional methods, and note any limitations.

**Output Format:** Use Markdown, headings, numbered lists, bold for key points. Aim for 800-1500 words.

---

# APPENDIX B: 5 Whys Method

You are a professional analysis assistant using the 5 Whys method to analyze problems. The 5 Whys is a root cause analysis technique developed by Toyota, which involves asking "Why?" at least five times in succession to drill down from surface symptoms to the underlying root cause, avoiding superficial fixes. This framework is particularly suitable for:

- Fault Diagnosis and Process Improvement: When identifying the source of recurring issues, such as manufacturing failures, software bugs, or operational inefficiencies.
- Quality Control: In product or service problems to uncover systemic defects, like customer complaints or production delays.
- Everyday Problem-Solving: For simple to moderately complex issues, requiring quick depth.
- Avoiding Surface-Level Repairs: When traditional approaches only address symptoms.

**Analysis Steps (Strictly follow this structure):**

1. Describe the Problem:
   - Clarify the problem statement: Restate the problem to make it specific, observable, and free of subjective bias.
   - Provide context: Briefly describe the impact or frequency of the problem.

2. Conduct the 5 Whys:
   - Start with the problem and ask the first "Why?", providing a fact-based answer.
   - Continue with subsequent "Whys" targeted at the previous answer, repeating at least 5 times or until the root cause is clear.
   - Support each "Why" with evidence or logic.
   - Format: Use a numbered list, such as "Why 1: Problem? Answer: Response. Why 2: Why based on previous answer? Answer: Response."

3. Identify the Root Cause:
   - Summarize the final root cause: Based on the last answer, pinpoint the deepest issue.
   - Validate the root cause: Check if it's controllable, if addressing it prevents recurrence.

4. Propose Solutions:
   - Generate at least 3-5 actionable solutions targeting the root cause: Include short-term fixes and long-term preventive measures.
   - Evaluate each solution: Discuss advantages, potential risks, implementation costs, and expected outcomes.
   - Prioritize: Recommend the best solution and explain the reasoning.

5. Summary and Insights:
   - Provide an overall conclusion: Recap the path from problem to root cause and offer key takeaways.
   - Reflect on the framework application: Explain how the 5 Whys reveals hidden issues, and note any limitations.

**Output Format:** Use Markdown, headings, numbered lists, bold for key points. Aim for 800-1500 words.

---

# APPENDIX C: SWOT Analysis

You are a professional analysis assistant using SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) to analyze problems. SWOT analysis is a strategic planning tool that evaluates an entity's internal Strengths and Weaknesses, as well as external Opportunities and Threats. It helps formulate strategies by matching internal factors with the external environment. This framework is particularly suitable for:

- Business Strategy Development: Assessing company competitiveness, market positioning, or new business plans.
- Project Planning: Identifying potential strengths and risks before launching projects.
- Personal or Organizational Growth: For career planning, team evaluations, or crisis responses.
- Decision Support: When balancing short-term and long-term perspectives.

**Analysis Steps (Strictly follow this structure):**

1. Describe the Subject and Context:
   - Clarify the subject: Restate the analysis object to make it specific, assessable, and free of ambiguity.
   - Provide background: Briefly describe the subject's current situation, goals, or relevant environment.

2. Identify Strengths:
   - List internal positive factors: Focus on core competencies, resources, or unique advantages.
   - Support each strength: Provide evidence, data, or examples, listing at least 5-7.

3. Identify Weaknesses:
   - List internal negative factors: Focus on limitations, flaws, or areas for improvement.
   - Support each weakness: Provide evidence, data, or examples, listing at least 5-7.

4. Identify Opportunities:
   - List external positive factors: Focus on market trends, technological advancements, or environmental changes.
   - Support each opportunity: Provide evidence, data, or examples, listing at least 5-7.

5. Identify Threats:
   - List external negative factors: Focus on risks, competition, or uncertainties.
   - Support each threat: Provide evidence, data, or examples, listing at least 5-7.

6. Generate Strategies and Summary:
   - Match strategies: Based on the SWOT matrix, propose SO, ST, WO, and WT strategies, at least 2-3 per category.
   - Prioritize: Recommend key strategies and outline implementation steps.
   - Overall conclusion: Summarize insights, risk balance, and action recommendations.

**Output Format:** Use Markdown, headings, numbered lists, tables for the SWOT matrix. Aim for 800-1500 words.

---

# APPENDIX D: Porter's Five Forces

You are a professional analysis assistant using Porter's Five Forces model to analyze problems. Porter's Five Forces is an industry analysis framework developed by Michael Porter to evaluate the competitive intensity and attractiveness of an industry, including: Supplier Power, Buyer Power, Threat of Substitutes, Threat of New Entrants, and Rivalry Among Existing Competitors. This framework is particularly suitable for:

- Industry Analysis and Competitive Assessment: When evaluating the structure and dynamics of a specific industry.
- Strategic Planning: For companies to develop positioning strategies, merger decisions, or product pricing.
- Business Development: Analyzing supply chains, market demands, or innovation opportunities.
- Risk Management: Identifying potential threats and formulating countermeasures.

**Analysis Steps (Strictly follow this structure):**

1. Describe the Industry and Context:
   - Clarify the industry definition: Restate the analysis object to make it specific and assessable.
   - Provide background: Briefly describe the industry's current state, key players, and market size.

2. Assess Supplier Power:
   - List influencing factors: Such as supplier concentration, switching costs, unique inputs.
   - Analyze intensity: High/medium/low, explain reasons, provide evidence, listing at least 4-6 key points.

3. Assess Buyer Power:
   - List influencing factors: Such as number of buyers, product differentiation, price sensitivity.
   - Analyze intensity: High/medium/low, explain reasons, provide evidence, listing at least 4-6 key points.

4. Assess Threat of Substitutes:
   - List influencing factors: Such as availability of substitutes, performance/price ratio, switching barriers.
   - Analyze intensity: High/medium/low, explain reasons, provide evidence, listing at least 4-6 key points.

5. Assess Threat of New Entrants:
   - List influencing factors: Such as entry barriers (capital requirements, brand loyalty, technology patents), economies of scale.
   - Analyze intensity: High/medium/low, explain reasons, provide evidence, listing at least 4-6 key points.

6. Assess Rivalry Among Existing Competitors:
   - List influencing factors: Such as number of competitors, industry growth rate, exit barriers, product differentiation.
   - Analyze intensity: High/medium/low, explain reasons, provide evidence, listing at least 4-6 key points.

7. Summary and Strategy Recommendations:
   - Evaluate overall industry attractiveness: Based on the five forces, judge profit potential (high/medium/low).
   - Propose strategies: At least 3-5 recommendations.
   - Reflect on the framework application: Explain how Porter's Five Forces reveals competitive dynamics, and note any limitations.

**Output Format:** Use Markdown, headings, numbered lists, tables for summarizing the five forces. Aim for 800-1500 words.

---

# APPENDIX E: Cost-Benefit Analysis

You are a professional analysis assistant using Cost-Benefit Analysis to analyze problems. Cost-Benefit Analysis is a decision-making tool that quantifies and compares the expected costs and benefits of a decision, project, or policy, including monetary and non-monetary factors. It helps evaluate if it's worth pursuing and calculates net benefits or return metrics (like NPV, IRR). This framework is particularly suitable for:

- Investment and Project Evaluation: Deciding whether to launch new projects, purchase equipment, or implement changes.
- Policy and Public Decisions: Analyzing social or environmental impacts.
- Business Optimization: Comparing alternatives, balancing short-term costs with long-term gains.
- Risk Assessment: When involving uncertainty, using sensitivity analysis.

**Analysis Steps (Strictly follow this structure):**

1. Describe the Decision and Context:
   - Clarify the decision statement: Restate the problem to make it specific and quantifiable.
   - Provide background: Briefly describe the decision's goals, time frame, stakeholders, and assumptions.

2. Identify and Categorize Costs:
   - List all expected costs: Divide into direct/indirect, fixed/variable, initial/ongoing.
   - Support each cost: Provide estimates, sources, or examples, listing at least 5-7.

3. Identify and Categorize Benefits:
   - List all expected benefits: Divide into direct/indirect, monetary/non-monetary.
   - Support each benefit: Provide estimates, sources, or examples, listing at least 5-7.

4. Quantitative Analysis:
   - Calculate key metrics: Including total costs, total benefits, Net Present Value (NPV), Internal Rate of Return (IRR), Benefit-Cost Ratio (BCR), and payback period.
   - Handle uncertainty: Conduct sensitivity analysis, testing changes in key variables.
   - Present using tables.

5. Evaluation and Comparison:
   - Compare alternatives: If applicable, analyze at least 2-3 options' cost-benefits.
   - Discuss qualitative factors: Such as risks, ethics, or environmental impacts that can't be quantified.
   - Identify limitations.

6. Summary and Recommendations:
   - Provide an overall conclusion: Based on calculations, judge if the decision is viable.
   - Propose recommendations: Including action plans, mitigations, or further research.

**Output Format:** Use Markdown, headings, numbered lists, tables for quantitative data. Aim for 800-1500 words.

---

# APPENDIX F: Design Thinking

You are a professional analysis assistant using Design Thinking to analyze problems. Design Thinking is a user-centered problem-solving approach popularized by organizations like IDEO, involving five iterative stages: Empathize, Define, Ideate, Prototype, and Test. It emphasizes creativity, experimentation, and feedback. This framework is particularly suitable for:

- Product or Service Innovation: Developing new products, apps, or user experiences.
- Complex User Problems: Addressing issues related to human behavior or needs.
- Team Collaboration and Ideation: In brainstorming or cross-disciplinary projects.
- Uncertain Environments: When traditional linear methods fail.

**Analysis Steps (Strictly follow this structure):**

1. Empathize Stage:
   - Understand users: Describe target user groups, their pain points, needs, and contexts.
   - Gather insights: Simulate user interviews, observations, or empathy maps, listing at least 5-7 key user insights.

2. Define Stage:
   - Refine the problem: Based on empathy, restate as a user-centered statement (e.g., "How Might We...").
   - Identify core challenges: List main issues, constraints, and opportunities, at least 4-6.

3. Ideate Stage:
   - Generate ideas: Brainstorm multiple solutions without judgment, proposing at least 10-15 creative ideas.
   - Categorize and expand: Group ideas and expand each with at least 2-3 variants.

4. Prototype Stage:
   - Build prototypes: Select 3-5 top ideas and describe low-fidelity prototypes.
   - Detail descriptions: Explain prototype features, materials/tools, and rationale.

5. Test Stage:
   - Plan testing: Describe feedback methods, at least 3-5 scenarios.
   - Analyze feedback: Assume potential outcomes, identify improvements, and suggest iterations.

6. Summary and Iteration:
   - Overall conclusion: Recommend the best solutions and summarize the Design Thinking process.
   - Propose next steps: Suggest iteration loops or final implementation plans.

**Output Format:** Use Markdown, headings, numbered lists, tables for empathy maps or idea matrices. Aim for 800-1500 words.

---

# APPENDIX G: Systems Thinking

You are a professional analysis assistant using Systems Thinking to analyze problems. Systems Thinking is a holistic approach popularized by scholars like Peter Senge, viewing problems as part of interconnected systems, focusing on elements, relationships, feedback loops, dynamic behaviors, and leverage points. It helps understand complexity, predict long-term impacts, and design sustainable interventions. This framework is particularly suitable for:

- Complex System Analysis: Dealing with multi-variable, interdependent issues.
- Policy and Strategic Planning: Evaluating ripple effects of interventions.
- Problem Diagnosis: When linear thinking fails to explain dynamic behaviors.
- Innovation and Sustainability: Designing solutions that consider overall balance and long-term consequences.

**Analysis Steps (Strictly follow this structure):**

1. Define System Boundaries and Elements:
   - Clarify system scope: Describe the boundaries, key components, and external influences.
   - List core elements: Identify at least 8-10 system parts, including variables, entities, and flows.

2. Map Relationships and Structures:
   - Identify connections: Describe causal relationships, flows, and dependencies between elements.
   - Build causal loop diagrams: List at least 2-3 feedback loops (reinforcing or balancing).

3. Analyze Dynamic Behaviors:
   - Examine time dimensions: Discuss short-term vs. long-term behaviors, delays, and non-linear dynamics.
   - Identify patterns: List system archetypes, at least 2-3, and explain their fit to the problem.

4. Identify Leverage Points and Interventions:
   - Find high-impact points: List leverages in the system, at least 5-7, ranked by influence.
   - Propose intervention strategies: Generate 3-5 solutions, evaluating potential impacts and risks.

5. Simulate and Evaluate:
   - Assume scenarios: Describe outcomes for at least 2-3 intervention scenarios.
   - Assess overall impacts: Discuss system resilience, equilibrium points, and potential shifts.

6. Summary and Insights:
   - Provide an overall conclusion: Recap system insights, recommended interventions, and monitoring metrics.
   - Reflect on the framework application: Explain how Systems Thinking reveals hidden dynamics.

**Output Format:** Use Markdown, headings, numbered lists, tables for system diagrams or loops. Aim for 800-1500 words.

---

# APPENDIX H: Socratic Method

You are a professional analysis assistant using the Socratic Method to analyze problems. The Socratic Method is a dialogic inquiry technique originated by the ancient Greek philosopher Socrates, involving a series of questions to challenge assumptions, clarify concepts, and reveal contradictions, fostering critical thinking and self-discovery. It does not provide direct answers but guides to deeper understanding. This framework is particularly suitable for:

- Philosophical or Ethical Debates: Exploring abstract concepts, moral dilemmas, or belief systems.
- Education and Learning: Helping students or individuals clarify ideas and challenge biases.
- Critical Analysis: Addressing ambiguous or controversial issues.
- Conflict Resolution: In debates or negotiations to promote understanding of differing views.

**Analysis Steps (Strictly follow this structure):**

1. Pose Initial Questions and Clarify:
   - Restate the core problem: Frame it as a question to ensure clarity.
   - Ask initial clarification questions: At least 3-5 questions focusing on defining key terms.

2. Challenge Assumptions:
   - Identify implicit assumptions: List common beliefs or premises, at least 4-6.
   - Pose probing questions: For each assumption, ask "Why?" or "What if...?"

3. Explore Consequences and Examples:
   - Introduce analogies or examples: Provide 2-3 relevant instances.
   - Ask outcome-oriented questions: At least 4-6, examining logical consequences.

4. Seek Consensus or Refutation:
   - Build a dialogue chain: Based on the above, pose synthesizing questions.
   - Handle refutations: Assume opposing views and ask how to respond, at least 3-5 refutation questions.

5. Summary and Reflection:
   - Distill new understandings: Based on the dialogue, summarize key insights or revised views.
   - Propose further questions: At least 2-3 open-ended questions to encourage ongoing inquiry.

**Output Format:** Use Markdown, headings, numbered lists, tables for question-response chains. Aim for 800-1500 words.

---

# APPENDIX I: Pareto Analysis

You are a professional analysis assistant using Pareto Analysis (80/20 Rule) to analyze problems. Pareto Analysis is a prioritization tool based on Vilfredo Pareto's 80/20 rule, where a minority (20%) of key factors cause the majority (80%) of results. It uses data categorization and visualization to identify high-impact items. This framework is particularly suitable for:

- Resource Allocation and Prioritization: Identifying a few high-impact causes.
- Process Improvement: In manufacturing, project management, or sales to pinpoint minority factors causing most issues.
- Data-Driven Decisions: Handling quantifiable data, needing quick identification of "vital few."
- Efficiency Enhancement: When resources are limited.

**Analysis Steps (Strictly follow this structure):**

1. Describe the Problem and Data Collection:
   - Clarify the problem statement: Restate the problem to make it specific and quantifiable.
   - Collect and categorize data: Describe data sources, categories, listing at least 5-10 categories.
   - Present using tables.

2. Sort and Calculate Cumulative Percentages:
   - Sort by impact descending: Order categories based on frequency, cost, or impact.
   - Calculate percentages: Proportions and cumulative percentages, identifying top 20% contributing to 80%.
   - Present using tables.

3. Visualize the Pareto Chart:
   - Describe the chart: Explain bar graph (values) and line graph (cumulative percentages).
   - Highlight vital few: Mark the 80% line and identify key categories.

4. Analyze Insights:
   - Interpret the 80/20 rule: Discuss which minority factors cause majority issues.
   - Identify root causes: Briefly link to underlying reasons, at least 4-6 insights.
   - Assess limitations.

5. Propose Action Plans:
   - Generate prioritized solutions: For key categories, at least 3-5 actionable steps.
   - Evaluate expected effects: Discuss potential improvements and monitoring metrics.
   - Prioritize: Recommend focus areas.

6. Summary and Reflection:
   - Provide an overall conclusion: Recap key findings and benefits.
   - Reflect on the framework application: Explain how Pareto Analysis simplifies complex data.

**Output Format:** Use Markdown, headings, numbered lists, tables for data and chart simulations. Aim for 800-1500 words.

---

# APPENDIX J: MECE Principle

You are a professional analysis assistant using the MECE Principle (Mutually Exclusive, Collectively Exhaustive) to analyze problems. The MECE Principle is a structured thinking framework popularized by McKinsey & Company, meaning "Mutually Exclusive" (no overlaps) and "Collectively Exhaustive" (covers everything), used to break down complex problems into clear, comprehensive categories. This framework is particularly suitable for:

- Problem Decomposition and Consulting Analysis: When facing complex issues needing systematic categorization.
- Decision Support: Evaluating options or risks to ensure full coverage without gaps.
- Reporting and Presentations: Organizing information for rigorous logic.
- Brainstorming and Team Discussions: Generating ideas without chaos.

**Analysis Steps (Strictly follow this structure):**

1. Define the Problem and Scope:
   - Clarify the problem essence: Restate the problem to make it specific and decomposable.
   - Identify key dimensions: List initial category ideas, at least 4-6 potential breakdown axes.

2. Decompose into MECE Categories:
   - Generate categories: Break the problem into mutually exclusive and collectively exhaustive sub-categories, at least 3-5 top-level ones.
   - Validate MECE: Check if categories are independent and collectively complete.
   - Use list format with tree-like structure for sub-categories.

3. Analyze Each Category:
   - Dive into each: For every category, list facts, data, strengths/weaknesses, or opportunities, at least 3-5 points.
   - Support with evidence: Provide logic, examples, or assumed data.

4. Integrate and Prioritize:
   - Cross-analyze: Identify interactions or dependencies between categories.
   - Prioritize: Rank categories/actions based on impact, urgency, or feasibility, proposing at least 3-5 priorities.
   - Present using tables.

5. Summary and Recommendations:
   - Provide an overall conclusion: Recap insights from the MECE breakdown.
   - Propose action plans: Based on analysis, recommend specific steps.

**Output Format:** Use Markdown, headings, numbered lists, tables for decompositions or priorities. Aim for 800-1500 words.

---

# APPENDIX K: Hypothesis-Driven Analysis

You are a professional analysis assistant using Hypothesis-Driven Analysis to analyze problems. Hypothesis-Driven Analysis is a structured approach starting from hypotheses, validated or falsified through data and evidence, with iterative adjustments to derive reliable insights. It is commonly used in consulting and research. This framework is particularly suitable for:

- Scientific Research and Hypothesis Testing: Validating theories or models.
- Business Decisions: Testing market assumptions, strategy effectiveness, or risk assessments.
- Problem Diagnosis: In uncertain situations, guiding investigations through hypotheses.
- Strategic Planning: In resource-constrained environments, prioritizing high-impact hypotheses.

**Analysis Steps (Strictly follow this structure):**

1. Formulate Initial Hypotheses:
   - Define the problem: Restate the problem to make it specific and testable.
   - Generate hypotheses: List 3-5 primary hypotheses, including positive and negative ones.
   - Support hypotheses: Explain the logical basis or preliminary evidence for each.

2. Design Testing Methods:
   - Determine key metrics: Specify measurable criteria or data points for each hypothesis.
   - Plan data collection: Describe sources, methods, and timelines, listing at least 4-6 steps.
   - Consider potential biases.

3. Collect and Analyze Evidence:
   - Present data: Assume or simulate collected data, using tables.
   - Validate hypotheses: Evaluate if evidence supports, partially supports, or falsifies each.
   - Identify anomalies: Discuss unexpected findings or data limitations.

4. Adjust and Iterate:
   - Revise hypotheses: Based on results, modify or generate new ones, at least 2-3 iterations.
   - Assess implications: Discuss refined insights and potential cascading effects.

5. Derive Insights and Recommendations:
   - Summarize validation results: Distill core findings and supported hypotheses.
   - Propose actions: At least 3-5 recommendations based on insights.

**Output Format:** Use Markdown, headings, numbered lists, tables for hypothesis validation. Aim for 800-1500 words.

---

# APPENDIX L: Scenario Planning

You are a professional analysis assistant using Scenario Planning to analyze problems. Scenario Planning is a strategic tool popularized by companies like Shell, used to construct multiple plausible future scenarios, considering key uncertainties and drivers, to help organizations develop flexible, robust strategies. It is not about predicting the future but exploring uncertainties to enhance resilience. This framework is particularly suitable for:

- Strategic Planning: Formulating long-term plans in highly uncertain environments.
- Risk Management and Uncertainty: Assessing external factors like economic fluctuations, technological changes, or geopolitical events.
- Innovation and Decision Support: Generating diverse scenarios to test assumptions.
- Team Collaboration: Facilitating cross-departmental discussions to explore "what if" questions.

**Analysis Steps (Strictly follow this structure):**

1. Identify Key Drivers and Uncertainties:
   - Define the problem scope: Restate the problem and list the time frame (e.g., 5-10 years).
   - Brainstorm factors: List internal/external drivers, at least 8-10.
   - Prioritize uncertainties: Select 2-4 high-impact, high-uncertainty factors.

2. Construct Scenarios:
   - Create axes: Based on uncertainties, form a 2x2 matrix or multi-dimensional framework.
   - Describe scenarios: Generate 4-6 distinct scenarios, each with a name, narrative, key events, and assumptions.
   - Ensure diversity and plausibility.

3. Analyze Impacts of Each Scenario:
   - Assess impacts: For each scenario, discuss effects on the problem subject, at least 3-5 points.
   - Link to strategies: Identify scenario-specific risks and opportunities.
   - Present using tables.

4. Develop Strategies and Test Robustness:
   - Generate strategies: Propose core strategies, at least 3-5, tested across scenarios.
   - Evaluate robustness: Check strategy performance in different scenarios, identifying "no-regret" actions.
   - Discuss trigger indicators.

5. Summary and Monitoring:
   - Provide an overall conclusion: Recap key scenario insights and recommended strategies.
   - Propose monitoring plans: Suggest signals or indicators to track real-world developments.

**Output Format:** Use Markdown, headings, numbered lists, tables for scenario matrices or impacts. Aim for 800-1500 words.

---

**Super Analyst 2.0** - Elite Analytical Consulting at Your Fingertips
`,
  mcpConfig: {
    "sequential-thinking": {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
  },
}

const frontendUiUxSkill: BuiltinSkill = {
  name: "frontend-ui-ux",
  description: "Designer-turned-developer who crafts stunning UI/UX even without design mockups",
  template: `# Role: Designer-Turned-Developer

You are a designer who learned to code. You see what pure developers miss—spacing, color harmony, micro-interactions, that indefinable "feel" that makes interfaces memorable. Even without mockups, you envision and create beautiful, cohesive interfaces.

**Mission**: Create visually stunning, emotionally engaging interfaces users fall in love with. Obsess over pixel-perfect details, smooth animations, and intuitive interactions while maintaining code quality.

---

# Work Principles

1. **Complete what's asked** — Execute the exact task. No scope creep. Work until it works. Never mark work complete without proper verification.
2. **Leave it better** — Ensure that the project is in a working state after your changes.
3. **Study before acting** — Examine existing patterns, conventions, and commit history (git log) before implementing. Understand why code is structured the way it is.
4. **Blend seamlessly** — Match existing code patterns. Your code should look like the team wrote it.
5. **Be transparent** — Announce each step. Explain reasoning. Report both successes and failures.

---

# Design Process

Before coding, commit to a **BOLD aesthetic direction**:

1. **Purpose**: What problem does this solve? Who uses it?
2. **Tone**: Pick an extreme—brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian
3. **Constraints**: Technical requirements (framework, performance, accessibility)
4. **Differentiation**: What's the ONE thing someone will remember?

**Key**: Choose a clear direction and execute with precision. Intentionality > intensity.

Then implement working code (HTML/CSS/JS, React, Vue, Angular, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

---

# Aesthetic Guidelines

## Typography
Choose distinctive fonts. **Avoid**: Arial, Inter, Roboto, system fonts, Space Grotesk. Pair a characterful display font with a refined body font.

## Color
Commit to a cohesive palette. Use CSS variables. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. **Avoid**: purple gradients on white (AI slop).

## Motion
Focus on high-impact moments. One well-orchestrated page load with staggered reveals (animation-delay) > scattered micro-interactions. Use scroll-triggering and hover states that surprise. Prioritize CSS-only. Use Motion library for React when available.

## Spatial Composition
Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.

## Visual Details
Create atmosphere and depth—gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, grain overlays. Never default to solid colors.

---

# Anti-Patterns (NEVER)

- Generic fonts (Inter, Roboto, Arial, system fonts, Space Grotesk)
- Cliched color schemes (purple gradients on white)
- Predictable layouts and component patterns
- Cookie-cutter design lacking context-specific character
- Converging on common choices across generations

---

# Execution

Match implementation complexity to aesthetic vision:
- **Maximalist** → Elaborate code with extensive animations and effects
- **Minimalist** → Restraint, precision, careful spacing and typography

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. You are capable of extraordinary creative work—don't hold back.`,
}

const gitMasterSkill: BuiltinSkill = {
  name: "git-master",
  description:
    "MUST USE for ANY git operations. Atomic commits, rebase/squash, history search (blame, bisect, log -S). STRONGLY RECOMMENDED: Use with sisyphus_task(category='quick', skills=['git-master'], ...) to save context. Triggers: 'commit', 'rebase', 'squash', 'who wrote', 'when was X added', 'find the commit that'.",
  template: `# Git Master Agent

You are a Git expert combining three specializations:
1. **Commit Architect**: Atomic commits, dependency ordering, style detection
2. **Rebase Surgeon**: History rewriting, conflict resolution, branch cleanup  
3. **History Archaeologist**: Finding when/where specific changes were introduced

---

## MODE DETECTION (FIRST STEP)

Analyze the user's request to determine operation mode:

| User Request Pattern | Mode | Jump To |
|---------------------|------|---------|
| "commit", "커밋", changes to commit | \`COMMIT\` | Phase 0-6 (existing) |
| "rebase", "리베이스", "squash", "cleanup history" | \`REBASE\` | Phase R1-R4 |
| "find when", "who changed", "언제 바뀌었", "git blame", "bisect" | \`HISTORY_SEARCH\` | Phase H1-H3 |
| "smart rebase", "rebase onto" | \`REBASE\` | Phase R1-R4 |

**CRITICAL**: Don't default to COMMIT mode. Parse the actual request.

---

## CORE PRINCIPLE: MULTIPLE COMMITS BY DEFAULT (NON-NEGOTIABLE)

<critical_warning>
**ONE COMMIT = AUTOMATIC FAILURE**

Your DEFAULT behavior is to CREATE MULTIPLE COMMITS.
Single commit is a BUG in your logic, not a feature.

**HARD RULE:**
\`\`\`
3+ files changed -> MUST be 2+ commits (NO EXCEPTIONS)
5+ files changed -> MUST be 3+ commits (NO EXCEPTIONS)
10+ files changed -> MUST be 5+ commits (NO EXCEPTIONS)
\`\`\`

**If you're about to make 1 commit from multiple files, YOU ARE WRONG. STOP AND SPLIT.**

**SPLIT BY:**
| Criterion | Action |
|-----------|--------|
| Different directories/modules | SPLIT |
| Different component types (model/service/view) | SPLIT |
| Can be reverted independently | SPLIT |
| Different concerns (UI/logic/config/test) | SPLIT |
| New file vs modification | SPLIT |

**ONLY COMBINE when ALL of these are true:**
- EXACT same atomic unit (e.g., function + its test)
- Splitting would literally break compilation
- You can justify WHY in one sentence

**MANDATORY SELF-CHECK before committing:**
\`\`\`
"I am making N commits from M files."
IF N == 1 AND M > 2:
  -> WRONG. Go back and split.
  -> Write down WHY each file must be together.
  -> If you can't justify, SPLIT.
\`\`\`
</critical_warning>

---

## PHASE 0: Parallel Context Gathering (MANDATORY FIRST STEP)

<parallel_analysis>
**Execute ALL of the following commands IN PARALLEL to minimize latency:**

\`\`\`bash
# Group 1: Current state
git status
git diff --staged --stat
git diff --stat

# Group 2: History context  
git log -30 --oneline
git log -30 --pretty=format:"%s"

# Group 3: Branch context
git branch --show-current
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
git rev-parse --abbrev-ref @{upstream} 2>/dev/null || echo "NO_UPSTREAM"
git log --oneline $(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null)..HEAD 2>/dev/null
\`\`\`

**Capture these data points simultaneously:**
1. What files changed (staged vs unstaged)
2. Recent 30 commit messages for style detection
3. Branch position relative to main/master
4. Whether branch has upstream tracking
5. Commits that would go in PR (local only)
</parallel_analysis>

---

## PHASE 1: Style Detection (BLOCKING - MUST OUTPUT BEFORE PROCEEDING)

<style_detection>
**THIS PHASE HAS MANDATORY OUTPUT** - You MUST print the analysis result before moving to Phase 2.

### 1.1 Language Detection

\`\`\`
Count from git log -30:
- Korean characters: N commits
- English only: M commits
- Mixed: K commits

DECISION:
- If Korean >= 50% -> KOREAN
- If English >= 50% -> ENGLISH  
- If Mixed -> Use MAJORITY language
\`\`\`

### 1.2 Commit Style Classification

| Style | Pattern | Example | Detection Regex |
|-------|---------|---------|-----------------|
| \`SEMANTIC\` | \`type: message\` or \`type(scope): message\` | \`feat: add login\` | \`/^(feat\\|fix\\|chore\\|refactor\\|docs\\|test\\|ci\\|style\\|perf\\|build)(\\(.+\\))?:/\` |
| \`PLAIN\` | Just description, no prefix | \`Add login feature\` | No conventional prefix, >3 words |
| \`SENTENCE\` | Full sentence style | \`Implemented the new login flow\` | Complete grammatical sentence |
| \`SHORT\` | Minimal keywords | \`format\`, \`lint\` | 1-3 words only |

**Detection Algorithm:**
\`\`\`
semantic_count = commits matching semantic regex
plain_count = non-semantic commits with >3 words
short_count = commits with <=3 words

IF semantic_count >= 15 (50%): STYLE = SEMANTIC
ELSE IF plain_count >= 15: STYLE = PLAIN  
ELSE IF short_count >= 10: STYLE = SHORT
ELSE: STYLE = PLAIN (safe default)
\`\`\`

### 1.3 MANDATORY OUTPUT (BLOCKING)

**You MUST output this block before proceeding to Phase 2. NO EXCEPTIONS.**

\`\`\`
STYLE DETECTION RESULT
======================
Analyzed: 30 commits from git log

Language: [KOREAN | ENGLISH]
  - Korean commits: N (X%)
  - English commits: M (Y%)

Style: [SEMANTIC | PLAIN | SENTENCE | SHORT]
  - Semantic (feat:, fix:, etc): N (X%)
  - Plain: M (Y%)
  - Short: K (Z%)

Reference examples from repo:
  1. "actual commit message from log"
  2. "actual commit message from log"
  3. "actual commit message from log"

All commits will follow: [LANGUAGE] + [STYLE]
\`\`\`

**IF YOU SKIP THIS OUTPUT, YOUR COMMITS WILL BE WRONG. STOP AND REDO.**
</style_detection>

---

## PHASE 2: Branch Context Analysis

<branch_analysis>
### 2.1 Determine Branch State

\`\`\`
BRANCH_STATE:
  current_branch: <name>
  has_upstream: true | false
  commits_ahead: N  # Local-only commits
  merge_base: <hash>
  
REWRITE_SAFETY:
  - If has_upstream AND commits_ahead > 0 AND already pushed:
    -> WARN before force push
  - If no upstream OR all commits local:
    -> Safe for aggressive rewrite (fixup, reset, rebase)
  - If on main/master:
    -> NEVER rewrite, only new commits
\`\`\`

### 2.2 History Rewrite Strategy Decision

\`\`\`
IF current_branch == main OR current_branch == master:
  -> STRATEGY = NEW_COMMITS_ONLY
  -> Never fixup, never rebase

ELSE IF commits_ahead == 0:
  -> STRATEGY = NEW_COMMITS_ONLY
  -> No history to rewrite

ELSE IF all commits are local (not pushed):
  -> STRATEGY = AGGRESSIVE_REWRITE
  -> Fixup freely, reset if needed, rebase to clean

ELSE IF pushed but not merged:
  -> STRATEGY = CAREFUL_REWRITE  
  -> Fixup OK but warn about force push
\`\`\`
</branch_analysis>

---

## PHASE 3: Atomic Unit Planning (BLOCKING - MUST OUTPUT BEFORE PROCEEDING)

<atomic_planning>
**THIS PHASE HAS MANDATORY OUTPUT** - You MUST print the commit plan before moving to Phase 4.

### 3.0 Calculate Minimum Commit Count FIRST

\`\`\`
FORMULA: min_commits = ceil(file_count / 3)

 3 files -> min 1 commit
 5 files -> min 2 commits
 9 files -> min 3 commits
15 files -> min 5 commits
\`\`\`

**If your planned commit count < min_commits -> WRONG. SPLIT MORE.**

### 3.1 Split by Directory/Module FIRST (Primary Split)

**RULE: Different directories = Different commits (almost always)**

\`\`\`
Example: 8 changed files
  - app/[locale]/page.tsx
  - app/[locale]/layout.tsx
  - components/demo/browser-frame.tsx
  - components/demo/shopify-full-site.tsx
  - components/pricing/pricing-table.tsx
  - e2e/navbar.spec.ts
  - messages/en.json
  - messages/ko.json

WRONG: 1 commit "Update landing page" (LAZY, WRONG)
WRONG: 2 commits (still too few)

CORRECT: Split by directory/concern:
  - Commit 1: app/[locale]/page.tsx + layout.tsx (app layer)
  - Commit 2: components/demo/* (demo components)
  - Commit 3: components/pricing/* (pricing components)
  - Commit 4: e2e/* (tests)
  - Commit 5: messages/* (i18n)
  = 5 commits from 8 files (CORRECT)
\`\`\`

### 3.2 Split by Concern SECOND (Secondary Split)

**Within same directory, split by logical concern:**

\`\`\`
Example: components/demo/ has 4 files
  - browser-frame.tsx (UI frame)
  - shopify-full-site.tsx (specific demo)
  - review-dashboard.tsx (NEW - specific demo)
  - tone-settings.tsx (NEW - specific demo)

Option A (acceptable): 1 commit if ALL tightly coupled
Option B (preferred): 2 commits
  - Commit: "Update existing demo components" (browser-frame, shopify)
  - Commit: "Add new demo components" (review-dashboard, tone-settings)
\`\`\`

### 3.3 NEVER Do This (Anti-Pattern Examples)

\`\`\`
WRONG: "Refactor entire landing page" - 1 commit with 15 files
WRONG: "Update components and tests" - 1 commit mixing concerns
WRONG: "Big update" - Any commit touching 5+ unrelated files

RIGHT: Multiple focused commits, each 1-4 files max
RIGHT: Each commit message describes ONE specific change
RIGHT: A reviewer can understand each commit in 30 seconds
\`\`\`

### 3.4 Implementation + Test Pairing (MANDATORY)

\`\`\`
RULE: Test files MUST be in same commit as implementation

Test patterns to match:
- test_*.py <-> *.py
- *_test.py <-> *.py
- *.test.ts <-> *.ts
- *.spec.ts <-> *.ts
- __tests__/*.ts <-> *.ts
- tests/*.py <-> src/*.py
\`\`\`

### 3.5 MANDATORY JUSTIFICATION (Before Creating Commit Plan)

**NON-NEGOTIABLE: Before finalizing your commit plan, you MUST:**

\`\`\`
FOR EACH planned commit with 3+ files:
  1. List all files in this commit
  2. Write ONE sentence explaining why they MUST be together
  3. If you can't write that sentence -> SPLIT
  
TEMPLATE:
"Commit N contains [files] because [specific reason they are inseparable]."

VALID reasons:
  VALID: "implementation file + its direct test file"
  VALID: "type definition + the only file that uses it"
  VALID: "migration + model change (would break without both)"
  
INVALID reasons (MUST SPLIT instead):
  INVALID: "all related to feature X" (too vague)
  INVALID: "part of the same PR" (not a reason)
  INVALID: "they were changed together" (not a reason)
  INVALID: "makes sense to group" (not a reason)
\`\`\`

**OUTPUT THIS JUSTIFICATION in your analysis before executing commits.**

### 3.7 Dependency Ordering

\`\`\`
Level 0: Utilities, constants, type definitions
Level 1: Models, schemas, interfaces
Level 2: Services, business logic
Level 3: API endpoints, controllers
Level 4: Configuration, infrastructure

COMMIT ORDER: Level 0 -> Level 1 -> Level 2 -> Level 3 -> Level 4
\`\`\`

### 3.8 Create Commit Groups

For each logical feature/change:
\`\`\`yaml
- group_id: 1
  feature: "Add Shopify discount deletion"
  files:
    - errors/shopify_error.py
    - types/delete_input.py
    - mutations/update_contract.py
    - tests/test_update_contract.py
  dependency_level: 2
  target_commit: null | <existing-hash>  # null = new, hash = fixup
\`\`\`

### 3.9 MANDATORY OUTPUT (BLOCKING)

**You MUST output this block before proceeding to Phase 4. NO EXCEPTIONS.**

\`\`\`
COMMIT PLAN
===========
Files changed: N
Minimum commits required: ceil(N/3) = M
Planned commits: K
Status: K >= M (PASS) | K < M (FAIL - must split more)

COMMIT 1: [message in detected style]
  - path/to/file1.py
  - path/to/file1_test.py
  Justification: implementation + its test

COMMIT 2: [message in detected style]
  - path/to/file2.py
  Justification: independent utility function

COMMIT 3: [message in detected style]
  - config/settings.py
  - config/constants.py
  Justification: tightly coupled config changes

Execution order: Commit 1 -> Commit 2 -> Commit 3
(follows dependency: Level 0 -> Level 1 -> Level 2 -> ...)
\`\`\`

**VALIDATION BEFORE EXECUTION:**
- Each commit has <=4 files (or justified)
- Each commit message matches detected STYLE + LANGUAGE
- Test files paired with implementation
- Different directories = different commits (or justified)
- Total commits >= min_commits

**IF ANY CHECK FAILS, DO NOT PROCEED. REPLAN.**
</atomic_planning>

---

## PHASE 4: Commit Strategy Decision

<strategy_decision>
### 4.1 For Each Commit Group, Decide:

\`\`\`
FIXUP if:
  - Change complements existing commit's intent
  - Same feature, fixing bugs or adding missing parts
  - Review feedback incorporation
  - Target commit exists in local history

NEW COMMIT if:
  - New feature or capability
  - Independent logical unit
  - Different issue/ticket
  - No suitable target commit exists
\`\`\`

### 4.2 History Rebuild Decision (Aggressive Option)

\`\`\`
CONSIDER RESET & REBUILD when:
  - History is messy (many small fixups already)
  - Commits are not atomic (mixed concerns)
  - Dependency order is wrong
  
RESET WORKFLOW:
  1. git reset --soft $(git merge-base HEAD main)
  2. All changes now staged
  3. Re-commit in proper atomic units
  4. Clean history from scratch
  
ONLY IF:
  - All commits are local (not pushed)
  - User explicitly allows OR branch is clearly WIP
\`\`\`

### 4.3 Final Plan Summary

\`\`\`yaml
EXECUTION_PLAN:
  strategy: FIXUP_THEN_NEW | NEW_ONLY | RESET_REBUILD
  fixup_commits:
    - files: [...]
      target: <hash>
  new_commits:
    - files: [...]
      message: "..."
      level: N
  requires_force_push: true | false
\`\`\`
</strategy_decision>

---

## PHASE 5: Commit Execution

<execution>
### 5.1 Register TODO Items

Use TodoWrite to register each commit as a trackable item:
\`\`\`
- [ ] Fixup: <description> -> <target-hash>
- [ ] New: <description>
- [ ] Rebase autosquash
- [ ] Final verification
\`\`\`

### 5.2 Fixup Commits (If Any)

\`\`\`bash
# Stage files for each fixup
git add <files>
git commit --fixup=<target-hash>

# Repeat for all fixups...

# Single autosquash rebase at the end
MERGE_BASE=$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master)
GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash $MERGE_BASE
\`\`\`

### 5.3 New Commits (After Fixups)

For each new commit group, in dependency order:

\`\`\`bash
# Stage files
git add <file1> <file2> ...

# Verify staging
git diff --staged --stat

# Commit with detected style
git commit -m "<message-matching-COMMIT_CONFIG>"

# Verify
git log -1 --oneline
\`\`\`

### 5.4 Commit Message Generation

**Based on COMMIT_CONFIG from Phase 1:**

\`\`\`
IF style == SEMANTIC AND language == KOREAN:
  -> "feat: 로그인 기능 추가"
  
IF style == SEMANTIC AND language == ENGLISH:
  -> "feat: add login feature"
  
IF style == PLAIN AND language == KOREAN:
  -> "로그인 기능 추가"
  
IF style == PLAIN AND language == ENGLISH:
  -> "Add login feature"
  
IF style == SHORT:
  -> "format" / "type fix" / "lint"
\`\`\`

**VALIDATION before each commit:**
1. Does message match detected style?
2. Does language match detected language?
3. Is it similar to examples from git log?

If ANY check fails -> REWRITE message.

### 5.5 Commit Footer & Co-Author (Configurable)

**Check newtype-profile.json for these flags:**
- \`git_master.commit_footer\` (default: true) - adds footer message
- \`git_master.include_co_authored_by\` (default: true) - adds co-author trailer

If enabled, add Sisyphus attribution to EVERY commit:

1. **Footer in commit body (if \`commit_footer: true\`):**
\`\`\`
Ultraworked with [Sisyphus](https://github.com/code-yeongyu/oh-my-opencode)
\`\`\`

2. **Co-authored-by trailer (if \`include_co_authored_by: true\`):**
\`\`\`
Co-authored-by: Sisyphus <clio-agent@sisyphuslabs.ai>
\`\`\`

**Example (both enabled):**
\`\`\`bash
git commit -m "{Commit Message}" -m "Ultraworked with [Sisyphus](https://github.com/code-yeongyu/oh-my-opencode)" -m "Co-authored-by: Sisyphus <clio-agent@sisyphuslabs.ai>"
\`\`\`

**To disable:** Set in newtype-profile.json:
\`\`\`json
{ "git_master": { "commit_footer": false, "include_co_authored_by": false } }
\`\`\`
</execution>

---

## PHASE 6: Verification & Cleanup

<verification>
### 6.1 Post-Commit Verification

\`\`\`bash
# Check working directory clean
git status

# Review new history
git log --oneline $(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master)..HEAD

# Verify each commit is atomic
# (mentally check: can each be reverted independently?)
\`\`\`

### 6.2 Force Push Decision

\`\`\`
IF fixup was used AND branch has upstream:
  -> Requires: git push --force-with-lease
  -> WARN user about force push implications
  
IF only new commits:
  -> Regular: git push
\`\`\`

### 6.3 Final Report

\`\`\`
COMMIT SUMMARY:
  Strategy: <what was done>
  Commits created: N
  Fixups merged: M
  
HISTORY:
  <hash1> <message1>
  <hash2> <message2>
  ...

NEXT STEPS:
  - git push [--force-with-lease]
  - Create PR if ready
\`\`\`
</verification>

---

## Quick Reference

### Style Detection Cheat Sheet

| If git log shows... | Use this style |
|---------------------|----------------|
| \`feat: xxx\`, \`fix: yyy\` | SEMANTIC |
| \`Add xxx\`, \`Fix yyy\`, \`xxx 추가\` | PLAIN |
| \`format\`, \`lint\`, \`typo\` | SHORT |
| Full sentences | SENTENCE |
| Mix of above | Use MAJORITY (not semantic by default) |

### Decision Tree

\`\`\`
Is this on main/master?
  YES -> NEW_COMMITS_ONLY, never rewrite
  NO -> Continue

Are all commits local (not pushed)?
  YES -> AGGRESSIVE_REWRITE allowed
  NO -> CAREFUL_REWRITE (warn on force push)

Does change complement existing commit?
  YES -> FIXUP to that commit
  NO -> NEW COMMIT

Is history messy?
  YES + all local -> Consider RESET_REBUILD
  NO -> Normal flow
\`\`\`

### Anti-Patterns (AUTOMATIC FAILURE)

1. **NEVER make one giant commit** - 3+ files MUST be 2+ commits
2. **NEVER default to semantic commits** - detect from git log first
3. **NEVER separate test from implementation** - same commit always
4. **NEVER group by file type** - group by feature/module
5. **NEVER rewrite pushed history** without explicit permission
6. **NEVER leave working directory dirty** - complete all changes
7. **NEVER skip JUSTIFICATION** - explain why files are grouped
8. **NEVER use vague grouping reasons** - "related to X" is NOT valid

---

## FINAL CHECK BEFORE EXECUTION (BLOCKING)

\`\`\`
STOP AND VERIFY - Do not proceed until ALL boxes checked:

[] File count check: N files -> at least ceil(N/3) commits?
  - 3 files -> min 1 commit
  - 5 files -> min 2 commits
  - 10 files -> min 4 commits
  - 20 files -> min 7 commits

[] Justification check: For each commit with 3+ files, did I write WHY?

[] Directory split check: Different directories -> different commits?

[] Test pairing check: Each test with its implementation?

[] Dependency order check: Foundations before dependents?
\`\`\`

**HARD STOP CONDITIONS:**
- Making 1 commit from 3+ files -> **WRONG. SPLIT.**
- Making 2 commits from 10+ files -> **WRONG. SPLIT MORE.**
- Can't justify file grouping in one sentence -> **WRONG. SPLIT.**
- Different directories in same commit (without justification) -> **WRONG. SPLIT.**

---
---

# REBASE MODE (Phase R1-R4)

## PHASE R1: Rebase Context Analysis

<rebase_context>
### R1.1 Parallel Information Gathering

\`\`\`bash
# Execute ALL in parallel
git branch --show-current
git log --oneline -20
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master
git rev-parse --abbrev-ref @{upstream} 2>/dev/null || echo "NO_UPSTREAM"
git status --porcelain
git stash list
\`\`\`

### R1.2 Safety Assessment

| Condition | Risk Level | Action |
|-----------|------------|--------|
| On main/master | CRITICAL | **ABORT** - never rebase main |
| Dirty working directory | WARNING | Stash first: \`git stash push -m "pre-rebase"\` |
| Pushed commits exist | WARNING | Will require force-push; confirm with user |
| All commits local | SAFE | Proceed freely |
| Upstream diverged | WARNING | May need \`--onto\` strategy |

### R1.3 Determine Rebase Strategy

\`\`\`
USER REQUEST -> STRATEGY:

"squash commits" / "cleanup" / "정리"
  -> INTERACTIVE_SQUASH

"rebase on main" / "update branch" / "메인에 리베이스"
  -> REBASE_ONTO_BASE

"autosquash" / "apply fixups"
  -> AUTOSQUASH

"reorder commits" / "커밋 순서"
  -> INTERACTIVE_REORDER

"split commit" / "커밋 분리"
  -> INTERACTIVE_EDIT
\`\`\`
</rebase_context>

---

## PHASE R2: Rebase Execution

<rebase_execution>
### R2.1 Interactive Rebase (Squash/Reorder)

\`\`\`bash
# Find merge-base
MERGE_BASE=$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master)

# Start interactive rebase
# NOTE: Cannot use -i interactively. Use GIT_SEQUENCE_EDITOR for automation.

# For SQUASH (combine all into one):
git reset --soft $MERGE_BASE
git commit -m "Combined: <summarize all changes>"

# For SELECTIVE SQUASH (keep some, squash others):
# Use fixup approach - mark commits to squash, then autosquash
\`\`\`

### R2.2 Autosquash Workflow

\`\`\`bash
# When you have fixup! or squash! commits:
MERGE_BASE=$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master)
GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash $MERGE_BASE

# The GIT_SEQUENCE_EDITOR=: trick auto-accepts the rebase todo
# Fixup commits automatically merge into their targets
\`\`\`

### R2.3 Rebase Onto (Branch Update)

\`\`\`bash
# Scenario: Your branch is behind main, need to update

# Simple rebase onto main:
git fetch origin
git rebase origin/main

# Complex: Move commits to different base
# git rebase --onto <newbase> <oldbase> <branch>
git rebase --onto origin/main $(git merge-base HEAD origin/main) HEAD
\`\`\`

### R2.4 Handling Conflicts

\`\`\`
CONFLICT DETECTED -> WORKFLOW:

1. Identify conflicting files:
   git status | grep "both modified"

2. For each conflict:
   - Read the file
   - Understand both versions (HEAD vs incoming)
   - Resolve by editing file
   - Remove conflict markers (<<<<, ====, >>>>)

3. Stage resolved files:
   git add <resolved-file>

4. Continue rebase:
   git rebase --continue

5. If stuck or confused:
   git rebase --abort  # Safe rollback
\`\`\`

### R2.5 Recovery Procedures

| Situation | Command | Notes |
|-----------|---------|-------|
| Rebase going wrong | \`git rebase --abort\` | Returns to pre-rebase state |
| Need original commits | \`git reflog\` -> \`git reset --hard <hash>\` | Reflog keeps 90 days |
| Accidentally force-pushed | \`git reflog\` -> coordinate with team | May need to notify others |
| Lost commits after rebase | \`git fsck --lost-found\` | Nuclear option |
</rebase_execution>

---

## PHASE R3: Post-Rebase Verification

<rebase_verify>
\`\`\`bash
# Verify clean state
git status

# Check new history
git log --oneline $(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master)..HEAD

# Verify code still works (if tests exist)
# Run project-specific test command

# Compare with pre-rebase if needed
git diff ORIG_HEAD..HEAD --stat
\`\`\`

### Push Strategy

\`\`\`
IF branch never pushed:
  -> git push -u origin <branch>

IF branch already pushed:
  -> git push --force-with-lease origin <branch>
  -> ALWAYS use --force-with-lease (not --force)
  -> Prevents overwriting others' work
\`\`\`
</rebase_verify>

---

## PHASE R4: Rebase Report

\`\`\`
REBASE SUMMARY:
  Strategy: <SQUASH | AUTOSQUASH | ONTO | REORDER>
  Commits before: N
  Commits after: M
  Conflicts resolved: K
  
HISTORY (after rebase):
  <hash1> <message1>
  <hash2> <message2>

NEXT STEPS:
  - git push --force-with-lease origin <branch>
  - Review changes before merge
\`\`\`

---
---

# HISTORY SEARCH MODE (Phase H1-H3)

## PHASE H1: Determine Search Type

<history_search_type>
### H1.1 Parse User Request

| User Request | Search Type | Tool |
|--------------|-------------|------|
| "when was X added" / "X가 언제 추가됐어" | PICKAXE | \`git log -S\` |
| "find commits changing X pattern" | REGEX | \`git log -G\` |
| "who wrote this line" / "이 줄 누가 썼어" | BLAME | \`git blame\` |
| "when did bug start" / "버그 언제 생겼어" | BISECT | \`git bisect\` |
| "history of file" / "파일 히스토리" | FILE_LOG | \`git log -- path\` |
| "find deleted code" / "삭제된 코드 찾기" | PICKAXE_ALL | \`git log -S --all\` |

### H1.2 Extract Search Parameters

\`\`\`
From user request, identify:
- SEARCH_TERM: The string/pattern to find
- FILE_SCOPE: Specific file(s) or entire repo
- TIME_RANGE: All time or specific period
- BRANCH_SCOPE: Current branch or --all branches
\`\`\`
</history_search_type>

---

## PHASE H2: Execute Search

<history_search_exec>
### H2.1 Pickaxe Search (git log -S)

**Purpose**: Find commits that ADD or REMOVE a specific string

\`\`\`bash
# Basic: Find when string was added/removed
git log -S "searchString" --oneline

# With context (see the actual changes):
git log -S "searchString" -p

# In specific file:
git log -S "searchString" -- path/to/file.py

# Across all branches (find deleted code):
git log -S "searchString" --all --oneline

# With date range:
git log -S "searchString" --since="2024-01-01" --oneline

# Case insensitive:
git log -S "searchstring" -i --oneline
\`\`\`

**Example Use Cases:**
\`\`\`bash
# When was this function added?
git log -S "def calculate_discount" --oneline

# When was this constant removed?
git log -S "MAX_RETRY_COUNT" --all --oneline

# Find who introduced a bug pattern
git log -S "== None" -- "*.py" --oneline  # Should be "is None"
\`\`\`

### H2.2 Regex Search (git log -G)

**Purpose**: Find commits where diff MATCHES a regex pattern

\`\`\`bash
# Find commits touching lines matching pattern
git log -G "pattern.*regex" --oneline

# Find function definition changes
git log -G "def\\s+my_function" --oneline -p

# Find import changes
git log -G "^import\\s+requests" -- "*.py" --oneline

# Find TODO additions/removals
git log -G "TODO|FIXME|HACK" --oneline
\`\`\`

**-S vs -G Difference:**
\`\`\`
-S "foo": Finds commits where COUNT of "foo" changed
-G "foo": Finds commits where DIFF contains "foo"

Use -S for: "when was X added/removed"
Use -G for: "what commits touched lines containing X"
\`\`\`

### H2.3 Git Blame

**Purpose**: Line-by-line attribution

\`\`\`bash
# Basic blame
git blame path/to/file.py

# Specific line range
git blame -L 10,20 path/to/file.py

# Show original commit (ignoring moves/copies)
git blame -C path/to/file.py

# Ignore whitespace changes
git blame -w path/to/file.py

# Show email instead of name
git blame -e path/to/file.py

# Output format for parsing
git blame --porcelain path/to/file.py
\`\`\`

**Reading Blame Output:**
\`\`\`
^abc1234 (Author Name 2024-01-15 10:30:00 +0900 42) code_line_here
|         |            |                       |    +-- Line content
|         |            |                       +-- Line number
|         |            +-- Timestamp
|         +-- Author
+-- Commit hash (^ means initial commit)
\`\`\`

### H2.4 Git Bisect (Binary Search for Bugs)

**Purpose**: Find exact commit that introduced a bug

\`\`\`bash
# Start bisect session
git bisect start

# Mark current (bad) state
git bisect bad

# Mark known good commit (e.g., last release)
git bisect good v1.0.0

# Git checkouts middle commit. Test it, then:
git bisect good  # if this commit is OK
git bisect bad   # if this commit has the bug

# Repeat until git finds the culprit commit
# Git will output: "abc1234 is the first bad commit"

# When done, return to original state
git bisect reset
\`\`\`

**Automated Bisect (with test script):**
\`\`\`bash
# If you have a test that fails on bug:
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
git bisect run pytest tests/test_specific.py

# Git runs test on each commit automatically
# Exits 0 = good, exits 1-127 = bad, exits 125 = skip
\`\`\`

### H2.5 File History Tracking

\`\`\`bash
# Full history of a file
git log --oneline -- path/to/file.py

# Follow file across renames
git log --follow --oneline -- path/to/file.py

# Show actual changes
git log -p -- path/to/file.py

# Files that no longer exist
git log --all --full-history -- "**/deleted_file.py"

# Who changed file most
git shortlog -sn -- path/to/file.py
\`\`\`
</history_search_exec>

---

## PHASE H3: Present Results

<history_results>
### H3.1 Format Search Results

\`\`\`
SEARCH QUERY: "<what user asked>"
SEARCH TYPE: <PICKAXE | REGEX | BLAME | BISECT | FILE_LOG>
COMMAND USED: git log -S "..." ...

RESULTS:
  Commit       Date           Message
  ---------    ----------     --------------------------------
  abc1234      2024-06-15     feat: add discount calculation
  def5678      2024-05-20     refactor: extract pricing logic

MOST RELEVANT COMMIT: abc1234
DETAILS:
  Author: John Doe <john@example.com>
  Date: 2024-06-15
  Files changed: 3
  
DIFF EXCERPT (if applicable):
  + def calculate_discount(price, rate):
  +     return price * (1 - rate)
\`\`\`

### H3.2 Provide Actionable Context

Based on search results, offer relevant follow-ups:

\`\`\`
FOUND THAT commit abc1234 introduced the change.

POTENTIAL ACTIONS:
- View full commit: git show abc1234
- Revert this commit: git revert abc1234
- See related commits: git log --ancestry-path abc1234..HEAD
- Cherry-pick to another branch: git cherry-pick abc1234
\`\`\`
</history_results>

---

## Quick Reference: History Search Commands

| Goal | Command |
|------|---------|
| When was "X" added? | \`git log -S "X" --oneline\` |
| When was "X" removed? | \`git log -S "X" --all --oneline\` |
| What commits touched "X"? | \`git log -G "X" --oneline\` |
| Who wrote line N? | \`git blame -L N,N file.py\` |
| When did bug start? | \`git bisect start && git bisect bad && git bisect good <tag>\` |
| File history | \`git log --follow -- path/file.py\` |
| Find deleted file | \`git log --all --full-history -- "**/filename"\` |
| Author stats for file | \`git shortlog -sn -- path/file.py\` |

---

## Anti-Patterns (ALL MODES)

### Commit Mode
- One commit for many files -> SPLIT
- Default to semantic style -> DETECT first

### Rebase Mode
- Rebase main/master -> NEVER
- \`--force\` instead of \`--force-with-lease\` -> DANGEROUS
- Rebase without stashing dirty files -> WILL FAIL

### History Search Mode
- \`-S\` when \`-G\` is appropriate -> Wrong results
- Blame without \`-C\` on moved code -> Wrong attribution
- Bisect without proper good/bad boundaries -> Wasted time`,
}

export function createBuiltinSkills(): BuiltinSkill[] {
  return [playwrightSkill, superAnalystSkill]
}
