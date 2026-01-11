import type { PluginInput } from "@opencode-ai/plugin";
import type { TrackedTask, TaskStatus } from "./types";
import type { ConcurrencyManager } from "../background-agent/concurrency";
type OpencodeClient = PluginInput["client"];
export declare class TaskToastManager {
    private tasks;
    private client;
    private concurrencyManager?;
    constructor(client: OpencodeClient, concurrencyManager?: ConcurrencyManager);
    setConcurrencyManager(manager: ConcurrencyManager): void;
    addTask(task: {
        id: string;
        description: string;
        agent: string;
        isBackground: boolean;
        status?: TaskStatus;
        skills?: string[];
    }): void;
    /**
     * Update task status
     */
    updateTask(id: string, status: TaskStatus): void;
    /**
     * Remove completed/error task
     */
    removeTask(id: string): void;
    /**
     * Get all running tasks (newest first)
     */
    getRunningTasks(): TrackedTask[];
    /**
     * Get all queued tasks
     */
    getQueuedTasks(): TrackedTask[];
    /**
     * Format duration since task started
     */
    private formatDuration;
    private getConcurrencyInfo;
    private buildTaskListMessage;
    /**
     * Show consolidated toast with all running/queued tasks
     */
    private showTaskListToast;
    /**
     * Show task completion toast
     */
    showCompletionToast(task: {
        id: string;
        description: string;
        duration: string;
    }): void;
}
export declare function getTaskToastManager(): TaskToastManager | null;
export declare function initTaskToastManager(client: OpencodeClient, concurrencyManager?: ConcurrencyManager): TaskToastManager;
export {};
