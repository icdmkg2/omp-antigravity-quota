import type { TSchema } from "@oh-my-pi/pi-ai";
import type { CustomTool, CustomToolResult } from "../extensibility/custom-tools/types.js";
import { type CallMcpOptions } from "../mcp/json-rpc.js";
import type { ExaSearchResponse, MCPTool, MCPToolWrapperConfig } from "./types.js";
type MCPWrappedToolDetails = {
    response?: ExaSearchResponse;
    error?: string;
    toolName?: string;
    raw?: unknown;
};
/** Find EXA_API_KEY from Bun.env or .env files */
export declare function findApiKey(): string | null;
/** Fetch available tools from Exa MCP */
export declare function fetchExaTools(apiKey: string | null, toolNames: string[]): Promise<MCPTool[]>;
/** Fetch available tools from Websets MCP */
export declare function fetchWebsetsTools(apiKey: string): Promise<MCPTool[]>;
/** Call a tool on Exa MCP (simplified: toolName as first arg for easier use) */
export declare function callExaTool(toolName: string, args: Record<string, unknown>, apiKey: string | null, options?: CallMcpOptions): Promise<unknown>;
/** Call a tool on Websets MCP */
export declare function callWebsetsTool(apiKey: string, toolName: string, args: Record<string, unknown>): Promise<unknown>;
/** Format search results for LLM */
export declare function formatSearchResults(data: ExaSearchResponse): string;
/**
 * Format a non-search MCP response as human-readable text.
 * Handles objects, arrays, primitives, and common MCP response shapes.
 */
export declare function formatGenericResponse(data: unknown): string;
/** Check if result is a search response */
export declare function isSearchResponse(data: unknown): data is ExaSearchResponse;
/** Fetch and cache MCP tool schema */
export declare function fetchMCPToolSchema(apiKey: string, mcpToolName: string, isWebsetsTool?: boolean): Promise<MCPTool | null>;
/**
 * CustomTool dynamically created from MCP tool metadata.
 *
 * This allows tools to be generated from MCP server schemas without hardcoding,
 * reducing drift when MCP servers add new parameters.
 */
export declare class MCPWrappedTool implements CustomTool<TSchema, MCPWrappedToolDetails> {
    private readonly config;
    readonly parameters: TSchema;
    readonly description: string;
    readonly name: string;
    readonly label: string;
    constructor(config: MCPToolWrapperConfig, parameters: TSchema, description: string);
    execute(_toolCallId: string, params: unknown, _onUpdate?: unknown, _ctx?: unknown, _signal?: AbortSignal): Promise<CustomToolResult<MCPWrappedToolDetails>>;
}
/**
 * Create a CustomTool by fetching schema from MCP server.
 *
 * Falls back to provided fallback schema if MCP fetch fails.
 */
export declare function createMCPToolFromServer(apiKey: string, config: MCPToolWrapperConfig, fallbackSchema: TSchema, fallbackDescription: string): Promise<MCPWrappedTool>;
export {};
