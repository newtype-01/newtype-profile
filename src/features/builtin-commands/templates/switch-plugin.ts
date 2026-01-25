export const SWITCH_PLUGIN_TEMPLATE = `Switch OpenCode plugin configuration.

## USAGE

\`/switch <plugin-name>\`

**Available presets:**
- \`newtype\` - Switch to newtype-profile (this plugin)
- \`omo\` - Switch to oh-my-opencode
- \`none\` - Disable all plugins

**Arguments:**
$ARGUMENTS

## WHAT TO DO

You must complete TWO tasks:

### Task 1: Install /switch command to user config (for persistence)

This ensures the /switch command remains available even after switching to other plugins.

\`\`\`bash
mkdir -p ~/.config/opencode/command
\`\`\`

Then create \`~/.config/opencode/command/switch.md\` with this content:

\`\`\`markdown
---
description: "Switch OpenCode plugin (newtype/omo/none)"
argument-hint: "<newtype|omo|none>"
---

# Switch Plugin Command

Switch between OpenCode plugins by modifying ~/.config/opencode/opencode.json

## Usage

/switch <preset>

**Presets:**
- newtype - Switch to newtype-profile
- omo - Switch to oh-my-opencode  
- none - Disable all plugins

## Instructions

1. Parse the argument to determine preset:
   - "newtype" or "newtype-profile" → ["newtype-profile"]
   - "omo" or "oh-my-opencode" → ["oh-my-opencode"]
   - "none" or "disable" or "off" → []

2. Read ~/.config/opencode/opencode.json

3. Update the "plugin" field with the new value

4. Write back to the file (preserve all other fields)

5. Tell user to restart OpenCode (Ctrl+C, then \\\`opencode\\\`)

## Implementation

Use node inline script:
\\\`\\\`\\\`bash
node -e "
const fs = require('fs');
const os = require('os');
const configPath = os.homedir() + '/.config/opencode/opencode.json';
let config = {};
try { config = JSON.parse(fs.readFileSync(configPath, 'utf-8')); } catch {}
config.plugin = ['PLUGIN_VALUE'];  // Replace with actual value
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Plugin switched. Restart OpenCode to apply.');
"
\\\`\\\`\\\`
\`\`\`

### Task 2: Switch the plugin

1. **Parse the argument** to determine which plugin preset to use:
   - "newtype" or "newtype-profile" → ["newtype-profile"]
   - "omo" or "oh-my-opencode" → ["oh-my-opencode"]
   - "none" or "disable" or "off" → []

2. **Read current config** at \`~/.config/opencode/opencode.json\`

3. **Update the plugin field** in the config JSON

4. **Write the updated config** back to the file

5. **Inform the user** that they need to restart OpenCode

## IMPLEMENTATION

Use node/bun inline script (works on all platforms):

\`\`\`bash
# For newtype-profile
node -e "
const fs = require('fs');
const os = require('os');
const configPath = os.homedir() + '/.config/opencode/opencode.json';
let config = {};
try { config = JSON.parse(fs.readFileSync(configPath, 'utf-8')); } catch {}
config.plugin = ['newtype-profile'];
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Plugin switched to: newtype-profile');
"

# For oh-my-opencode
node -e "
const fs = require('fs');
const os = require('os');
const configPath = os.homedir() + '/.config/opencode/opencode.json';
let config = {};
try { config = JSON.parse(fs.readFileSync(configPath, 'utf-8')); } catch {}
config.plugin = ['oh-my-opencode'];
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Plugin switched to: oh-my-opencode');
"

# For none
node -e "
const fs = require('fs');
const os = require('os');
const configPath = os.homedir() + '/.config/opencode/opencode.json';
let config = {};
try { config = JSON.parse(fs.readFileSync(configPath, 'utf-8')); } catch {}
config.plugin = [];
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Plugin disabled');
"
\`\`\`

## OUTPUT FORMAT

After successful switch:
\`\`\`
✅ /switch command installed to ~/.config/opencode/command/switch.md
✅ Plugin switched to: {plugin-name}

⚠️  Please restart OpenCode for changes to take effect:
    1. Press Ctrl+C to exit
    2. Run \`opencode\` to start again
\`\`\`

If argument is invalid:
\`\`\`
❌ Unknown plugin: {argument}

Available options:
  - newtype (newtype-profile)
  - omo (oh-my-opencode)
  - none (disable plugins)

Usage: /switch <plugin-name>
\`\`\`

## IMPORTANT

- OpenCode does NOT support hot-reloading plugins
- The user MUST restart OpenCode after switching
- Always preserve other fields in opencode.json (model, auth, etc.)
- Installing switch.md to user config ensures the command works with ANY plugin
`
