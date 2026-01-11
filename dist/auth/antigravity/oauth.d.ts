import type { AntigravityTokenExchangeResult, AntigravityUserInfo } from "./types";
/**
 * Result from building an OAuth authorization URL.
 */
export interface AuthorizationResult {
    /** Full OAuth URL to open in browser */
    url: string;
    /** State for CSRF protection */
    state: string;
}
/**
 * Result from the OAuth callback server.
 */
export interface CallbackResult {
    /** Authorization code from Google */
    code: string;
    /** State parameter from callback */
    state: string;
    /** Error message if any */
    error?: string;
}
export declare function buildAuthURL(projectId?: string, clientId?: string, port?: number): Promise<AuthorizationResult>;
/**
 * Exchange authorization code for tokens.
 *
 * @param code - Authorization code from OAuth callback
 * @param redirectUri - OAuth redirect URI
 * @param clientId - Optional custom client ID (defaults to ANTIGRAVITY_CLIENT_ID)
 * @param clientSecret - Optional custom client secret (defaults to ANTIGRAVITY_CLIENT_SECRET)
 * @returns Token exchange result with access and refresh tokens
 */
export declare function exchangeCode(code: string, redirectUri: string, clientId?: string, clientSecret?: string): Promise<AntigravityTokenExchangeResult>;
/**
 * Fetch user info from Google's userinfo API.
 *
 * @param accessToken - Valid access token
 * @returns User info containing email
 */
export declare function fetchUserInfo(accessToken: string): Promise<AntigravityUserInfo>;
export interface CallbackServerHandle {
    port: number;
    redirectUri: string;
    waitForCallback: () => Promise<CallbackResult>;
    close: () => void;
}
export declare function startCallbackServer(timeoutMs?: number): CallbackServerHandle;
export declare function performOAuthFlow(projectId?: string, openBrowser?: (url: string) => Promise<void>, clientId?: string, clientSecret?: string): Promise<{
    tokens: AntigravityTokenExchangeResult;
    userInfo: AntigravityUserInfo;
    state: string;
}>;
