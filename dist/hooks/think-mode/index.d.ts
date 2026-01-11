import type { ThinkModeInput } from "./types";
export * from "./detector";
export * from "./switcher";
export * from "./types";
export declare function clearThinkModeState(sessionID: string): void;
export declare function createThinkModeHook(): {
    "chat.params": (output: ThinkModeInput, sessionID: string) => Promise<void>;
    event: ({ event }: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
};
