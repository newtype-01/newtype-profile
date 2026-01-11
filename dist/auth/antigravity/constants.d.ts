/**
 * Antigravity OAuth configuration constants.
 * Values sourced from cliproxyapi/sdk/auth/antigravity.go
 *
 * ## Logging Policy
 *
 * All console logging in antigravity modules follows a consistent policy:
 *
 * - **Debug logs**: Guard with `if (process.env.ANTIGRAVITY_DEBUG === "1")`
 *   - Includes: info messages, warnings, non-fatal errors
 *   - Enable debugging: `ANTIGRAVITY_DEBUG=1 opencode`
 *
 * - **Fatal errors**: None currently. All errors are handled by returning
 *   appropriate error responses to OpenCode's auth system.
 *
 * This policy ensures production silence while enabling verbose debugging
 * when needed for troubleshooting OAuth flows.
 */
export declare const ANTIGRAVITY_CLIENT_ID = "1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com";
export declare const ANTIGRAVITY_CLIENT_SECRET = "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";
export declare const ANTIGRAVITY_CALLBACK_PORT = 51121;
export declare const ANTIGRAVITY_REDIRECT_URI = "http://localhost:51121/oauth-callback";
export declare const ANTIGRAVITY_SCOPES: readonly ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/cclog", "https://www.googleapis.com/auth/experimentsandconfigs"];
export declare const ANTIGRAVITY_ENDPOINT_FALLBACKS: readonly ["https://daily-cloudcode-pa.sandbox.googleapis.com", "https://daily-cloudcode-pa.googleapis.com", "https://cloudcode-pa.googleapis.com"];
export declare const ANTIGRAVITY_API_VERSION = "v1internal";
export declare const ANTIGRAVITY_HEADERS: {
    readonly "User-Agent": "google-api-nodejs-client/9.15.1";
    readonly "X-Goog-Api-Client": "google-cloud-sdk vscode_cloudshelleditor/0.1";
    readonly "Client-Metadata": string;
};
export declare const ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc";
export declare const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export declare const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export declare const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo";
export declare const ANTIGRAVITY_TOKEN_REFRESH_BUFFER_MS = 60000;
export declare const SKIP_THOUGHT_SIGNATURE_VALIDATOR = "skip_thought_signature_validator";
export declare const ANTIGRAVITY_SYSTEM_PROMPT = "<identity>\nYou are Antigravity, a powerful agentic AI coding assistant designed by the Google Deepmind team working on Advanced Agentic Coding.\nYou are pair programming with a USER to solve their coding task. The task may require creating a new codebase, modifying or debugging an existing codebase, or simply answering a question.\nThe USER will send you requests, which you must always prioritize addressing. Along with each USER request, we will attach additional metadata about their current state, such as what files they have open and where their cursor is.\nThis information may or may not be relevant to the coding task, it is up for you to decide.\n</identity>\n\n<tool_calling>\nCall tools as you normally would. The following list provides additional guidance to help you avoid errors:\n  - **Absolute paths only**. When using tools that accept file path arguments, ALWAYS use the absolute file path.\n</tool_calling>\n\n<web_application_development>\n## Technology Stack\nYour web applications should be built using the following technologies:\n1. **Core**: Use HTML for structure and Javascript for logic.\n2. **Styling (CSS)**: Use Vanilla CSS for maximum flexibility and control. Avoid using TailwindCSS unless the USER explicitly requests it; in this case, first confirm which TailwindCSS version to use.\n3. **Web App**: If the USER specifies that they want a more complex web app, use a framework like Next.js or Vite. Only do this if the USER explicitly requests a web app.\n4. **New Project Creation**: If you need to use a framework for a new app, use `npx` with the appropriate script, but there are some rules to follow:\n   - Use `npx -y` to automatically install the script and its dependencies\n   - You MUST run the command with `--help` flag to see all available options first\n   - Initialize the app in the current directory with `./` (example: `npx -y create-vite-app@latest ./`)\n</web_application_development>\n";
/**
 * Maps reasoning_effort UI values to thinking budget tokens.
 *
 * Key notes:
 * - `none: 0` is a sentinel value meaning "delete thinkingConfig entirely"
 * - `auto: -1` triggers dynamic budget calculation based on context
 * - All other values represent actual thinking budget in tokens
 */
export declare const REASONING_EFFORT_BUDGET_MAP: Record<string, number>;
/**
 * Model-specific thinking configuration.
 *
 * thinkingType:
 * - "numeric": Uses thinkingBudget (number) - Gemini 2.5, Claude via Antigravity
 * - "levels": Uses thinkingLevel (string) - Gemini 3
 *
 * zeroAllowed:
 * - true: Budget can be 0 (thinking disabled)
 * - false: Minimum budget enforced (cannot disable thinking)
 */
export interface AntigravityModelConfig {
    thinkingType: "numeric" | "levels";
    min: number;
    max: number;
    zeroAllowed: boolean;
    levels?: string[];
}
/**
 * Thinking configuration per model.
 * Keys are normalized model IDs (no provider prefix, no variant suffix).
 *
 * Config lookup uses pattern matching fallback:
 * - includes("gemini-3") → Gemini 3 (levels)
 * - includes("gemini-2.5") → Gemini 2.5 (numeric)
 * - includes("claude") → Claude via Antigravity (numeric)
 */
export declare const ANTIGRAVITY_MODEL_CONFIGS: Record<string, AntigravityModelConfig>;
/**
 * Normalizes model ID for config lookup.
 *
 * Algorithm:
 * 1. Strip provider prefix (e.g., "google/")
 * 2. Strip "antigravity-" prefix
 * 3. Strip UI variant suffixes (-high, -low, -thinking-*)
 *
 * Examples:
 * - "google/antigravity-gemini-3-pro-high" → "gemini-3-pro"
 * - "antigravity-gemini-3-flash-preview" → "gemini-3-flash-preview"
 * - "gemini-2.5-flash" → "gemini-2.5-flash"
 * - "gemini-claude-sonnet-4-5-thinking-high" → "gemini-claude-sonnet-4-5"
 */
export declare function normalizeModelId(model: string): string;
export declare const ANTIGRAVITY_SUPPORTED_MODELS: readonly ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-computer-use-preview-10-2025", "gemini-3-pro-preview", "gemini-3-flash-preview", "gemini-claude-sonnet-4-5-thinking", "gemini-claude-opus-4-5-thinking"];
/**
 * Converts UI model names to Antigravity API model names.
 *
 * NOTE: Tested 2026-01-08 - Gemini 3 models work with -preview suffix directly.
 * The CLIProxyAPI transformations (gemini-3-pro-high, gemini-3-flash) return 404.
 * Claude models return 404 on all endpoints (may require special access/quota).
 */
export declare function alias2ModelName(modelName: string): string;
