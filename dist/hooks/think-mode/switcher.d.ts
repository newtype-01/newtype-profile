/**
 * Think Mode Switcher
 *
 * This module handles "thinking mode" activation for reasoning-capable models.
 * When a user includes "think" keywords in their prompt, models are upgraded to
 * their high-reasoning variants with extended thinking budgets.
 *
 * PROVIDER ALIASING:
 * GitHub Copilot acts as a proxy provider that routes to underlying providers
 * (Anthropic, Google, OpenAI). We resolve the proxy to the actual provider
 * based on model name patterns, allowing GitHub Copilot to inherit thinking
 * configurations without duplication.
 *
 * NORMALIZATION:
 * Model IDs are normalized (dots → hyphens in version numbers) to handle API
 * inconsistencies defensively while maintaining backwards compatibility.
 */
export declare const THINKING_CONFIGS: {
    readonly anthropic: {
        readonly thinking: {
            readonly type: "enabled";
            readonly budgetTokens: 64000;
        };
        readonly maxTokens: 128000;
    };
    readonly "amazon-bedrock": {
        readonly reasoningConfig: {
            readonly type: "enabled";
            readonly budgetTokens: 32000;
        };
        readonly maxTokens: 64000;
    };
    readonly google: {
        readonly providerOptions: {
            readonly google: {
                readonly thinkingConfig: {
                    readonly thinkingLevel: "HIGH";
                };
            };
        };
    };
    readonly "google-vertex": {
        readonly providerOptions: {
            readonly "google-vertex": {
                readonly thinkingConfig: {
                    readonly thinkingLevel: "HIGH";
                };
            };
        };
    };
    readonly openai: {
        readonly reasoning_effort: "high";
    };
};
export declare function getHighVariant(modelID: string): string | null;
export declare function isAlreadyHighVariant(modelID: string): boolean;
export declare function getThinkingConfig(providerID: string, modelID: string): Record<string, unknown> | null;
