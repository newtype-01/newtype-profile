export const INIT_SOUL_TEMPLATE = `# /init-soul Command

Create or reset the SOUL.md file that defines Chief's communication style.

## What This Does

1. Creates \`.opencode/SOUL.md\` with default template
2. If file exists, asks user whether to overwrite

## File Location

\`.opencode/SOUL.md\` in current project directory

## Default Template Content

The template defines Chief's "outer persona" - the customizable part of personality:
- Communication style (tone, directness)
- Language preferences (Chinese/English)
- Forbidden phrases (no "Great question!" etc.)
- Discussion engagement style

## Important Notes

- Changes take effect after restarting OpenCode
- SOUL.md only affects Chief, not other agents
- Core capabilities and inner values are NOT customizable
- If you break Chief by editing SOUL.md, just run this command again

## Execution

1. Check if \`.opencode/SOUL.md\` exists
2. If exists: ask user to confirm overwrite
3. If not exists or confirmed: create the file with default template
4. Show success message with instructions
`
