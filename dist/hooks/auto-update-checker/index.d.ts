import type { PluginInput } from "@opencode-ai/plugin";
import type { AutoUpdateCheckerOptions } from "./types";
export declare function isPrereleaseVersion(version: string): boolean;
export declare function isDistTag(version: string): boolean;
export declare function isPrereleaseOrDistTag(pinnedVersion: string | null): boolean;
export declare function createAutoUpdateCheckerHook(ctx: PluginInput, options?: AutoUpdateCheckerOptions): {
    event: ({ event }: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => void;
};
export type { UpdateCheckResult, AutoUpdateCheckerOptions } from "./types";
export { checkForUpdate } from "./checker";
export { invalidatePackage, invalidateCache } from "./cache";
