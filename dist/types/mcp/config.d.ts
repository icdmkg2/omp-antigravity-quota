/**
 * MCP configuration loader.
 *
 * Uses the capability system to load MCP servers from multiple sources.
 */
import type { SourceMeta } from "../capability/types.js";
import type { MCPServerConfig } from "./types.js";
/** Options for loading MCP configs */
export interface LoadMCPConfigsOptions {
    /** Whether to load project-level config (default: true) */
    enableProjectConfig?: boolean;
    /** Whether to filter out Exa MCP servers (default: true) */
    filterExa?: boolean;
    /** Whether to filter out browser MCP servers when builtin browser tool is enabled (default: false) */
    filterBrowser?: boolean;
}
/** Result of loading MCP configs */
export interface LoadMCPConfigsResult {
    /** Loaded server configs */
    configs: Record<string, MCPServerConfig>;
    /** Extracted Exa API keys (if any were filtered) */
    exaApiKeys: string[];
    /** Source metadata for each server */
    sources: Record<string, SourceMeta>;
}
/**
 * Load all MCP server configs from standard locations.
 * Uses the capability system for multi-source discovery.
 *
 * @param cwd Working directory (project root)
 * @param options Load options
 */
export declare function loadAllMCPConfigs(cwd: string, options?: LoadMCPConfigsOptions): Promise<LoadMCPConfigsResult>;
/**
 * Check if a server config is an Exa MCP server.
 */
export declare function isExaMCPServer(name: string, config: MCPServerConfig): boolean;
/**
 * Extract Exa API key from an MCP server config.
 */
export declare function extractExaApiKey(config: MCPServerConfig): string | undefined;
/** Result of filtering Exa MCP servers */
export interface ExaFilterResult {
    /** Configs with Exa servers removed */
    configs: Record<string, MCPServerConfig>;
    /** Extracted Exa API keys (if any) */
    exaApiKeys: string[];
    /** Source metadata for remaining servers */
    sources: Record<string, SourceMeta>;
}
/**
 * Filter out Exa MCP servers and extract their API keys.
 * Since we have native Exa integration, we don't need the MCP server —
 * unless the config explicitly requests Exa tools the native integration
 * does not provide (e.g. `web_fetch_exa`, `web_search_advanced_exa`).
 */
export declare function filterExaMCPServers(configs: Record<string, MCPServerConfig>, sources: Record<string, SourceMeta>): ExaFilterResult;
/**
 * Validate server config has required fields.
 */
export declare function validateServerConfig(name: string, config: MCPServerConfig): string[];
/**
 * Check if a server config is a browser automation MCP server.
 */
export declare function isBrowserMCPServer(name: string, config: MCPServerConfig): boolean;
/** Result of filtering browser MCP servers */
export interface BrowserFilterResult {
    /** Configs with browser servers removed */
    configs: Record<string, MCPServerConfig>;
    /** Source metadata for remaining servers */
    sources: Record<string, SourceMeta>;
}
/**
 * Filter out browser automation MCP servers.
 * Since we have a native browser tool, we don't need these MCP servers.
 */
export declare function filterBrowserMCPServers(configs: Record<string, MCPServerConfig>, sources: Record<string, SourceMeta>): BrowserFilterResult;
