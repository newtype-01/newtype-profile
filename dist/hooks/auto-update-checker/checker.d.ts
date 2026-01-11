import type { UpdateCheckResult } from "./types";
export declare function isLocalDevMode(directory: string): boolean;
export declare function getLocalDevPath(directory: string): string | null;
export declare function getLocalDevVersion(directory: string): string | null;
export interface PluginEntryInfo {
    entry: string;
    isPinned: boolean;
    pinnedVersion: string | null;
    configPath: string;
}
export declare function findPluginEntry(directory: string): PluginEntryInfo | null;
export declare function getCachedVersion(): string | null;
/**
 * Updates a pinned version entry in the config file.
 * Only replaces within the "plugin" array to avoid unintended edits.
 * Preserves JSONC comments and formatting via string replacement.
 */
export declare function updatePinnedVersion(configPath: string, oldEntry: string, newVersion: string): boolean;
export declare function getLatestVersion(): Promise<string | null>;
export declare function checkForUpdate(directory: string): Promise<UpdateCheckResult>;
