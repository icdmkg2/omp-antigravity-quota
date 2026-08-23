export declare const lspSchema: import("@oh-my-pi/omptype").FluentType<{
    action: "capabilities" | "code_actions" | "definition" | "diagnostics" | "hover" | "implementation" | "references" | "reload" | "rename" | "rename_file" | "request" | "status" | "symbols" | "type_definition";
    apply?: boolean | undefined;
    file?: string | undefined;
    line?: number | undefined;
    new_name?: string | undefined;
    payload?: string | undefined;
    query?: string | undefined;
    symbol?: string | undefined;
    timeout?: number | undefined;
}, {
    action: "capabilities" | "code_actions" | "definition" | "diagnostics" | "hover" | "implementation" | "references" | "reload" | "rename" | "rename_file" | "request" | "status" | "symbols" | "type_definition";
    apply?: boolean | undefined;
    file?: string | undefined;
    line?: number | undefined;
    new_name?: string | undefined;
    payload?: string | undefined;
    query?: string | undefined;
    symbol?: string | undefined;
    timeout?: number | undefined;
}>;
export type LspParams = typeof lspSchema.infer;
export interface LspToolDetails {
    serverName?: string;
    action: string;
    success: boolean;
    request?: LspParams;
}
export interface Position {
    line: number;
    character: number;
}
export interface Range {
    start: Position;
    end: Position;
}
export interface Location {
    uri: string;
    range: Range;
}
export interface LocationLink {
    originSelectionRange?: Range;
    targetUri: string;
    targetRange: Range;
    targetSelectionRange: Range;
}
export type DiagnosticSeverity = 1 | 2 | 3 | 4;
export interface DiagnosticRelatedInformation {
    location: Location;
    message: string;
}
export interface Diagnostic {
    range: Range;
    severity?: DiagnosticSeverity;
    code?: string | number;
    codeDescription?: {
        href: string;
    };
    source?: string;
    message: string;
    tags?: number[];
    relatedInformation?: DiagnosticRelatedInformation[];
    data?: unknown;
}
export interface PublishedDiagnostics {
    diagnostics: Diagnostic[];
    version: number | null;
}
export interface PublishDiagnosticsParams {
    uri: string;
    diagnostics: Diagnostic[];
    version?: number | null;
}
export interface TextEdit {
    range: Range;
    newText: string;
    insertTextFormat?: 1 | 2;
}
export interface AnnotatedTextEdit extends TextEdit {
    annotationId?: string;
}
export interface TextDocumentIdentifier {
    uri: string;
}
export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
    version: number | null;
}
export interface OptionalVersionedTextDocumentIdentifier extends TextDocumentIdentifier {
    version?: number | null;
}
export interface TextDocumentEdit {
    textDocument: OptionalVersionedTextDocumentIdentifier;
    edits: (TextEdit | AnnotatedTextEdit)[];
}
export interface CreateFileOptions {
    overwrite?: boolean;
    ignoreIfExists?: boolean;
}
export interface CreateFile {
    kind: "create";
    uri: string;
    options?: CreateFileOptions;
}
export interface RenameFileOptions {
    overwrite?: boolean;
    ignoreIfExists?: boolean;
}
export interface RenameFile {
    kind: "rename";
    oldUri: string;
    newUri: string;
    options?: RenameFileOptions;
}
export interface DeleteFileOptions {
    recursive?: boolean;
    ignoreIfNotExists?: boolean;
}
export interface DeleteFile {
    kind: "delete";
    uri: string;
    options?: DeleteFileOptions;
}
export type DocumentChange = TextDocumentEdit | CreateFile | RenameFile | DeleteFile;
export interface WorkspaceEdit {
    changes?: Record<string, TextEdit[]>;
    documentChanges?: DocumentChange[];
    changeAnnotations?: Record<string, {
        label: string;
        needsConfirmation?: boolean;
        description?: string;
    }>;
}
export type CodeActionKind = "quickfix" | "refactor" | "refactor.extract" | "refactor.inline" | "refactor.rewrite" | "source" | "source.organizeImports" | "source.fixAll" | string;
export interface Command {
    title: string;
    command: string;
    arguments?: unknown[];
}
export interface CodeAction {
    title: string;
    kind?: CodeActionKind;
    diagnostics?: Diagnostic[];
    isPreferred?: boolean;
    disabled?: {
        reason: string;
    };
    edit?: WorkspaceEdit;
    command?: Command;
    data?: unknown;
}
export interface CodeActionContext {
    diagnostics: Diagnostic[];
    only?: CodeActionKind[];
    triggerKind?: 1 | 2;
}
export type SymbolKind = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26;
export declare const SYMBOL_KIND_NAMES: Record<SymbolKind, string>;
export interface DocumentSymbol {
    name: string;
    detail?: string;
    kind: SymbolKind;
    tags?: number[];
    deprecated?: boolean;
    range: Range;
    selectionRange: Range;
    children?: DocumentSymbol[];
}
export interface SymbolInformation {
    name: string;
    kind: SymbolKind;
    tags?: number[];
    deprecated?: boolean;
    location: Location;
    containerName?: string;
}
export interface MarkupContent {
    kind: "plaintext" | "markdown";
    value: string;
}
export type MarkedString = string | {
    language: string;
    value: string;
};
export interface Hover {
    contents: MarkupContent | MarkedString | MarkedString[];
    range?: Range;
}
/**
 * Interface for linter/formatter clients.
 * Can be implemented using LSP protocol or CLI tools.
 */
