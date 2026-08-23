import type { Diagnostic, Location, LocationLink, LspClient, Position, ServerConfig } from "./types.js";
export declare const SINGLE_DIAGNOSTICS_WAIT_TIMEOUT_MS = 3000;
export declare const BATCH_DIAGNOSTICS_WAIT_TIMEOUT_MS = 400;
/**
 * How long the edit/write writethrough blocks inline waiting for fresh
 * diagnostics before handing slow servers off to the deferred late-injection
 * channel. Keeps the common fast-server case inline while letting an edit
 * return promptly when a server (e.g. a large-monorepo tsserver) is slow to
 * publish fresh diagnostics.
 */
export declare const INLINE_DIAGNOSTICS_WAIT_TIMEOUT_MS = 500;
/**
 * Inner per-server diagnostics wait budget for the background/deferred fetch.
 * Longer than the inline cap (and the old 3s default) so a slow server still
 * delivers late instead of giving up before it ever publishes.
 */
export declare const DEFERRED_DIAGNOSTICS_WAIT_TIMEOUT_MS = 12000;
/**
 * Extra wall-clock headroom granted to each per-server diagnostics pipeline on
 * top of its diagnostics wait budget. The pipeline includes client creation
 * (spawn + initialize), project load, and custom linter runs — steps that have
 * no own deadline when the caller passes a user-abort-only signal (the edit
 * tool does exactly that: `sendRequest` skips its default timeout whenever a
 * signal is present). A wedged server or hung linter subprocess then blocks
 * the edit forever, and because the edit tool is `exclusive`, every later edit
 * queues behind it (issue #4910). This grace period turns that infinite hang
 * into a bounded skip: the slow server is dropped from this round's results
 * and the edit returns.
 */
export declare const DIAGNOSTICS_PIPELINE_GRACE_MS = 10000;
export declare const MAX_GLOB_DIAGNOSTIC_TARGETS = 20;
export declare const WORKSPACE_SYMBOL_LIMIT = 200;
export declare const PROJECT_INDEXED_ACTIONS: ReadonlySet<string>;
export declare function hasRustWorkspaceAncestor(filePath: string): boolean;
export declare function limitDiagnosticMessages(messages: string[]): string[];
export declare const REFERENCE_CONTEXT_LIMIT = 50;
export declare const REFERENCES_RETRY_COUNT = 2;
export declare const REFERENCES_RETRY_DELAY_MS = 250;
export declare function isOnlyQueriedDeclaration(locations: Location[], uri: string, position: Position): boolean;
export declare function normalizeLocationResult(result: Location | Location[] | LocationLink | LocationLink[] | null): Location[];
export declare function formatLocationWithContext(location: Location, cwd: string): Promise<string>;
interface WaitForDiagnosticsOptions {
    timeoutMs?: number;
    signal?: AbortSignal;
    minVersion?: number;
    expectedDocumentVersion?: number;
    /**
     * Quiescence window (ms). typescript-language-server never echoes the document
     * version (issue #983) and emits diagnostics from several sources at different
     * times, so there is no single "complete, version-matched" publish to gate on.
     * When the server does not exact-version-match, accept the latest publish only
     * after no newer one has arrived for this long, letting an in-flight pre-edit
     * publish be superseded by the fresh one.
     */
    settleMs?: number;
}
export declare function waitForDiagnostics(client: LspClient, uri: string, options?: WaitForDiagnosticsOptions): Promise<Diagnostic[]>;
/** Result from getDiagnosticsForFile */
export interface FileDiagnosticsResult {
    /** Name of the LSP server used (if available) */
    server?: string;
    /** Formatted diagnostic messages */
    messages: string[];
    /** Summary string (e.g., "2 error(s), 1 warning(s)") */
    summary: string;
    /** Whether there are any errors (severity 1) */
    errored: boolean;
    /** Whether the file was formatted */
    formatter?: FileFormatResult;
}
export type ServerVersionMap = Map<string, number>;
interface GetDiagnosticsForFileOptions {
    signal?: AbortSignal;
    minVersions?: ServerVersionMap;
    expectedDocumentVersions?: ServerVersionMap;
    /** Per-server wait budget (ms). Defaults to {@link SINGLE_DIAGNOSTICS_WAIT_TIMEOUT_MS}. */
    timeoutMs?: number;
    /**
     * Hard wall-clock bound (ms) for each server's whole pipeline (client init,
     * project load, linting, diagnostics wait). Defaults to the wait budget plus
     * {@link DIAGNOSTICS_PIPELINE_GRACE_MS}. Exposed as a test seam.
     */
    pipelineBudgetMs?: number;
}
/**
 * Capture current diagnostic versions for all LSP servers.
 * Call this BEFORE syncing content to detect stale diagnostics later.
 */
export declare function captureDiagnosticVersions(cwd: string, servers: Array<[string, ServerConfig]>, initTimeoutMs?: number, signal?: AbortSignal): Promise<ServerVersionMap>;
export declare function captureOpenFileVersions(absolutePath: string, cwd: string, servers: Array<[string, ServerConfig]>, signal?: AbortSignal): Promise<ServerVersionMap>;
/**
 * Get diagnostics for a file using LSP or custom linter client.
 *
 * @param absolutePath - Absolute path to the file
 * @param cwd - Working directory for LSP config resolution
 * @param servers - Servers to query diagnostics for
 * @param minVersions - Minimum diagnostic versions per server (to detect stale results)
 * @returns Diagnostic results or undefined if no servers
 */
export declare function getDiagnosticsForFile(absolutePath: string, cwd: string, servers: Array<[string, ServerConfig]>, options?: GetDiagnosticsForFileOptions): Promise<FileDiagnosticsResult | undefined>;
export declare enum FileFormatResult {
    UNCHANGED = "unchanged",
    FORMATTED = "formatted",
    FAILED = "failed",
    UNSUPPORTED = "unsupported"
}
/**
 * Result from formatContent, distinguishing successful formatting
 * (formatted or unchanged) from a failure or unsupported file type.
 */
export type FormatContentResult = {
    content: string;
    failed: boolean;
    unsupported: boolean;
};
/**
 * Format content using LSP or custom linter client.
 *
 * @param absolutePath - Absolute path (for URI)
 * @param content - Content to format
 * @param cwd - Working directory for LSP config resolution
 * @param servers - Servers to try formatting with
 * @returns Formatted content, or original if no formatter available
 */
export declare function formatContent(absolutePath: string, content: string, cwd: string, servers: Array<[string, ServerConfig]>, signal?: AbortSignal): Promise<FormatContentResult>;
export {};
