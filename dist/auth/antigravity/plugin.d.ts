/**
 * Google Antigravity Auth Plugin for OpenCode
 *
 * Provides OAuth authentication for Google models via Antigravity API.
 * This plugin integrates with OpenCode's auth system to enable:
 * - OAuth 2.0 with PKCE flow for Google authentication
 * - Automatic token refresh
 * - Request/response transformation for Antigravity API
 *
 * @example
 * ```json
 * // opencode.json
 * {
 *   "plugin": ["oh-my-opencode"],
 *   "provider": {
 *     "google": {
 *       "options": {
 *         "clientId": "custom-client-id",
 *         "clientSecret": "custom-client-secret"
 *       }
 *     }
 *   }
 * }
 * ```
 */
import type { AuthHook, PluginInput } from "@opencode-ai/plugin";
/**
 * Creates the Google Antigravity OAuth plugin for OpenCode.
 *
 * This factory function creates an auth plugin that:
 * 1. Provides OAuth flow for Google authentication
 * 2. Creates a custom fetch interceptor for Antigravity API
 * 3. Handles token management and refresh
 *
 * @param input - Plugin input containing the OpenCode client
 * @returns Hooks object with auth configuration
 *
 * @example
 * ```typescript
 * // Used by OpenCode automatically when plugin is loaded
 * const hooks = await createGoogleAntigravityAuthPlugin({ client, ... })
 * ```
 */
export declare function createGoogleAntigravityAuthPlugin({ client, }: PluginInput): Promise<{
    auth: AuthHook;
}>;
/**
 * Default export for OpenCode plugin system
 */
export default createGoogleAntigravityAuthPlugin;
/**
 * Named export for explicit imports
 */
export declare const GoogleAntigravityAuthPlugin: typeof createGoogleAntigravityAuthPlugin;
