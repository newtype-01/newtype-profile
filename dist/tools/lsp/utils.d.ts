import { LSPClient } from "./client";
import type { HoverResult, DocumentSymbol, SymbolInfo, Location, LocationLink, Diagnostic, PrepareRenameResult, PrepareRenameDefaultBehavior, Range, WorkspaceEdit, TextEdit, CodeAction, Command, ServerLookupResult } from "./types";
export declare function findWorkspaceRoot(filePath: string): string;
export declare function uriToPath(uri: string): string;
export declare function formatServerLookupError(result: Exclude<ServerLookupResult, {
    status: "found";
}>): string;
export declare function withLspClient<T>(filePath: string, fn: (client: LSPClient) => Promise<T>): Promise<T>;
export declare function formatHoverResult(result: HoverResult | null): string;
export declare function formatLocation(loc: Location | LocationLink): string;
export declare function formatSymbolKind(kind: number): string;
export declare function formatSeverity(severity: number | undefined): string;
export declare function formatDocumentSymbol(symbol: DocumentSymbol, indent?: number): string;
export declare function formatSymbolInfo(symbol: SymbolInfo): string;
export declare function formatDiagnostic(diag: Diagnostic): string;
export declare function filterDiagnosticsBySeverity(diagnostics: Diagnostic[], severityFilter?: "error" | "warning" | "information" | "hint" | "all"): Diagnostic[];
export declare function formatPrepareRenameResult(result: PrepareRenameResult | PrepareRenameDefaultBehavior | Range | null): string;
export declare function formatTextEdit(edit: TextEdit): string;
export declare function formatWorkspaceEdit(edit: WorkspaceEdit | null): string;
export declare function formatCodeAction(action: CodeAction): string;
export declare function formatCodeActions(actions: (CodeAction | Command)[] | null): string;
export interface ApplyResult {
    success: boolean;
    filesModified: string[];
    totalEdits: number;
    errors: string[];
}
export declare function applyWorkspaceEdit(edit: WorkspaceEdit | null): ApplyResult;
export declare function formatApplyResult(result: ApplyResult): string;
