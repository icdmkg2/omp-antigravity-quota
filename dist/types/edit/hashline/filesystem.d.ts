import { Filesystem, type PreflightWriteOptions, type WriteResult } from "@oh-my-pi/hashline";
import type { FileDiagnosticsResult, WritethroughCallback, WritethroughDeferredHandle } from "../../lsp/index.js";
import type { ToolSession } from "../../tools/index.js";
import type { LspBatchRequest } from "../renderer.js";
export interface HashlineFilesystemOptions {
    session: ToolSession;
    writethrough: WritethroughCallback;
    beginDeferredDiagnosticsForPath: (path: string) => WritethroughDeferredHandle;
    signal?: AbortSignal;
    /**
     * Outer LSP batch request inherited from the tool-call context. The
     * orchestrator narrows this per-section (flush only on the final write)
     * via {@link HashlineFilesystem.setBatchRequest}.
     */
    batchRequest?: LspBatchRequest;
}
export declare class HashlineFilesystem extends Filesystem {
    #private;
    readonly session: ToolSession;
    constructor(options: HashlineFilesystemOptions);
    /**
     * Set the LSP batch request used for the next {@link writeText} call.
     * Multi-section orchestrators flip the `flush` flag to true before the
     * final section so LSP diagnostics flush in one round-trip.
     */
    setBatchRequest(batchRequest: LspBatchRequest | undefined): void;
    /**
     * Look up (and clear) the diagnostics captured by the most-recent
     * {@link writeText} call for `path`. Returns `undefined` if no write
     * has happened or the writethrough returned no diagnostics.
     */
    consumeDiagnostics(path: string): FileDiagnosticsResult | undefined;
    resolveAbsolute(relativePath: string): string;
    canonicalPath(relativePath: string): string;
    allowTagPathRecovery(authoredPath: string, resolvedPath: string): boolean;
    readText(relativePath: string): Promise<string>;
    readBinary(relativePath: string): Promise<Uint8Array | undefined>;
    preflightWrite(relativePath: string, options?: PreflightWriteOptions): Promise<void>;
    delete(relativePath: string): Promise<void>;
    move(fromRelative: string, toRelative: string, content?: string): Promise<void>;
    writeText(relativePath: string, content: string): Promise<WriteResult>;
    exists(relativePath: string): Promise<boolean>;
}
