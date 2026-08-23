import type { MCPGetPromptResult, MCPPrompt, MCPRequestOptions, MCPResource, MCPResourceReadResult, MCPResourceTemplate, MCPServerCapabilities, MCPServerConfig, MCPServerConnection, MCPToolCallResult, MCPToolDefinition } from "./types.js";
/**
 * Connect to an MCP server.
 * Has a 30 second timeout by default to prevent blocking startup.
 * Set OMP_MCP_TIMEOUT_MS=0 to disable MCP client-side timeouts.
 */
export declare function connectToServer(name: string, config: MCPServerConfig, options?: {
    signal?: AbortSignal;
    onNotification?: (method: string, params: unknown) => void;
    onRequest?: (method: string, params: unknown) => Promise<unknown>;
}): Promise<MCPServerConnection>;
/**
 * List tools from a connected server.
 */
export declare function listTools(connection: MCPServerConnection, options?: {
    signal?: AbortSignal;
}): Promise<MCPToolDefinition[]>;
/**
 * Call a tool on a connected server.
 */
export declare function callTool(connection: MCPServerConnection, toolName: string, args?: Record<string, unknown>, options?: MCPRequestOptions): Promise<MCPToolCallResult>;
/**
 * Disconnect from a server.
 */
export declare function disconnectServer(connection: MCPServerConnection): Promise<void>;
/**
 * Check if a server supports tools.
 */
export declare function serverSupportsTools(capabilities: MCPServerCapabilities): boolean;
/**
 * List resources from a connected server.
 */
export declare function listResources(connection: MCPServerConnection, options?: {
    signal?: AbortSignal;
}): Promise<MCPResource[]>;
/**
 * List resource templates from a connected server.
 *
 * A server MAY advertise the `resources` capability without implementing the
 * optional `resources/templates/list` method (it is optional in the MCP spec).
 * Such servers reject the request with JSON-RPC -32601 ("Method not found").
 * Treat that as "no templates" and return `[]` rather than throwing — otherwise
 * a caller that loads resources and templates together (see `MCPManager`'s
 * `Promise.all([listResources, listResourceTemplates])`) would discard the
 * server's concrete resources too. Any other error still propagates.
 */
export declare function listResourceTemplates(connection: MCPServerConnection, options?: {
    signal?: AbortSignal;
}): Promise<MCPResourceTemplate[]>;
/**
 * Read a resource from a connected server.
 */
export declare function readResource(connection: MCPServerConnection, uri: string, options?: MCPRequestOptions): Promise<MCPResourceReadResult>;
/**
 * Subscribe to resource update notifications.
 */
export declare function subscribeToResources(connection: MCPServerConnection, uris: string[], options?: MCPRequestOptions): Promise<void>;
/**
 * Unsubscribe from resource update notifications.
 */
export declare function unsubscribeFromResources(connection: MCPServerConnection, uris: string[], options?: MCPRequestOptions): Promise<void>;
/**
 * Check if a server supports resource subscriptions.
 */
export declare function serverSupportsResourceSubscriptions(capabilities: MCPServerCapabilities): boolean;
/**
 * Check if a server supports resources.
 */
export declare function serverSupportsResources(capabilities: MCPServerCapabilities): boolean;
/**
 * List prompts from a connected server.
 */
export declare function listPrompts(connection: MCPServerConnection, options?: {
    signal?: AbortSignal;
}): Promise<MCPPrompt[]>;
/**
 * Get a specific prompt from a connected server.
 */
export declare function getPrompt(connection: MCPServerConnection, name: string, args?: Record<string, string>, options?: MCPRequestOptions): Promise<MCPGetPromptResult>;
/**
 * Check if a server supports prompts.
 */
export declare function serverSupportsPrompts(capabilities: MCPServerCapabilities): boolean;
