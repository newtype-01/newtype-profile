import type { CommandDefinition } from "../claude-code-command-loader/types";
import type { LoadedSkill } from "./types";
export declare function loadUserSkills(): Promise<Record<string, CommandDefinition>>;
export declare function loadProjectSkills(): Promise<Record<string, CommandDefinition>>;
export declare function loadOpencodeGlobalSkills(): Promise<Record<string, CommandDefinition>>;
export declare function loadOpencodeProjectSkills(): Promise<Record<string, CommandDefinition>>;
export interface DiscoverSkillsOptions {
    includeClaudeCodePaths?: boolean;
}
export declare function discoverAllSkills(): Promise<LoadedSkill[]>;
export declare function discoverSkills(options?: DiscoverSkillsOptions): Promise<LoadedSkill[]>;
export declare function getSkillByName(name: string, options?: DiscoverSkillsOptions): Promise<LoadedSkill | undefined>;
export declare function discoverUserClaudeSkills(): Promise<LoadedSkill[]>;
export declare function discoverProjectClaudeSkills(): Promise<LoadedSkill[]>;
export declare function discoverOpencodeGlobalSkills(): Promise<LoadedSkill[]>;
export declare function discoverOpencodeProjectSkills(): Promise<LoadedSkill[]>;
