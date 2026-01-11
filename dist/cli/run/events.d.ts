import type { RunContext } from "./types";
export interface EventState {
    mainSessionIdle: boolean;
    mainSessionError: boolean;
    lastError: string | null;
    lastOutput: string;
    lastPartText: string;
    currentTool: string | null;
}
export declare function createEventState(): EventState;
export declare function processEvents(ctx: RunContext, stream: AsyncIterable<unknown>, state: EventState): Promise<void>;
