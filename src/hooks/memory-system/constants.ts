export const HOOK_NAME = "memory-system"

/** Minimum number of messages to trigger memory save */
export const MIN_MESSAGES_TO_SAVE = 4

/** Memory storage directory relative to project root */
export const MEMORY_DIR = ".opencode/memory"

/** Long-term memory file */
export const MEMORY_FILE = ".opencode/MEMORY.md"

/** Grace period before saving (ms) - allows for quick follow-ups */
export const SAVE_GRACE_PERIOD_MS = 5000

/** Maximum summary length per session (chars) */
export const MAX_SUMMARY_LENGTH = 2000

/** Days after which daily logs are auto-archived to MEMORY.md */
export const ARCHIVE_AFTER_DAYS = 7
