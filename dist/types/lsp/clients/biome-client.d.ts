import type { Diagnostic, LinterClient, ServerConfig } from "../../lsp/types.js";
/**
 * Biome CLI-based linter client.
 * Parses Biome's --reporter=json output into LSP Diagnostic format.
 */
export declare class BiomeClient implements LinterClient {
    #private;
    private readonly config;
    private readonly cwd;
    /** Factory method for creating BiomeClient instances */
    static create(config: ServerConfig, cwd: string): LinterClient;
    constructor(config: ServerConfig, cwd: string);
    format(filePath: string, content: string): Promise<string>;
    lint(filePath: string, signal?: AbortSignal): Promise<Diagnostic[]>;
    dispose(): void;
}
