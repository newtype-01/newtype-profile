import type { AutoSlashCommandHookInput, AutoSlashCommandHookOutput } from "./types";
import type { LoadedSkill } from "../../features/opencode-skill-loader";
export * from "./detector";
export * from "./executor";
export * from "./constants";
export * from "./types";
export interface AutoSlashCommandHookOptions {
    skills?: LoadedSkill[];
}
export declare function createAutoSlashCommandHook(options?: AutoSlashCommandHookOptions): {
    "chat.message": (input: AutoSlashCommandHookInput, output: AutoSlashCommandHookOutput) => Promise<void>;
};
