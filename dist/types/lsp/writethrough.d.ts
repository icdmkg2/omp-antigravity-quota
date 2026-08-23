import type { BunFile } from "bun";
import { type FileDiagnosticsResult } from "./diagnostics.js";
/** Options for creating the LSP writethrough callback */
export interface WritethroughOptions {
    /** Whether to format the file using LSP after writing */
    enableFormat?: boolean;
    /** Whether to get LSP diagnostics after writing */
    enableDiagnostics?: boolean;
    /** Called when diagnostics arrive after the main timeout. */
    onDeferredDiagnostics?: (diagnostics: FileDiagnosticsResult) => void;
    /** Signal to cancel a pending deferred diagnostics fetch. */
    deferredSignal?: AbortSignal;
    /** Transform diagnostics before surfacing them after a successful fetch. */
    transformDiagnostics?: (absPath: string, result: FileDiagnosticsResult) => FileDiagnosticsResult;
}
/** Per-file deferred LSP diagnostics wiring for {@link WritethroughCallback}. */
export type WritethroughDeferredHandle = {
    onDeferredDiagnostics: (diagnostics: FileDiagnosticsResult) => void;
    signal: AbortSignal;
    finalize: (diagnostics: FileDiagnosticsResult | undefined) => void;
};
/** Callback type for the LSP writethrough */
export type WritethroughCallback = (dst: string, content: string, signal?: AbortSignal, file?: BunFile, batch?: LspWritethroughBatchRequest, getDeferred?: (dst: string) => WritethroughDeferredHandle | undefined) => Promise<FileDiagnosticsResult | undefined>;
/** No-op writethrough callback */
export declare function writethroughNoop(dst: string, content: string, _signal?: AbortSignal, file?: BunFile, _batch?: LspWritethroughBatchRequest, _getDeferred?: (dst: string) => WritethroughDeferredHandle | undefined): Promise<FileDiagnosticsResult | undefined>;
interface LspWritethroughBatchRequest {
    id: string;
    flush: boolean;
}
export declare function flushLspWritethroughBatch(id: string, cwd: string, signal?: AbortSignal): Promise<FileDiagnosticsResult | undefined>;
/** Create a writethrough callback for LSP aware write operations */
export declare function createLspWritethrough(cwd: string, options?: WritethroughOptions): WritethroughCallback;
export {};
