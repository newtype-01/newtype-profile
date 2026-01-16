# Multi-Agent Framework Optimizations

**Created**: 2026-01-16
**Status**: Planning
**Priority**: High

---

## Overview

Optimization opportunities identified for the newtype-profile multi-agent framework, focusing on confidence routing, workflow orchestration, and agent coordination.

---

## Phase 1: Immediate (High Priority)

### 1.1 Per-Agent Rewrite Tracking

**Status**: [x] Completed (2026-01-16)

**Problem**: Rewrite attempts are tracked globally per session. If researcher fails 2 times, writer will also be escalated even though it hasn't been tried.

**Current Implementation** (`confidence-router.ts`):
```typescript
const rewriteAttempts = new Map<string, number>()  // session -> count
```

**Proposed Solution**:
```typescript
// session -> (agentType -> count)
const rewriteAttempts = new Map<string, Map<AgentType, number>>()

export function getRewriteAttempts(sessionId: string, agentType: AgentType): number {
  return rewriteAttempts.get(sessionId)?.get(agentType) ?? 0
}

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
```

**Files to Modify**:
- `src/hooks/chief-orchestrator/confidence-router.ts`
- `src/hooks/chief-orchestrator/confidence-router.test.ts`

**Effort**: 2 hours
**Impact**: High - prevents cross-agent contamination of retry limits

---

### 1.2 Configurable Confidence Thresholds

**Status**: [ ] Not Started

**Problem**: 0.8/0.5 thresholds are hardcoded. Different content types need different standards.

**Current Implementation**:
```typescript
export function getRecommendation(confidence: number): "pass" | "polish" | "rewrite" {
  if (confidence >= 0.8) return "pass"
  if (confidence >= 0.5) return "polish"
  return "rewrite"
}
```

**Proposed Configuration** (`oh-my-opencode.json`):
```json
{
  "confidence": {
    "default": {
      "pass": 0.8,
      "polish": 0.5
    },
    "by_category": {
      "fact-check": { "pass": 0.9, "polish": 0.7 },
      "research": { "pass": 0.75, "polish": 0.5 },
      "writing": { "pass": 0.7, "polish": 0.4 },
      "editing": { "pass": 0.8, "polish": 0.6 }
    }
  }
}
```

**Files to Modify**:
- `src/config/schema.ts` - Add ConfidenceConfig type
- `src/hooks/chief-orchestrator/confidence-router.ts` - Accept config param
- `src/hooks/chief-orchestrator/index.ts` - Pass config from plugin context

**Effort**: 3 hours
**Impact**: High - enables fine-tuning per content type

---

### 1.3 Add Confidence Scoring to Archivist & Extractor

**Status**: [ ] Not Started

**Problem**: Only 4 agents have confidence scoring (fact-checker, researcher, writer, editor). Archivist and extractor lack self-assessment.

**Proposed Additions**:

| Agent | Score Meaning | Criteria |
|-------|---------------|----------|
| archivist | Retrieval completeness | Found sources / expected sources, relevance match |
| extractor | Extraction accuracy | Structure quality, data completeness, format correctness |

**Files to Modify**:
- `src/agents/archivist.ts` - Add `<Confidence_Score>` section
- `src/agents/extractor.ts` - Add `<Confidence_Score>` section
- `src/hooks/chief-orchestrator/confidence-router.ts` - Extend AgentType

**Effort**: 2 hours
**Impact**: Medium - completes the confidence routing coverage

---

## Phase 2: Near-term (Medium Priority)

### 2.1 Workflow State Machine

**Status**: [ ] Not Started

**Problem**: Chief manually orchestrates every step. Common workflows are predictable.

