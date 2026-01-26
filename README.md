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

### Installation

#### Method 1: npm Package (Recommended)

Edit `~/.config/opencode/opencode.json`:

```json
{
  "plugin": [
    "newtype-profile"
  ]
}
```

#### Method 2: Clone to Local (Development)

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

Create or edit the newtype-profile config file.

**User-level**: `~/.config/opencode/newtype-profile.json`

**Project-level**: `<project>/.opencode/newtype-profile.json`

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

### Three-Layer Architecture

```
User ↔ Chief (Editor-in-Chief)
           ↓ chief_task
       Deputy (Deputy Editor)
           ↓ chief_task
       Specialist Agents (researcher, writer, editor...)
```

**You only interact with Chief**. Chief automatically coordinates the team:

- **Mode 1 - Thought Partner**: When exploring ideas, Chief thinks WITH you, challenges flawed logic, and sparring.
- **Mode 2 - Execution Coordinator**: When you have clear deliverables, Chief decomposes, delegates, and delivers.

### Example Conversations

```
# Research request - Chief delegates to researcher via Deputy
"Help me understand the AI development trends in 2024"

# Writing request - Chief coordinates writer → editor pipeline
"Write an article about this topic based on our research"

# Fact-checking request - Chief dispatches fact-checker
"Verify the sources in this document"

# Complex task - Chief orchestrates multiple agents
"Create a comprehensive report on [topic] with verified sources"
```

### Task Categories

Chief uses `chief_task` to delegate tasks by category:

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

### MCP Server Configuration

The plugin includes built-in MCP (Model Context Protocol) servers. Configure them in your `newtype-profile.json`:

```json
{
  "mcp": {
    "tavily": {
      "api_key": "tvly-your-api-key"
    },
    "firecrawl": {
      "api_key": "fc-your-api-key"
    },
    "filesystem": {
      "directories": ["~/Documents", "~/Projects"]
    },
    "sequential-thinking": true
  }
}
```

| MCP Server | Default | Required Config | Description |
|------------|---------|-----------------|-------------|
| **websearch** (Exa) | Enabled | None | Web search via Exa.ai |
| **sequential-thinking** | Enabled | None | Structured problem-solving |
| **tavily** | Disabled | `api_key` | Advanced web search, crawl, extract |
| **firecrawl** | Disabled | `api_key` | Web scraping and content extraction |
| **filesystem** | Disabled | `directories` | Local file system access |

Get API keys:
- Tavily: [tavily.com](https://tavily.com)
- Firecrawl: [firecrawl.dev](https://firecrawl.dev)

To disable a built-in MCP:

```json
{
  "disabled_mcps": ["sequential-thinking"]
}
```

### Built-in Skills

The plugin includes specialized skills that can be invoked via `/skill <name>`:

| Skill | Description |
|-------|-------------|
| **playwright** | Browser automation via Playwright MCP - web scraping, testing, screenshots |
| **super-analyst** | Elite analytical consulting system with 12 professional frameworks (First Principles, SWOT, Porter's Five Forces, 5 Whys, MECE, etc.), deep thinking via Sequential Thinking MCP, and comprehensive web research |

**Super Analyst Features:**
- 7-stage systematic workflow (Problem Understanding → Intelligence Planning → Gathering → Framework Selection → Analysis → Output)
- 12 professional analysis frameworks with detailed prompts
- Automatic complexity detection (Level 1/2/3)
- Bilingual search strategy (Chinese/English)
- Sequential Thinking integration for deep reasoning

To disable a built-in skill:

```json
{
  "disabled_skills": ["super-analyst"]
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

## Switch Between Plugins

Use the `/switch` command to switch between OpenCode plugins:

```
/switch newtype    # Switch to newtype-profile
/switch omo        # Switch to oh-my-opencode
/switch none       # Disable all plugins
```

**Note**: After switching, you need to restart OpenCode (Ctrl+C, then `opencode`).

The first time you use `/switch`, it automatically installs itself to `~/.config/opencode/command/switch.md`. This means the command remains available even after switching to other plugins (like oh-my-opencode), allowing you to switch back anytime.

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
