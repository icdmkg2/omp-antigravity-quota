export declare const MCP_CONNECTION_STATUS_EVENT_CHANNEL = "mcp:connection-status";
export type McpConnectionFailure = {
    serverName: string;
    error: string;
    sourcePath?: string;
};
export type McpConnectionStatusEvent = {
    type: "connecting";
    serverNames: string[];
} | {
    type: "connected";
    serverName: string;
} | ({
    type: "failed";
} & McpConnectionFailure);
export type McpConnectionStatusSnapshot = {
    pendingServers: readonly string[];
    connectedServers: readonly string[];
    failedServers: readonly McpConnectionFailure[];
};
export declare function formatMCPConnectingMessage(serverNames: readonly string[]): string;
export declare function formatMCPConnectionStatusMessage(snapshot: McpConnectionStatusSnapshot): string;
/**
 * Runtime validator for the cross-module event payload. The event bus is
 * untyped at runtime, so the subscriber verifies the shape before formatting
 * rather than trusting a cast — a malformed emit is ignored instead of throwing.
 */
export declare function isMcpConnectionStatusEvent(data: unknown): data is McpConnectionStatusEvent;
