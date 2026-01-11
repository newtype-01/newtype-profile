import type { PluginInput } from "@opencode-ai/plugin";
import type { BackgroundTask, LaunchInput, ResumeInput } from "./types";
import type { BackgroundTaskConfig } from "../../config/schema";
interface EventProperties {
    sessionID?: string;
    info?: {
        id?: string;
    };
    [key: string]: unknown;
}
interface Event {
    type: string;
    properties?: EventProperties;
}
export declare class BackgroundManager {
    private tasks;
    private notifications;
    private client;
    private directory;
    private pollingInterval?;
    private concurrencyManager;
    constructor(ctx: PluginInput, config?: BackgroundTaskConfig);
    launch(input: LaunchInput): Promise<BackgroundTask>;
    getTask(id: string): BackgroundTask | undefined;
    getTasksByParentSession(sessionID: string): BackgroundTask[];
    getAllDescendantTasks(sessionID: string): BackgroundTask[];
    findBySession(sessionID: string): BackgroundTask | undefined;
    /**
     * Register an external task (e.g., from chief_task) for notification tracking.
     * This allows tasks created by external tools to receive the same toast/prompt notifications.
     */
    registerExternalTask(input: {
        taskId: string;
        sessionID: string;
        parentSessionID: string;
        description: string;
        agent?: string;
        parentAgent?: string;
    }): BackgroundTask;
    resume(input: ResumeInput): Promise<BackgroundTask>;
    private checkSessionTodos;
    handleEvent(event: Event): void;
    markForNotification(task: BackgroundTask): void;
    getPendingNotifications(sessionID: string): BackgroundTask[];
    clearNotifications(sessionID: string): void;
    private clearNotificationsForTask;
    private startPolling;
    private stopPolling;
    cleanup(): void;
    private notifyParentSession;
    private formatDuration;
    private hasRunningTasks;
    private pruneStaleTasksAndNotifications;
    private pollRunningTasks;
}
export {};
