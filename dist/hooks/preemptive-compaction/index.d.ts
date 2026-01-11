import type { PluginInput } from "@opencode-ai/plugin";
import type { ExperimentalConfig } from "../../config";
export interface SummarizeContext {
    sessionID: string;
    providerID: string;
    modelID: string;
    usageRatio: number;
    directory: string;
}
export type BeforeSummarizeCallback = (ctx: SummarizeContext) => Promise<void> | void;
export type GetModelLimitCallback = (providerID: string, modelID: string) => number | undefined;
export interface PreemptiveCompactionOptions {
    experimental?: ExperimentalConfig;
    onBeforeSummarize?: BeforeSummarizeCallback;
    getModelLimit?: GetModelLimitCallback;
}
export declare function createPreemptiveCompactionHook(ctx: PluginInput, options?: PreemptiveCompactionOptions): {
    event: ({ event }: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
};
