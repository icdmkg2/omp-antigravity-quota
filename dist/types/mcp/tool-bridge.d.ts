/**
 * MCP to CustomTool bridge.
 *
 * Converts MCP tool definitions to CustomTool format for the agent.
 */
import type { AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { TSchema } from "@oh-my-pi/pi-ai";
import type { SourceMeta } from "../capability/types.js";
import type { CustomTool, CustomToolContext, CustomToolResult, RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import type { OutputMeta } from "../tools/output-meta.js";
import type { MCPAuthChallenge, MCPContent, MCPServerConnection, MCPToolDefinition } from "./types.js";
/** Reconnect callback: tears down a stale connection, optionally authorizing first. */
export type MCPReconnect = (options?: {
    authChallenge?: MCPAuthChallenge;
}) => Promise<MCPServerConnection | null>;
export declare function isRetriableConnectionError(error: unknown): boolean;
/** Details included in MCP tool results for rendering */
export interface MCPToolDetails {
    /** Server name */
    serverName: string;
    /** Original MCP tool name */
    mcpToolName: string;
    /** Whether the call resulted in an error */
    isError?: boolean;
    /** Raw content from MCP response */
    rawContent?: MCPContent[];
    /** Structured metadata from the MCP response */
    mcpMeta?: Record<string, unknown>;
    /** Provider ID (e.g., "claude", "mcp-json") */
    provider?: string;
    /** Provider display name (e.g., "Claude Code", "MCP Config") */
    providerName?: string;
    /** Structured output metadata (set by the spill wrapper when output is truncated to an artifact). */
    meta?: OutputMeta;
}
export declare function createMCPToolName(serverName: string, toolName: string): string;
export interface MCPToolOriginSource {
    readonly name: string;
    readonly mcpServerName?: unknown;
    readonly mcpToolName?: unknown;
}
/** Stable identity for a tool's original MCP route, before its public name was normalized. */
export declare function getMCPToolOriginKey(tool: MCPToolOriginSource): string | undefined;
/**
 * Keeps one MCP tool per minted name and logs collisions between distinct MCP
 * origins. The winner is chosen by a stable origin key (server name + original
 * tool name), NOT array order: MCPManager re-appends a reconnecting server's
 * tools, so insertion order is mutable across reconnects and first-wins would
 * silently flip ownership of the minted name. Non-MCP tools pass through
 * unchanged.
 */
export declare function deduplicateMCPToolsByName<T extends MCPToolOriginSource>(tools: readonly T[]): T[];
/**
 * Parse an MCP tool name back to server and tool components.
 *
 * Note: This returns the normalized tool name (with server prefix stripped).
 * The original MCP tool name may have had the server name as a prefix.
 */
export declare function parseMCPToolName(name: string): {
    serverName: string;
    toolName: string;
} | null;
/**
 * CustomTool wrapping an MCP tool with an active connection.
 */
export declare class MCPTool implements CustomTool<TSchema, MCPToolDetails> {
    private connection;
    private readonly tool;
    private readonly reconnect?;
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly parameters: TSchema;
    /** Original MCP tool name (before normalization) */
    readonly mcpToolName: string;
    /** Server name */
    readonly mcpServerName: string;
    readonly approval: "write";
    /** Render completed MCP calls with the result header replacing the pending call header. */
    readonly mergeCallAndResult = true;
    /**
     * MCP-backed tools opt out of strict structured-output grammar. The server
     * owns validation, and strict mode makes OpenAI-family models over-fill
     * mutually exclusive optional fields (#4336/#4340). Serializers preserve an
     * explicit `false`; an omitted flag would leave nothing to preserve.
     */
    readonly strict: false;
    /** Create MCPTool instances for all tools from an MCP server connection */
    static fromTools(connection: MCPServerConnection, tools: MCPToolDefinition[], reconnect?: MCPReconnect): MCPTool[];
    constructor(connection: MCPServerConnection, tool: MCPToolDefinition, reconnect?: MCPReconnect | undefined);
    renderCall(args: unknown, _options: RenderResultOptions, theme: Theme): import("@oh-my-pi/pi-tui").Component;
    renderResult(result: CustomToolResult<MCPToolDetails>, options: RenderResultOptions, theme: Theme, args?: unknown): import("@oh-my-pi/pi-tui").Component;
    execute(_toolCallId: string, params: unknown, _onUpdate: AgentToolUpdateCallback<MCPToolDetails> | undefined, _ctx: CustomToolContext, signal?: AbortSignal): Promise<CustomToolResult<MCPToolDetails>>;
}
/**
 * CustomTool wrapping an MCP tool with deferred connection resolution.
 */
export declare class DeferredMCPTool implements CustomTool<TSchema, MCPToolDetails> {
    #private;
    private readonly serverName;
    private readonly tool;
    private readonly getConnection;
    private readonly reconnect?;
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly parameters: TSchema;
    /** Original MCP tool name (before normalization) */
    readonly mcpToolName: string;
    /** Server name */
    readonly mcpServerName: string;
    readonly approval: "write";
    /** Render completed MCP calls with the result header replacing the pending call header. */
    readonly mergeCallAndResult = true;
    /** See {@link MCPTool.strict}: MCP servers own validation, so stay non-strict. */
    readonly strict: false;
    /** Create DeferredMCPTool instances for all tools from an MCP server */
    static fromTools(serverName: string, tools: MCPToolDefinition[], getConnection: () => Promise<MCPServerConnection>, source?: SourceMeta, reconnect?: MCPReconnect): DeferredMCPTool[];
    constructor(serverName: string, tool: MCPToolDefinition, getConnection: () => Promise<MCPServerConnection>, source?: SourceMeta, reconnect?: MCPReconnect | undefined);
    renderCall(args: unknown, _options: RenderResultOptions, theme: Theme): import("@oh-my-pi/pi-tui").Component;
    renderResult(result: CustomToolResult<MCPToolDetails>, options: RenderResultOptions, theme: Theme, args?: unknown): import("@oh-my-pi/pi-tui").Component;
    execute(_toolCallId: string, params: unknown, _onUpdate: AgentToolUpdateCallback<MCPToolDetails> | undefined, _ctx: CustomToolContext, signal?: AbortSignal): Promise<CustomToolResult<MCPToolDetails>>;
}
