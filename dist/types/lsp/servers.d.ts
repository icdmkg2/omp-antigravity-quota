import { type LspServerStatus } from "./client.js";
import { type LspConfig } from "./config.js";
import type { LspClient, ServerConfig } from "./types.js";
/**
 * LSP actions that do not mutate the workspace or language-server state.
 * Anything not in this set (rename, code_actions with apply, rename_file,
 * reload, raw request, etc.) is classified as write-tier.
 */
export declare const LSP_READONLY_ACTIONS: ReadonlySet<string>;
export interface LspStartupServerInfo {
    name: string;
    status: "connecting" | "ready" | "error" | "available";
    fileTypes: string[];
    error?: string;
}
/** Result from warming up LSP servers */
export interface LspWarmupResult {
    servers: Array<LspStartupServerInfo & {
        status: "ready" | "error";
    }>;
}
/** Options for warming up LSP servers */
export interface LspWarmupOptions {
    /** Called when starting to connect to servers */
    onConnecting?: (serverNames: string[]) => void;
}
export declare function discoverStartupLspServers(cwd: string, status?: LspStartupServerInfo["status"]): LspStartupServerInfo[];
/**
 * Warm up LSP servers for a directory by connecting to all detected servers.
 * This should be called at startup to avoid cold-start delays.
 *
 * @param cwd - Working directory to detect and start servers for
 * @param options - Optional callbacks for progress reporting
 * @returns Status of each server that was started
 */
export declare function warmupLspServers(cwd: string, options?: LspWarmupOptions): Promise<LspWarmupResult>;
/**
 * Get status of currently active LSP servers.
 */
export declare function getLspStatus(): LspServerStatus[];
/**
 * Sync in-memory file content to all applicable LSP servers.
 * Sends didOpen (if new) or didChange (if already open).
 *
 * @param absolutePath - Absolute path to the file
 * @param content - The new file content
 * @param cwd - Working directory for LSP config resolution
 * @param servers - Servers to sync to
 */
export declare function syncFileContent(absolutePath: string, content: string, cwd: string, servers: Array<[string, ServerConfig]>, signal?: AbortSignal, createMissing?: boolean): Promise<void>;
/**
 * Notify all LSP servers that a file was saved.
 * Assumes content was already synced via syncFileContent.
 *
 * @param absolutePath - Absolute path to the file
 * @param cwd - Working directory for LSP config resolution
 * @param servers - Servers to notify
 */
export declare function notifyFileSaved(absolutePath: string, cwd: string, servers: Array<[string, ServerConfig]>, signal?: AbortSignal, createMissing?: boolean): Promise<void>;
export declare const configCache: Map<string, LspConfig>;
export declare function getConfig(cwd: string): LspConfig;
export declare function splitServers(servers: Array<[string, ServerConfig]>): {
    lspServers: Array<[string, ServerConfig]>;
    customLinterServers: Array<[string, ServerConfig]>;
};
export declare function getLspServers(config: LspConfig): Array<[string, ServerConfig]>;
export declare function getLspServersForFile(config: LspConfig, filePath: string): Array<[string, ServerConfig]>;
export declare function getLspServerForFile(config: LspConfig, filePath: string): [string, ServerConfig] | null;
export declare function isProjectAwareLspServer(serverConfig: ServerConfig): boolean;
/** True when an LSP error indicates the server doesn't implement the requested method. */
export declare function isMethodNotFoundError(err: unknown): boolean;
/**
 * Build the params for the generic `workspace/didChangeConfiguration` reload.
 *
 * The handshake in `client.ts` pushes `{ settings: config.settings ?? {} }` right
 * after `initialized`, so a reload has to echo those same settings back. A bare
 * `{}` is well-formed LSP, but it means "the configuration is now empty" — the
 * opposite of a refresh. Servers that key behaviour off their configuration
 * (formatter options, analysis toggles, per-workspace overrides) silently drop it
 * and serve the rest of the session on defaults, so `lsp reload` ends up erasing
 * the configured settings instead of re-applying them (issue #8383).
 */
export declare function reloadConfigurationParams(config: ServerConfig): {
    settings: Record<string, unknown>;
};
export declare function reloadServer(client: LspClient, serverName: string, signal?: AbortSignal): Promise<string>;
