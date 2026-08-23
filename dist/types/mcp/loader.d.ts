import type { LoadedCustomTool } from "../extensibility/custom-tools/types.js";
import { AgentStorage } from "../session/agent-storage.js";
import type { AuthStorage } from "../session/auth-storage.js";
import { MCPManager } from "./manager.js";
import type { McpConnectionStatusEvent } from "./startup-events.js";
/** Result from loading MCP tools */
export interface MCPToolsLoadResult {
    /** MCP manager (for lifecycle management) */
    manager: MCPManager;
    /** Loaded tools as LoadedCustomTool format */
    tools: LoadedCustomTool[];
    /** Errors keyed by server name */
    errors: Array<{
        path: string;
        error: string;
    }>;
    /** Connected server names */
    connectedServers: string[];
    /** Extracted Exa API keys from filtered MCP servers */
    exaApiKeys: string[];
}
/** Options for loading MCP tools */
export interface MCPToolsLoadOptions {
    /** Called when MCP server connection state changes. */
    onStatus?: (event: McpConnectionStatusEvent) => void;
    /** Whether to load project-level config (default: true) */
    enableProjectConfig?: boolean;
    /** Whether to filter out Exa MCP servers (default: true) */
    filterExa?: boolean;
    /** Whether to filter out browser MCP servers when builtin browser tool is enabled (default: false) */
    filterBrowser?: boolean;
    /** SQLite storage for MCP tool cache (null disables cache) */
    cacheStorage?: AgentStorage | null;
    /** Auth storage used to resolve OAuth credentials before initial MCP connect */
    authStorage?: AuthStorage;
}
/**
 * Discover and load MCP tools from .mcp.json files.
 *
 * @param cwd Working directory (project root)
 * @param options Load options including progress callbacks
 * @returns MCP tools in LoadedCustomTool format for integration
 */
export declare function discoverAndLoadMCPTools(cwd: string, options?: MCPToolsLoadOptions): Promise<MCPToolsLoadResult>;
