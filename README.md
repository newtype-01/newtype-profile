<p align="right">
  <strong>English</strong> | <a href="./README.zh-cn.md">简体中文</a>
</p>

# newtype-profile

**AI Agent Collaboration System for Content Creation**

Based on [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode), redesigned for content creation scenarios.

---

## Created by huangyihe (黄益贺)

- **YouTube**: [https://www.youtube.com/@huanyihe777](https://www.youtube.com/@huanyihe777)
- **Twitter**: [https://x.com/huangyihe](https://x.com/huangyihe)
- **Substack**: [https://newtype.pro/](https://newtype.pro/)
- **知识星球**: [https://t.zsxq.com/19IaNz5wK](https://t.zsxq.com/19IaNz5wK)

---

## Overview

newtype-profile is an AI Agent collaboration framework designed for **content creation**. Unlike oh-my-opencode which focuses on code programming, this project redefines the Agent system as an editorial team model, suitable for:

- 📚 Knowledge base management
- ✍️ Article writing and editing
- 🔍 Information research and fact-checking
- 📄 Document extraction and organization

## Agent Team

| Agent | Role | Default Model | Description |
|-------|------|---------------|-------------|
| **chief** | Editor-in-Chief | Claude Opus 4.5 Thinking High | Dual-mode: exploration partner + task coordinator |
| **deputy** | Deputy Editor | Claude Sonnet 4.5 | Executes specific delegated tasks |
| **researcher** | Intelligence Officer | Gemini 3 Pro High | Broad search, discover new information |
| **fact-checker** | Verifier | Gemini 3 Pro High | Validate sources, assess credibility |
| **archivist** | Librarian | Claude Sonnet 4.5 | Knowledge base retrieval, find connections |
| **extractor** | Formatter | Gemini 3 Flash | PDF/image/document extraction |
| **writer** | Writer | Gemini 3 Pro High | Content production, article drafting |
| **editor** | Editor | Claude Sonnet 4.5 | Content refinement, structure optimization |

## Quick Start

### Prerequisites

1. Install [OpenCode](https://opencode.ai/docs)
2. Install [Bun](https://bun.sh/) (only needed for local development)

### Installation Methods

OpenCode supports both **user-level** and **project-level** configuration. This allows you to use different plugins for different projects - for example, oh-my-opencode for coding projects and newtype-profile for content creation projects.

#### Configuration Hierarchy

| Level | Path | Priority |
|-------|------|----------|
| **User-level** | `~/.config/opencode/opencode.json` | Lower |
| **Project-level** | `<project>/.opencode/opencode.json` | Higher (overrides user-level) |

---

#### Method 1: User-Level Configuration (Global)

Use this if you want newtype-profile as your default plugin for all projects.

Edit `~/.config/opencode/opencode.json`:

```json
{
  "plugin": [
    "newtype-profile"
  ]
}
```

---

#### Method 2: Project-Level Configuration (Recommended)

Use this to enable newtype-profile only for specific content creation projects, while keeping oh-my-opencode as the default for coding projects.

**Step 1**: Keep oh-my-opencode as user-level default

`~/.config/opencode/opencode.json`:
```json
{
  "plugin": [
    "oh-my-opencode"
  ]
}
```

**Step 2**: Enable newtype-profile for content creation projects

In your content creation project root, create `.opencode/opencode.json`:

```bash
mkdir -p .opencode
```

`<project>/.opencode/opencode.json`:
```json
{
  "plugin": [
    "newtype-profile"
  ]
}
```

**Result**:

| Project Type | Config Source | Plugin Used |
|--------------|---------------|-------------|
| Coding projects (no `.opencode/`) | User-level config | oh-my-opencode |
| Content creation projects (has `.opencode/`) | Project-level config | newtype-profile |

---

#### Method 3: Clone to Local (Development)

For development or customization:

```bash
git clone https://github.com/newtype-01/newtype-profile.git
cd newtype-profile
bun install
bun run build
```

Then reference the local path in your config:

```json
{
  "plugin": [
    "/path/to/newtype-profile"
  ]
}
```

### Configure Agent Models

Create or edit the oh-my-opencode config file.

**User-level**: `~/.config/opencode/oh-my-opencode.json`

**Project-level**: `<project>/.opencode/oh-my-opencode.json`

```json
{
  "google_auth": true,
  "agents": {
    "chief": { "model": "google/antigravity-claude-opus-4-5-thinking-high" },
    "researcher": { "model": "google/antigravity-gemini-3-pro-high" },
    "fact-checker": { "model": "google/antigravity-gemini-3-pro-high" },
    "archivist": { "model": "google/antigravity-claude-sonnet-4-5" },
    "extractor": { "model": "google/antigravity-gemini-3-flash" },
    "writer": { "model": "google/antigravity-gemini-3-pro-high" },
    "editor": { "model": "google/antigravity-claude-sonnet-4-5" }
  }
}
```

### Authenticate Google Antigravity

```bash
opencode auth login
# Select Provider: Google
# Select Login method: OAuth with Google (Antigravity)
```

## Usage

### Start OpenCode

```bash
opencode
```

### Invoke Agents

The Chief (editor-in-chief) will automatically coordinate team work. You can also specify agents directly:

```
# Have the researcher investigate a topic
@researcher Research the trends in AI development for 2024

# Have the fact-checker verify information
@fact-checker Verify the source of this claim

# Have the writer draft an article
@writer Write an overview based on these materials

# Have the editor polish the content
@editor Help me refine this paragraph
```

### Task Categories

Use `chief_task` tool to delegate tasks by category:

| Category | Purpose | Model Configuration |
|----------|---------|---------------------|
| `research` | Information research, trend discovery | Gemini 3 Pro High, temp 0.5 |
| `fact-check` | Source verification, credibility assessment | Gemini 3 Pro High, temp 0.2 |
| `archive` | Knowledge base retrieval, document linking | Claude Sonnet 4.5, temp 0.3 |
| `writing` | Content creation, article drafting | Gemini 3 Pro High, temp 0.7 |
| `editing` | Content refinement, structure optimization | Claude Sonnet 4.5, temp 0.3 |
| `extraction` | PDF/image content extraction | Gemini 3 Flash, temp 0.2 |
| `quick` | Simple quick tasks | Gemini 3 Flash, temp 0.3 |

## Configuration

### Model Selection

All models are accessed via Google Antigravity. Available models:

**Gemini Series**
- `google/antigravity-gemini-3-pro-high` - High quota Pro version
- `google/antigravity-gemini-3-pro-low` - Low quota Pro version
- `google/antigravity-gemini-3-flash` - Fast response version

**Claude Series (via Antigravity)**
- `google/antigravity-claude-opus-4-5-thinking-high` - High thinking budget Opus
- `google/antigravity-claude-opus-4-5-thinking-medium` - Medium thinking budget Opus
- `google/antigravity-claude-opus-4-5-thinking-low` - Low thinking budget Opus
- `google/antigravity-claude-sonnet-4-5` - Sonnet 4.5
- `google/antigravity-claude-sonnet-4-5-thinking-high` - High thinking budget Sonnet

### Custom Agent Settings

Override default settings in your config file:

```json
{
  "agents": {
    "writer": {
      "model": "google/antigravity-claude-sonnet-4-5",
      "temperature": 0.8,
      "prompt_append": "Please use a concise and lively writing style"
    }
  }
}
```

### Disable Specific Agents

```json
{
  "disabled_agents": ["fact-checker", "extractor"]
}
```

### Disable Specific Hooks

```json
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

## Features Inherited from oh-my-opencode

This project retains core capabilities from oh-my-opencode:

- ✅ **Background Tasks**: Run multiple agents in parallel
- ✅ **Todo Enforcement**: Ensure task completion
- ✅ **Session Recovery**: Automatic error recovery
- ✅ **Claude Code Compatibility Layer**: Support for hooks, skills, commands
- ✅ **LSP Tools**: Code navigation and refactoring
- ✅ **AST-Grep**: Code pattern search
- ✅ **MCP Support**: Extended capabilities

## Differences from oh-my-opencode

| Aspect | oh-my-opencode | newtype-profile |
|--------|----------------|-----------------|
| Scenario | Code programming | Content creation |
| Main Agent | Sisyphus | Chief (Editor-in-Chief) |
| Sub Agents | oracle, librarian, explore... | researcher, writer, editor... |
| Categories | visual-engineering, ultrabrain... | research, writing, editing... |
| Tool | sisyphus_task | chief_task |

## License

This project is based on [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) and follows its [SUL-1.0 License](https://github.com/code-yeongyu/oh-my-opencode/blob/master/LICENSE.md).

## Acknowledgments

- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) - Original project
- [OpenCode](https://opencode.ai) - AI programming platform
- [Google Antigravity](https://github.com/NoeFabris/opencode-antigravity-auth) - Model authentication
