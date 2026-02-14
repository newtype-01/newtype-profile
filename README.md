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

newtype-profile is an AI Agent collaboration framework designed for **content creation**:

- 📚 Knowledge base management
- ✍️ Article writing and editing
- 🔍 Information research and fact-checking
- 📄 Document extraction and organization

## Agent Team

| Agent | Role | Description |
|-------|------|-------------|
| **chief** | Editor-in-Chief | Dual-mode: exploration partner + task coordinator |
| **deputy** | Deputy Editor | Executes delegated tasks |
| **researcher** | Intelligence | Broad search, discover new information |
| **fact-checker** | Verifier | Validate sources, assess credibility |
| **archivist** | Librarian | Knowledge base retrieval |
| **extractor** | Formatter | PDF/image/document extraction |
| **writer** | Writer | Content production |
| **editor** | Editor | Content refinement |

## Quick Start

### Installation

```bash
cd ~/.config/opencode
bun add newtype-profile
```

Edit `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["newtype-profile"]
}
```

### Configure Models

Create `~/.config/opencode/newtype-profile.json`:

```json
{
  "google_auth": true,
  "agents": {
    "chief": { "model": "google/antigravity-claude-opus-4-5-thinking-high" },
    "researcher": { "model": "google/antigravity-gemini-3-pro-high" },
    "writer": { "model": "google/antigravity-gemini-3-pro-high" },
    "editor": { "model": "google/antigravity-claude-sonnet-4-5" }
  }
}
```

### Authenticate

```bash
opencode auth login
# Select Provider: Google
# Select Login method: OAuth with Google (Antigravity)
```

## Usage

### Three-Layer Architecture

```
User ↔ Chief (Editor-in-Chief)
           ↓ chief_task
       Deputy (Deputy Editor)
           ↓ chief_task
       Specialist Agents (researcher, writer, editor...)
```

**You only interact with Chief**:

- **Mode 1 - Thought Partner**: Chief thinks WITH you, challenges flawed logic
- **Mode 2 - Execution Coordinator**: Chief decomposes, delegates, and delivers

### Example Conversations

```
"Help me understand the AI development trends in 2024"
"Write an article about this topic based on our research"
"Verify the sources in this document"
```

## Customization

### SOUL.md - Customize Chief's Personality (v1.0.60+)

Chief's personality has three layers:
- **Capabilities** (hardcoded): What Chief can do
- **Inner Persona** (hardcoded): Core values and thinking patterns
- **Outer Persona** (customizable): Communication style

Create `.opencode/SOUL.md` to customize how Chief communicates:

```bash
/init-soul  # Creates default SOUL.md template
```

Example customizations:
- Make Chief more formal or casual
- Adjust language preferences
- Change how direct Chief is

Changes take effect after restarting OpenCode.

### Built-in Skills

| Skill | Command | Description |
|-------|---------|-------------|
| **super-analyst** | `/super-analyst` | 12 analysis frameworks + research methodology |
| **super-writer** | `/super-writer` | 6 writing methodologies (W.R.I.T.E, AIDA, etc.) |
| **super-fact-checker** | `/super-fact-checker` | Claim verification with source credibility |
| **super-editor** | `/super-editor` | 4-layer editing: structure → paragraph → sentence → word |
| **super-interviewer** | `/super-interviewer` | Dialogue techniques for exploration |
| **playwright** | `/playwright` | Browser automation |

Chief auto-loads skills when tasks need structured frameworks.

### MCP Servers

Built-in MCPs:

| MCP | Default | Config |
|-----|---------|--------|
| **websearch** (Exa) | Enabled | None |
| **sequential-thinking** | Enabled | None |
| **tavily** | Disabled | `api_key` |
| **firecrawl** | Disabled | `api_key` |

### Disable Features

```json
{
  "disabled_agents": ["fact-checker"],
  "disabled_skills": ["super-analyst"],
  "disabled_hooks": ["memory-system"],
  "disabled_mcps": ["sequential-thinking"]
}
```

## Memory System

Auto-saves conversation summaries to `.opencode/memory/`:
- Daily summaries (LLM-generated)
- Full transcripts per session
- Auto-archive to `MEMORY.md` after 7 days

Use `/memory-consolidate` to manually trigger consolidation.

## Other Features

- **Background Tasks**: Run multiple agents in parallel
- **Session Recovery**: Auto-recover from errors
- **Startup Config Checker**: Guides model setup on first run
- **Plugin Switching**: `/switch newtype` / `/switch omo` / `/switch none`

## License

Based on [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode), follows [SUL-1.0 License](https://github.com/code-yeongyu/oh-my-opencode/blob/master/LICENSE.md).
