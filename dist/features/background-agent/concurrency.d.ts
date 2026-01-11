import type { BackgroundTaskConfig } from "../../config/schema";
export declare class ConcurrencyManager {
    private config?;
    private counts;
    private queues;
    constructor(config?: BackgroundTaskConfig);
    getConcurrencyLimit(model: string): number;
    acquire(model: string): Promise<void>;
    release(model: string): void;
}
