import type { LinterClient, ServerConfig } from "../../lsp/types.js";
/**
 * Linter client implementations.
 *
 * The LinterClient interface provides a common API for formatters and linters.
 * Different implementations can use LSP protocol, CLI tools, or other mechanisms.
 */
export { BiomeClient } from "./biome-client.js";
export { LspLinterClient } from "./lsp-linter-client.js";
export { SwiftLintClient } from "./swiftlint-client.js";
/**
 * Get or create a linter client for a server configuration.
 * Uses the server's custom factory if provided, otherwise falls back to LSP.
 */
export declare function getLinterClient(serverName: string, config: ServerConfig, cwd: string): LinterClient;
/**
 * Clear all cached linter clients.
 */
export declare function clearLinterClientCache(): void;
