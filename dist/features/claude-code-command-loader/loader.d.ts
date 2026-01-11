import type { CommandDefinition } from "./types";
export declare function loadUserCommands(): Promise<Record<string, CommandDefinition>>;
export declare function loadProjectCommands(): Promise<Record<string, CommandDefinition>>;
export declare function loadOpencodeGlobalCommands(): Promise<Record<string, CommandDefinition>>;
export declare function loadOpencodeProjectCommands(): Promise<Record<string, CommandDefinition>>;
export declare function loadAllCommands(): Promise<Record<string, CommandDefinition>>;
