export interface ToolResultInfo {
    partPath: string;
    partId: string;
    messageID: string;
    toolName: string;
    outputSize: number;
}
export declare function findToolResultsBySize(sessionID: string): ToolResultInfo[];
export declare function findLargestToolResult(sessionID: string): ToolResultInfo | null;
export declare function truncateToolResult(partPath: string): {
    success: boolean;
    toolName?: string;
    originalSize?: number;
};
export declare function getTotalToolOutputSize(sessionID: string): number;
export declare function countTruncatedResults(sessionID: string): number;
export interface AggressiveTruncateResult {
    success: boolean;
    sufficient: boolean;
    truncatedCount: number;
    totalBytesRemoved: number;
    targetBytesToRemove: number;
    truncatedTools: Array<{
        toolName: string;
        originalSize: number;
    }>;
}
export declare function truncateUntilTargetTokens(sessionID: string, currentTokens: number, maxTokens: number, targetRatio?: number, charsPerToken?: number): AggressiveTruncateResult;
