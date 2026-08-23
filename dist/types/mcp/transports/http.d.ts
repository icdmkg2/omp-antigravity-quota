import type { MCPHttpServerConfig, MCPRequestOptions, MCPSseServerConfig, MCPTransport } from "../../mcp/types.js";
/**
 * Best-effort startup deadline for the optional Streamable HTTP GET SSE listener.
 *
 * Returns `0` (disabled) when the operator has explicitly disabled MCP client-side
 * timeouts via `timeout: 0` or `OMP_MCP_TIMEOUT_MS=0`, mirroring the rest of the
 * MCP timeout surface. Otherwise caps the wait at one second and scales below
 * short request timeouts so connect-time never exceeds the request budget.
 */
export declare function resolveSSEConnectTimeoutMs(configTimeout?: number): number;
/**
 * HTTP transport for MCP servers.
 * Uses POST for requests, supports SSE responses.
 */
export declare class HttpTransport implements MCPTransport {
    #private;
    private config;
    onClose?: () => void;
    onError?: (error: Error) => void;
    onNotification?: (method: string, params: unknown) => void;
    onRequest?: (method: string, params: unknown) => Promise<unknown>;
    /** Called on 401/403 to attempt token refresh. Returns updated headers or null. */
    onAuthError?: () => Promise<Record<string, string> | null>;
    constructor(config: MCPHttpServerConfig | MCPSseServerConfig);
    /** Record the protocol version negotiated during `initialize`. */
    setProtocolVersion(version: string): void;
    get connected(): boolean;
    get url(): string;
    /**
     * Mark transport as connected.
     * HTTP doesn't need persistent connection, but we track state.
     */
    connect(): Promise<void>;
    /**
     * Start SSE listener for server-initiated messages.
     * Resolves once the SSE connection is established (or fails/unsupported).
     * Message reading continues in the background.
     */
    startSSEListener(): Promise<void>;
    request<T = unknown>(method: string, params?: Record<string, unknown>, options?: MCPRequestOptions): Promise<T>;
    notify(method: string, params?: Record<string, unknown>): Promise<void>;
    close(): Promise<void>;
}
/**
 * Create and connect an HTTP transport.
 */
export declare function createHttpTransport(config: MCPHttpServerConfig | MCPSseServerConfig): Promise<HttpTransport>;
