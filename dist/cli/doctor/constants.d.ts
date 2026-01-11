export declare const SYMBOLS: {
    readonly check: string;
    readonly cross: string;
    readonly warn: string;
    readonly info: string;
    readonly arrow: string;
    readonly bullet: string;
    readonly skip: string;
};
export declare const STATUS_COLORS: {
    readonly pass: import("picocolors/types").Formatter;
    readonly fail: import("picocolors/types").Formatter;
    readonly warn: import("picocolors/types").Formatter;
    readonly skip: import("picocolors/types").Formatter;
};
export declare const CHECK_IDS: {
    readonly OPENCODE_INSTALLATION: "opencode-installation";
    readonly PLUGIN_REGISTRATION: "plugin-registration";
    readonly CONFIG_VALIDATION: "config-validation";
    readonly AUTH_ANTHROPIC: "auth-anthropic";
    readonly AUTH_OPENAI: "auth-openai";
    readonly AUTH_GOOGLE: "auth-google";
    readonly DEP_AST_GREP_CLI: "dep-ast-grep-cli";
    readonly DEP_AST_GREP_NAPI: "dep-ast-grep-napi";
    readonly DEP_COMMENT_CHECKER: "dep-comment-checker";
    readonly GH_CLI: "gh-cli";
    readonly LSP_SERVERS: "lsp-servers";
    readonly MCP_BUILTIN: "mcp-builtin";
    readonly MCP_USER: "mcp-user";
    readonly VERSION_STATUS: "version-status";
};
export declare const CHECK_NAMES: Record<string, string>;
export declare const CATEGORY_NAMES: Record<string, string>;
export declare const EXIT_CODES: {
    readonly SUCCESS: 0;
    readonly FAILURE: 1;
};
export declare const MIN_OPENCODE_VERSION = "1.0.150";
export declare const PACKAGE_NAME = "oh-my-opencode";
export declare const OPENCODE_BINARIES: readonly ["opencode", "opencode-desktop"];