export interface LinterClient {
    /** Format file content. Returns formatted content. */
    format(filePath: string, content: string): Promise<string>;
    /** Get diagnostics for a file. Content should already be written to disk. */
    lint(filePath: string, signal?: AbortSignal): Promise<Diagnostic[]>;
    /** Dispose of any resources (e.g., LSP connection) */
    dispose?(): void;
}
/** Factory function to create a LinterClient */
export type LinterClientFactory = (config: ServerConfig, cwd: string) => LinterClient;
export interface ServerCapabilities {
    flycheck?: boolean;
    ssr?: boolean;
    expandMacro?: boolean;
    runnables?: boolean;
    relatedTests?: boolean;
}
export interface ServerConfig {
    command: string;
    args?: string[];
    fileTypes: string[];
    /** LSP language identifier sent in didOpen; inferred from the file path when omitted. */
    languageId?: string;
    rootMarkers: string[];
    initOptions?: Record<string, unknown>;
    settings?: Record<string, unknown>;
    disabled?: boolean;
    /** Per-server warmup timeout in milliseconds. Overrides the global WARMUP_TIMEOUT_MS for this server during startup. */
    warmupTimeoutMs?: number;
    /**
     * Per-server overrides for rust-analyzer workspace-ready polling. When omitted, the module
     * defaults are used. Primarily a tuning/test seam to bound the multi-second settle window.
     */
    workspaceReadyTimings?: {
        timeoutMs?: number;
        pollMs?: number;
        settleMs?: number;
        statusRequestTimeoutMs?: number;
    };
    capabilities?: ServerCapabilities;
    /** If true, this is a linter/formatter server (e.g., Biome) - used only for diagnostics/actions, not type intelligence */
    isLinter?: boolean;
    /** Resolved absolute path to the command binary (set during config loading) */
    resolvedCommand?: string;
    /**
     * Custom linter client factory. If provided, creates a custom client instead of using LSP.
     * The client handles format/lint operations. Useful for tools with buggy LSP implementations.
     */
    createClient?: LinterClientFactory;
}
/** Minimal write sink for the server-bound byte stream (satisfied by `Bun.FileSink` and the mux socket adapter). */
export interface LspWriteSink {
    write(data: string | Uint8Array): number | Promise<number>;
    flush(): number | void | Promise<number | void>;
}
/**
 * Byte transport carrying one LSP JSON-RPC link. Structurally satisfied by
 * `ptree.ChildProcess<"pipe">` (local server spawn) and by the socket adapter
 * in `mux/daemon.ts` (broker-shared server). `exited` may reject (ptree kill).
 */
export interface LspTransport {
    readonly stdin: LspWriteSink;
    readonly stdout: ReadableStream<Uint8Array>;
    readonly exited: Promise<number>;
    readonly exitCode: number | null;
    readonly pid?: number;
    /** Present and true on broker-shared mux links; `lsp reload` uses it to request a shared-server restart. */
    readonly sharedMux?: boolean;
    kill(): void;
    peekStderr(): string;
}
export interface OpenFile {
    version: number;
    languageId: string;
}
export interface PendingRequest {
    resolve: (result: unknown) => void;
    reject: (error: Error) => void;
    method: string;
}
export interface LspServerCapabilities {
    renameProvider?: boolean | {
        prepareProvider?: boolean;
    };
    codeActionProvider?: boolean | {
        resolveProvider?: boolean;
    };
    hoverProvider?: boolean;
    definitionProvider?: boolean;
    referencesProvider?: boolean;
    documentSymbolProvider?: boolean;
    workspaceSymbolProvider?: boolean;
    diagnosticProvider?: boolean | Record<string, unknown>;
    [key: string]: unknown;
}
export interface LspClient {
    name: string;
    cwd: string;
    config: ServerConfig;
    proc: LspTransport;
    requestId: number;
    diagnostics: Map<string, PublishedDiagnostics>;
    diagnosticsVersion: number;
    /** Dynamic capability registrations keyed by the server-provided registration ID. */
    dynamicCapabilityRegistrations?: Map<string, string>;
    openFiles: Map<string, OpenFile>;
    pendingRequests: Map<number | string, PendingRequest>;
    messageBuffer: Uint8Array;
    isReading: boolean;
    /** Lifecycle state: "connecting" until initialize completes, then "ready"; "error" on init failure or reader death. */
    status: "connecting" | "ready" | "error";
    serverCapabilities?: LspServerCapabilities;
    lastActivity: number;
    /** Serializes outbound JSON-RPC writes to the server process. */
    writeQueue: Promise<void>;
    /** Tracks active work-done progress tokens from the server */
    activeProgressTokens: Set<string | number>;
    /** Resolves when the server's initial project loading completes (or after timeout) */
    projectLoaded: Promise<void>;
    /** Call to signal that project loading has completed */
    resolveProjectLoaded: () => void;
}
/** JSON-RPC request/response identifier accepted by LSP peers. */
export type LspJsonRpcId = number | string;
export interface LspJsonRpcRequest {
    jsonrpc: "2.0";
    id: LspJsonRpcId;
    method: string;
    params: unknown;
}
export interface LspJsonRpcResponse {
    jsonrpc: "2.0";
    id?: LspJsonRpcId;
    result?: unknown;
    error?: {
        code: number;
        message: string;
        data?: unknown;
    };
}
export interface LspJsonRpcNotification {
    jsonrpc: "2.0";
    method: string;
    params?: unknown;
}
