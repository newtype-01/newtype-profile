export declare const AGENT_NAME_MAP: Record<string, string>;
export declare const HOOK_NAME_MAP: Record<string, string>;
export declare const MODEL_TO_CATEGORY_MAP: Record<string, string>;
export declare function migrateAgentNames(agents: Record<string, unknown>): {
    migrated: Record<string, unknown>;
    changed: boolean;
};
export declare function migrateHookNames(hooks: string[]): {
    migrated: string[];
    changed: boolean;
};
export declare function migrateAgentConfigToCategory(config: Record<string, unknown>): {
    migrated: Record<string, unknown>;
    changed: boolean;
};
export declare function shouldDeleteAgentConfig(config: Record<string, unknown>, category: string): boolean;
export declare function migrateConfigFile(configPath: string, rawConfig: Record<string, unknown>): boolean;
