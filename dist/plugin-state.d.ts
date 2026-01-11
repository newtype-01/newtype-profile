export interface ModelCacheState {
    modelContextLimitsCache: Map<string, number>;
    anthropicContext1MEnabled: boolean;
}
export declare function createModelCacheState(): ModelCacheState;
export declare function getModelLimit(state: ModelCacheState, providerID: string, modelID: string): number | undefined;
