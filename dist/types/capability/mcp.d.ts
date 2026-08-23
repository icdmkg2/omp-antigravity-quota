/**
 * MCP (Model Context Protocol) Servers Capability
 *
 * Canonical shape for MCP server configurations, regardless of source format.
 * All providers translate their native format to this shape.
 */
import type { MCPRequestIdFormat } from "../mcp/types.js";
import type { SourceMeta } from "./types.js";
/**
 * Canonical MCP server configuration.
 */
export interface MCPServer {
    /** Server name (unique key) */
    name: string;
    /** Whether this server is enabled (default: true) */
    enabled?: boolean;
    /** Connection timeout in milliseconds */
    timeout?: number;
    /** Encoding for outgoing JSON-RPC request ids (default: `"number"`) */
    requestIdFormat?: MCPRequestIdFormat;
    /** Command to run (for stdio transport) */
    command?: string;
    /** Command arguments */
    args?: string[];
    /** Environment variables */
    env?: Record<string, string>;
    /**
     * `literal`: env values are opaque plugin package data (Agent Plugins
     * §§4.1/9.2) — exempt from env-name lookup and `!command` resolution.
     */
    envPolicy?: "literal";
    /** Working directory for stdio transport */
    cwd?: string;
    /** URL (for HTTP/SSE transport) */
    url?: string;
    /** HTTP headers (for HTTP transport) */
    headers?: Record<string, string>;
    /**
     * `origin-locked`: configured headers are literal package data pinned to the
     * configured URL's origin (Agent Plugins §7.2.1) — never expanded, never
     * forwarded cross-origin, and client-generated headers win case-insensitively.
     */
    headerPolicy?: "origin-locked";
    /** Authentication configuration */
    auth?: {
        type: "oauth" | "apikey";
        credentialId?: string;
        tokenUrl?: string;
        clientId?: string;
        clientSecret?: string;
        resource?: string;
    };
    /** OAuth configuration (clientId, clientSecret, redirectUri, callbackPort, callbackPath, prompt) for servers requiring explicit client credentials */
    oauth?: {
        clientId?: string;
        clientSecret?: string;
        redirectUri?: string;
        callbackPort?: number;
        callbackPath?: string;
        prompt?: string;
    };
    /** Transport type */
    transport?: "stdio" | "sse" | "http";
    /** Source metadata (added by loader) */
    _source: SourceMeta;
}
export declare const mcpCapability: import("./types.js").Capability<MCPServer>;
