export { truncate } from "@oh-my-pi/pi-utils";
import type { CodeAction, Command, Diagnostic, DiagnosticSeverity, DocumentSymbol, Location, SymbolInformation, SymbolKind, TextEdit, WorkspaceEdit } from "./types.js";
export { detectLanguageId } from "../utils/lang-from-path.js";
/**
 * Convert a file path to a file:// URI.
 * Uses the URL machinery so special characters (`%`, `#`, `?`, spaces) are
 * percent-encoded; plain concatenation produced URIs that broke round-trips.
 * Handles Windows drive letters correctly.
 */
export declare function fileToUri(filePath: string): string;
/**
 * Convert a file:// URI to a file path.
 * Tolerates both percent-encoded URIs and lax servers that send raw paths.
 * Handles Windows drive letters correctly.
 */
export declare function uriToFile(uri: string): string;
/** Map that treats equivalent file URI spellings as the same key. */
export declare class EquivalentUriMap<Value> extends Map<string, Value> {
    #private;
    delete(uri: string): boolean;
    get(uri: string): Value | undefined;
    has(uri: string): boolean;
    set(uri: string, value: Value): this;
}
/**
 * Convert diagnostic severity number to string name.
 */
export declare function severityToString(severity?: DiagnosticSeverity): string;
/**
 * Sort diagnostics by severity, then by location and message.
 */
export declare function sortDiagnostics(diagnostics: Diagnostic[]): Diagnostic[];
/**
 * Get icon for diagnostic severity.
 */
export declare function severityToIcon(severity?: DiagnosticSeverity): string;
/**
 * Format a diagnostic as a human-readable string.
 */
export declare function formatDiagnostic(diagnostic: Diagnostic, filePath: string): string;
/**
 * Reformat pre-formatted diagnostic messages into a multi-level, prefix-folded
 * directory/file grouping (see `formatGroupedFiles`).
 * Input:  ["path:line:col [sev] msg", ...]
 * Output: "# pkg/src/\n## file.ts\n  line:col [sev] msg"
 *
 * Messages that don't match the expected format are appended ungrouped at the end.
 */
export declare function formatGroupedDiagnosticMessages(messages: string[]): string;
/**
 * Format diagnostics grouped by severity.
 */
export declare function formatDiagnosticsSummary(diagnostics: Diagnostic[]): string;
export declare function summarizeDiagnosticMessages(messages: string[]): {
    summary: string;
    errored: boolean;
};
/**
 * Format a location as file:line:col relative to cwd.
 */
export declare function formatLocation(location: Location, cwd: string): string;
/**
 * Format a position as line:col.
 */
export declare function formatPosition(line: number, col: number): string;
/**
 * Format a workspace edit as a summary of changes.
 */
export declare function formatWorkspaceEdit(edit: WorkspaceEdit, cwd: string): string[];
/**
 * Format a text edit as a preview.
 */
export declare function formatTextEdit(edit: TextEdit, maxLength?: number): string;
/**
 * Get icon for symbol kind.
 */
export declare function symbolKindToIcon(kind: SymbolKind): string;
/**
 * Get name for symbol kind.
 */
export declare function symbolKindToName(kind: SymbolKind): string;
/**
 * Format a document symbol with optional hierarchy.
 */
export declare function formatDocumentSymbol(symbol: DocumentSymbol, indent?: number): string[];
/**
 * Format a symbol information (flat format).
 */
export declare function formatSymbolInformation(symbol: SymbolInformation, cwd: string): string;
export declare function filterWorkspaceSymbols(symbols: SymbolInformation[], query: string): SymbolInformation[];
export declare function dedupeWorkspaceSymbols(symbols: SymbolInformation[]): SymbolInformation[];
export declare function formatCodeAction(action: CodeAction | Command, index: number): string;
export interface CodeActionApplyDependencies {
    resolveCodeAction?: (action: CodeAction) => Promise<CodeAction>;
    applyWorkspaceEdit: (edit: WorkspaceEdit) => Promise<string[]>;
    executeCommand: (command: Command) => Promise<void>;
}
export interface AppliedCodeActionResult {
    title: string;
    edits: string[];
    executedCommands: string[];
}
export declare function applyCodeAction(action: CodeAction | Command, dependencies: CodeActionApplyDependencies): Promise<AppliedCodeActionResult | null>;
export declare function hasGlobPattern(value: string): boolean;
export declare function collectGlobMatches(pattern: string, cwd: string, maxMatches: number): Promise<{
    matches: string[];
    truncated: boolean;
}>;
export declare function resolveDiagnosticTargets(file: string, cwd: string, maxMatches: number): Promise<{
    matches: string[];
    truncated: boolean;
}>;
/**
 * Extract plain text from hover contents.
 */
export declare function extractHoverText(contents: string | {
    kind: string;
    value: string;
} | {
    language: string;
    value: string;
} | unknown[]): string;
export declare function resolveSymbolColumn(filePath: string, line: number, symbolSpec?: string): Promise<number>;
export declare function readLocationContext(filePath: string, line: number, contextLines?: number): Promise<string[]>;
