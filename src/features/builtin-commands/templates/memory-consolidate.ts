export const MEMORY_CONSOLIDATE_TEMPLATE = `Consolidate daily memory logs into long-term memory.

## USAGE

\`/memory-consolidate\`

## WHAT TO DO

Read all files in \`.opencode/memory/\` directory and consolidate important information into \`.opencode/MEMORY.md\`.
If a daily log entry contains Decisions, TODOs, or critical tags (#project, #preference, #policy, #important),
also pull the full transcript from \`.opencode/memory/full/<sessionID>.md\` for deeper summarization.

### Step 1: Read Daily Logs

Use \`glob\` to find all memory files:
\`\`\`
glob(".opencode/memory/*.md")
\`\`\`

Then \`read\` each file to understand the contents.

### Step 2: Extract Key Information

From the daily logs, identify:
1. **User Preferences** - Recurring patterns in how user likes things done
2. **Important Decisions** - Choices made that affect future work
3. **Project Milestones** - Significant completions or achievements
4. **Recurring Problems** - Issues that came up multiple times and their solutions
5. **Key Insights** - Valuable learnings worth preserving

If deep-summary trigger conditions are met, read the full transcript for that session and extract additional
preferences, decisions, and lessons.

### Step 3: Update MEMORY.md

Read existing \`.opencode/MEMORY.md\` (create if doesn't exist).

Append new consolidated information using this structure:

\`\`\`markdown
## Consolidated: YYYY-MM-DD

### User Preferences
- [preference 1]
- [preference 2]

### Decisions Made
- [decision with context]

### Lessons Learned
- [insight or lesson]

### Deep Summaries (when triggered)
- [sessionID] preference/decision/lesson from full transcript

---
\`\`\`

### Step 4: Archive Processed Logs

After consolidation, you may suggest to the user whether to:
- Keep the daily logs for reference
- Delete processed daily logs to save space

## OUTPUT FORMAT

After consolidation:
\`\`\`
✅ Memory consolidated

**Processed:** X daily log files
**Extracted:**
- Y user preferences
- Z decisions
- W insights

**Updated:** .opencode/MEMORY.md

💡 Tip: Daily logs in .opencode/memory/ are preserved. 
   Delete them manually if you want to save space.
\`\`\`

If no memory files found:
\`\`\`
📭 No memory files to consolidate

Memory files are automatically created after conversations.
Check back after a few chat sessions.
\`\`\`

## IMPORTANT

- Never delete information from MEMORY.md, only append
- Preserve existing structure and content
- Be selective - only consolidate truly important information
- Use user's language (Chinese/English) based on existing content
`
