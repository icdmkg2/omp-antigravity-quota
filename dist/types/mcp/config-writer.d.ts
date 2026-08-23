import { type MCPConfigFile, type MCPServerConfig } from "./types.js";
/**
 * Read an MCP config file.
 * Returns empty config if file doesn't exist.
 */
export declare function readMCPConfigFile(filePath: string): Promise<MCPConfigFile>;
/**
 * Write an MCP config file atomically.
 * Creates parent directories if they don't exist.
 */
export declare function writeMCPConfigFile(filePath: string, config: MCPConfigFile): Promise<void>;
/**
 * Validate server name.
 * @returns Error message if invalid, undefined if valid
 */
export declare function validateServerName(name: string): string | undefined;
/**
 * Add an MCP server to a config file.
 * Validates the config before writing.
 *
 * @throws Error if server name already exists or validation fails
 */
export declare function addMCPServer(filePath: string, name: string, config: MCPServerConfig): Promise<void>;
/**
 * Update an existing MCP server in a config file.
 * If the server doesn't exist, this will add it.
 *
 * @throws Error if validation fails
 */
export declare function updateMCPServer(filePath: string, name: string, config: MCPServerConfig): Promise<void>;
/**
 * Remove an MCP server from a config file.
 *
 * @throws Error if server doesn't exist
 */
export declare function removeMCPServer(filePath: string, name: string): Promise<void>;
/**
 * Get a specific server config from a file.
 * Returns undefined if server doesn't exist.
 */
export declare function getMCPServer(filePath: string, name: string): Promise<MCPServerConfig | undefined>;
/**
 * List all server names in a config file.
 */
export declare function listMCPServers(filePath: string): Promise<string[]>;
/**
 * Read the disabled servers list from a config file.
 */
export declare function readDisabledServers(filePath: string): Promise<string[]>;
/**
 * Add or remove a server name from the disabled servers list.
 */
export declare function setServerDisabled(filePath: string, name: string, disabled: boolean): Promise<void>;
/**
 * Read the user-level force-enable list (allowlist that overrides a
 * non-writable source config's `enabled: false`).
 */
export declare function readEnabledServers(filePath: string): Promise<string[]>;
/**
 * Add or remove a server name from the user-level force-enable list.
 * The list overrides a discovered server's `enabled: false` flag but does
 * NOT override the `disabledServers` denylist.
 */
export declare function setServerForceEnabled(filePath: string, name: string, force: boolean): Promise<void>;
/** Paths and target state for toggling one MCP server across known config files. */
export interface SetMcpServerEnabledOptions {
    userPath: string;
    projectPath: string;
    /**
     * Absolute path to the loaded row's source mcp.json. Provide ONLY for
     * formats this codebase owns (native `.omp/mcp.json` and `mcp-json`
     * `mcp.json`/`.mcp.json`). Tool-owned configs (opencode.json, claude.json,
     * settings.json …) MUST be omitted; we never mutate another tool's file.
     */
    sourcePath?: string;
    name: string;
    enabled: boolean;
}
/**
 * Flip a server's enabled/disabled state regardless of where it lives.
 *
 * Resolution order, mirroring `/mcp enable` / `/mcp disable` plus the dashboard
 * fix for non-writable source configs:
 *
 * - Server found in `sourcePath` (writable) → write `enabled` on that entry.
 * - Else server in project mcp.json → write `enabled` there.
 * - Else server in user mcp.json → write `enabled` there.
 * - Else (server defined in a tool-owned source like opencode.json, OR a
 *   purely discovered server):
 *   - Disable → add to the user-level `disabledServers` denylist.
 *   - Enable → add to the user-level `enabledServers` allowlist so the
 *     dashboard / runtime override the non-writable source's
 *     `enabled: false` flag.
 *
 * Cleanup invariants — on every call:
 * - Re-enable clears any stale denylist entry so a server disabled via
 *   `/mcp disable` and re-enabled here doesn't stay suppressed.
 * - Disable clears any stale allowlist entry so re-disabling a
 *   force-enabled server actually takes effect.
 */
export declare function setMcpServerEnabled(options: SetMcpServerEnabledOptions): Promise<void>;