**Proposed Solution**:
```typescript
interface WorkflowStep {
  agent: AgentType
  minConfidence: number
  onPass: string  // next step or "DONE"
  onPolish: "retry" | "escalate"
  onRewrite: "restart" | "escalate"
  maxRetries: number
}

interface Workflow {
  name: string
  steps: WorkflowStep[]
  onComplete: "deliver" | "review"
}

const CONTENT_PIPELINE: Workflow = {
  name: "content-pipeline",
  steps: [
    { agent: "researcher", minConfidence: 0.7, onPass: "writer", onPolish: "retry", onRewrite: "restart", maxRetries: 2 },
    { agent: "writer", minConfidence: 0.6, onPass: "editor", onPolish: "retry", onRewrite: "restart", maxRetries: 2 },
    { agent: "editor", minConfidence: 0.7, onPass: "fact-checker", onPolish: "retry", onRewrite: "writer", maxRetries: 2 },
    { agent: "fact-checker", minConfidence: 0.8, onPass: "DONE", onPolish: "editor", onRewrite: "writer", maxRetries: 2 },
  ],
  onComplete: "deliver",
}
```

**Usage**:
```
chief_task(workflow="content-pipeline", prompt="Write an article about...")
```

**Files to Create**:
- `src/features/workflow-engine/types.ts`
- `src/features/workflow-engine/executor.ts`
- `src/features/workflow-engine/builtin-workflows.ts`

**Effort**: 8 hours
**Impact**: High - automates common patterns, reduces Chief cognitive load

---

### 2.2 Agent Handoff Context

**Status**: [ ] Not Started

**Problem**: Agents work independently. Handoffs lose context about previous decisions.

**Proposed Solution**:
```typescript
interface AgentHandoff {
  previousAgent: AgentType
  previousConfidence: number
  attemptNumber: number
  issuesIdentified: string[]      // Problems found by previous agent
  contextCarryover: string        // Key context to preserve
  workflowPosition: string        // Where in pipeline
}

// Injected into next agent's prompt
function buildHandoffContext(handoff: AgentHandoff): string {
  return `
<Previous_Agent_Context>
Agent: ${handoff.previousAgent}
Confidence: ${handoff.previousConfidence}
Attempt: ${handoff.attemptNumber}
Issues to Address:
${handoff.issuesIdentified.map(i => `- ${i}`).join('\n')}
</Previous_Agent_Context>
`
}
```

**Effort**: 4 hours
**Impact**: Medium - improves iteration quality

---

### 2.3 Parallel Agent Dispatch Pattern

**Status**: [ ] Not Started

**Problem**: Chief prompt mentions "parallel when possible" but no enforcement.

**Proposed Solution**:
```typescript
const AGENT_PARALLELISM = {
  parallelSafe: ["researcher", "archivist", "extractor"],  // Can run simultaneously
  sequential: ["writer", "editor", "fact-checker"],         // Must run in order
  conflicts: [
    ["writer", "editor"],  // Same content, different stages
  ],
}

// Chief directive injection
function getParallelismDirective(agents: AgentType[]): string {
  const safe = agents.filter(a => AGENT_PARALLELISM.parallelSafe.includes(a))
  const seq = agents.filter(a => AGENT_PARALLELISM.sequential.includes(a))
  
  if (safe.length > 1) {
    return `[PARALLEL OK] ${safe.join(', ')} can run simultaneously.`
  }
  if (seq.length > 1) {
    return `[SEQUENTIAL REQUIRED] ${seq.join(' → ')} must run in order.`
  }
  return ''
}
```

**Effort**: 3 hours
**Impact**: Medium - prevents wasted parallel attempts

---

## Phase 3: Long-term (Nice to Have)

### 3.1 Agent Performance Tracking

**Status**: [ ] Not Started

**Problem**: No visibility into agent effectiveness over time.

**Proposed Solution**:
```typescript
interface AgentStats {
  totalTasks: number
  avgConfidence: number
  firstPassRate: number      // % passed on first attempt
  avgRewriteCount: number
  avgDuration: number        // seconds
  lastUpdated: Date
}

// Stored in ~/.config/opencode/agent-stats.json
interface AgentStatsStore {
  [agentType: string]: AgentStats
}
```

**Use Cases**:
- Identify bottleneck agents
- Justify model upgrades
- A/B test prompt changes

