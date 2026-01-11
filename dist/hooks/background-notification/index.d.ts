import type { BackgroundManager } from "../../features/background-agent";
interface Event {
    type: string;
    properties?: Record<string, unknown>;
}
interface EventInput {
    event: Event;
}
export declare function createBackgroundNotificationHook(manager: BackgroundManager): {
    event: ({ event }: EventInput) => Promise<void>;
};
export type { BackgroundNotificationHookConfig } from "./types";
