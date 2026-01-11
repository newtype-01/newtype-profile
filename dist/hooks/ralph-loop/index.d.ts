import type { PluginInput } from "@opencode-ai/plugin";
import type { RalphLoopState, RalphLoopOptions } from "./types";
export * from "./types";
export * from "./constants";
export { readState, writeState, clearState, incrementIteration } from "./storage";
export interface RalphLoopHook {
    event: (input: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
    startLoop: (sessionID: string, prompt: string, options?: {
        maxIterations?: number;
        completionPromise?: string;
    }) => boolean;
    cancelLoop: (sessionID: string) => boolean;
    getState: () => RalphLoopState | null;
}
export declare function createRalphLoopHook(ctx: PluginInput, options?: RalphLoopOptions): RalphLoopHook;