**Effort**: 6 hours
**Impact**: Medium - enables data-driven optimization

---

### 3.2 Smart Routing Based on Task Complexity

**Status**: [ ] Not Started

**Problem**: All tasks use the same model tier regardless of difficulty.

**Proposed Solution**:
```typescript
interface ComplexitySignals {
  wordCount: number
  technicalTerms: string[]
  sourceRequirements: number
  formatComplexity: "simple" | "structured" | "complex"
}

function estimateComplexity(prompt: string): "low" | "medium" | "high" {
  const signals = extractComplexitySignals(prompt)
  // Weighted scoring
  return calculateComplexity(signals)
}

// Dynamic model selection
function selectModel(agentType: AgentType, complexity: "low" | "medium" | "high") {
  const modelTiers = {
    low: "gemini-3-flash",
    medium: "gemini-3-pro",
    high: "claude-opus-4-5",
  }
  return modelTiers[complexity]
}
```

**Effort**: 6 hours
**Impact**: Medium - cost optimization without quality loss

---

### 3.3 Agent Capability Tags

**Status**: [ ] Not Started

**Problem**: Chief must know all agent capabilities implicitly.

**Proposed Solution**:
```typescript
interface AgentCapabilities {
  can: string[]
  cannot: string[]
  bestFor: string[]
  requiresTools: string[]
}

const AGENT_CAPABILITIES: Record<string, AgentCapabilities> = {
  researcher: {
    can: ["web-search", "source-verification", "trend-analysis", "competitive-analysis"],
    cannot: ["content-creation", "formatting", "editing"],
    bestFor: ["external-info", "market-research", "fact-finding"],
    requiresTools: ["websearch", "webfetch"],
  },
  writer: {
    can: ["content-creation", "structuring", "tone-adaptation", "summarization"],
    cannot: ["fact-verification", "source-finding", "web-search"],
    bestFor: ["articles", "summaries", "explanations", "narratives"],
    requiresTools: [],
  },
  // ... other agents
}

// Inject into Chief prompt
function buildCapabilitiesReference(): string {
  return Object.entries(AGENT_CAPABILITIES)
    .map(([agent, caps]) => `**${agent}**: ${caps.bestFor.join(', ')}`)
    .join('\n')
}
```

**Effort**: 4 hours
**Impact**: Low - improves Chief decision quality

---

## Implementation Priority Matrix

| Item | Effort | Impact | Priority | Dependency |
|------|--------|--------|----------|------------|
| 1.1 Per-Agent Rewrite | 2h | High | **P0** | None |
| 1.2 Config Thresholds | 3h | High | **P0** | None |
| 1.3 Archivist/Extractor | 2h | Medium | **P1** | 1.2 |
| 2.1 Workflow Engine | 8h | High | **P1** | 1.1, 1.2 |
| 2.2 Handoff Context | 4h | Medium | **P2** | 2.1 |
| 2.3 Parallel Pattern | 3h | Medium | **P2** | None |
| 3.1 Performance Track | 6h | Medium | **P3** | None |
| 3.2 Smart Routing | 6h | Medium | **P3** | 3.1 |
| 3.3 Capability Tags | 4h | Low | **P3** | None |

---

## Related Files

### Core Confidence Routing
- `src/hooks/chief-orchestrator/confidence-router.ts`
- `src/hooks/chief-orchestrator/confidence-router.test.ts`
- `src/hooks/chief-orchestrator/index.ts`

### Agent Definitions
- `src/agents/chief.ts`
- `src/agents/researcher.ts`
- `src/agents/writer.ts`
- `src/agents/editor.ts`
- `src/agents/fact-checker.ts`
- `src/agents/archivist.ts`
- `src/agents/extractor.ts`

### Task Delegation
- `src/tools/chief-task/tools.ts`
- `src/tools/chief-task/types.ts`
- `src/tools/chief-task/constants.ts`

### Configuration
- `src/config/schema.ts`

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-16 | Initial plan created |
| 2026-01-16 | Completed 1.1 Per-Agent Rewrite Tracking |

