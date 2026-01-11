export type PermissionValue = "ask" | "allow" | "deny";
export interface LegacyToolsFormat {
    tools: Record<string, boolean>;
}
export interface NewPermissionFormat {
    permission: Record<string, PermissionValue>;
}
export type VersionAwareRestrictions = LegacyToolsFormat | NewPermissionFormat;
export declare function createAgentToolRestrictions(denyTools: string[]): VersionAwareRestrictions;
export declare function migrateToolsToPermission(tools: Record<string, boolean>): Record<string, PermissionValue>;
export declare function migratePermissionToTools(permission: Record<string, PermissionValue>): Record<string, boolean>;
export declare function migrateAgentConfig(config: Record<string, unknown>): Record<string, unknown>;
