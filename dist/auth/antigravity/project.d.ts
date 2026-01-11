/**
 * Antigravity project context management.
 * Handles fetching GCP project ID via Google's loadCodeAssist API.
 * For FREE tier users, onboards via onboardUser API to get server-assigned managed project ID.
 * Reference: https://github.com/shekohex/opencode-google-antigravity-auth
 */
import type { AntigravityProjectContext } from "./types";
export declare function fetchProjectContext(accessToken: string): Promise<AntigravityProjectContext>;
export declare function clearProjectContextCache(accessToken?: string): void;
export declare function invalidateProjectContextByRefreshToken(_refreshToken: string): void;
