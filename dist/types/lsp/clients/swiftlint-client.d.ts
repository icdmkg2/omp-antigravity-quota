/**
 * SwiftLint CLI-based linter client.
 * Parses SwiftLint's JSON reporter output into LSP Diagnostic format.
 */
import type { Diagnostic, LinterClient, ServerConfig } from "../../lsp/types.js";
/**
 * SwiftLint CLI-based linter client.
 * Runs `swiftlint lint --reporter json` and converts violations to LSP diagnostics.
 */
export declare class SwiftLintClient implements LinterClient {
    #private;
    private readonly config;
    private readonly cwd;
    /** Factory method for creating SwiftLintClient instances */
    static create(config: ServerConfig, cwd: string): LinterClient;
    constructor(config: ServerConfig, cwd: string);
    format(_filePath: string, content: string): Promise<string>;
    lint(filePath: string, signal?: AbortSignal): Promise<Diagnostic[]>;
    dispose(): void;
}
