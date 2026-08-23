import type { Diagnostic, LinterClient, ServerConfig } from "../../lsp/types.js";
/**
 * LSP-based linter client implementation.
 * Wraps the existing LSP client infrastructure.
 */
export declare class LspLinterClient implements LinterClient {
    #private;
    private readonly config;
    private readonly cwd;
    /** Factory method for creating LspLinterClient instances */
    static create(config: ServerConfig, cwd: string): LinterClient;
    constructor(config: ServerConfig, cwd: string);
    format(filePath: string, content: string): Promise<string>;
    lint(filePath: string, signal?: AbortSignal): Promise<Diagnostic[]>;
    dispose(): void;
}
