import type { OhMyOpenCodeConfig } from "../config";
import type { ModelCacheState } from "../plugin-state";
export interface ConfigHandlerDeps {
    ctx: {
        directory: string;
    };
    pluginConfig: OhMyOpenCodeConfig;
    modelCacheState: ModelCacheState;
}
export declare function createConfigHandler(deps: ConfigHandlerDeps): (config: Record<string, unknown>) => Promise<void>;
