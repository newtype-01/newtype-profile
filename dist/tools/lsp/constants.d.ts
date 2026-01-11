import type { LSPServerConfig } from "./types";
export declare const SYMBOL_KIND_MAP: Record<number, string>;
export declare const SEVERITY_MAP: Record<number, string>;
export declare const DEFAULT_MAX_REFERENCES = 200;
export declare const DEFAULT_MAX_SYMBOLS = 200;
export declare const DEFAULT_MAX_DIAGNOSTICS = 200;
export declare const LSP_INSTALL_HINTS: Record<string, string>;
export declare const BUILTIN_SERVERS: Record<string, Omit<LSPServerConfig, "id">>;
export declare const EXT_TO_LANG: Record<string, string>;
