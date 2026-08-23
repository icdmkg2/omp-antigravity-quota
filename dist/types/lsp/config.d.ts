import { type WhichOptions } from "@oh-my-pi/pi-utils";
import type { ServerConfig } from "./types.js";
export interface LspConfig {
    servers: Record<string, ServerConfig>;
    /** Idle timeout in milliseconds. If set, LSP clients will be shutdown after this period of inactivity. Disabled by default. */
    idleTimeoutMs?: number;
}
/**
 * Check if any root marker file exists in the directory
 */
export declare function hasRootMarkers(cwd: string, markers: string[]): boolean;
/**
 * Check whether any ancestor directory of a file is an LSP project root.
 */
export declare function hasRootMarkerAncestor(filePath: string, markers: string[]): boolean;
/** Controls project-local and PATH executable lookup. */
export interface ResolveCommandOptions extends Pick<WhichOptions, "cache" | "PATH"> {
    /** Ordered project roots checked before PATH; defaults to the command cwd. */
    localRoots?: readonly string[];
}
/**
 * Resolve a command to an executable path.
 * Checks project-local bin directories first, then falls back to $PATH.
 *
 * @param command - The command name (e.g., "typescript-language-server")
 * @param cwd - Working directory to search from
 * @returns Absolute path to the executable, or null if not found
 */
export declare function resolveCommand(command: string, cwd: string, options?: ResolveCommandOptions): string | null;
/**
 * Load LSP configuration.
 *
 * Priority (highest to lowest):
 * 1. Project root: lsp.json/.lsp.json/lsp.yml/.lsp.yml/lsp.yaml/.lsp.yaml
 * 2. Project config dirs: .omp/lsp.*, .pi/lsp.*, .claude/lsp.* (+ hidden variants)
 * 3. User config dirs: ~/.omp/agent/lsp.*, ~/.pi/agent/lsp.*, ~/.claude/lsp.* (+ hidden variants)
 * 4. User home root: ~/lsp.*, ~/.lsp.*
 * 5. Auto-detect from project markers + available binaries
 *
 * Config files are merged from lowest to highest priority; later files override earlier settings.
 *
 * Config file format (JSON or YAML):
 * ```json
 * {
 *   "servers": {
 *     "typescript-language-server": {
 *       "command": "typescript-language-server",
 *       "args": ["--stdio", "--log-level", "4"],
 *       "disabled": false
 *     },
 *     "my-custom-server": {
 *       "command": "/path/to/server",
 *       "args": ["--stdio"],
 *       "fileTypes": [".xyz"],
 *       "languageId": "xyz",
 *       "rootMarkers": [".xyz-project"]
 *     }
 *   }
 * }
 * ```
 */
export declare function loadConfig(cwd: string): LspConfig;
/**
 * Find all servers that can handle a file based on extension.
 * Returns servers sorted with primary (non-linter) servers first.
 */
export declare function getServersForFile(config: LspConfig, filePath: string): Array<[string, ServerConfig]>;
/**
 * Find the primary server for a file (prefers type-checkers over linters).
 * Used for operations like definition, hover, references that need type intelligence.
 */
export declare function getServerForFile(config: LspConfig, filePath: string): [string, ServerConfig] | null;
/**
 * Check if a server has a specific capability
 */
export declare function hasCapability(config: ServerConfig, capability: keyof NonNullable<ServerConfig["capabilities"]>): boolean;
