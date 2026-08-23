import type { MCPRequestOptions, MCPSseServerConfig, MCPTransport } from "../../mcp/types.js";
/** Legacy MCP HTTP+SSE transport from protocol revision 2024-11-05. */
export declare class LegacySseTransport implements MCPTransport {
    #private;
    onClose?: () => void;
    onError?: (error: Error) => void;
    onNotification?: (method: string, params: unknown) => void;
    onRequest?: (method: string, params: unknown) => Promise<unknown>;
    /** Called on 401/403 to attempt token refresh. Returns updated headers or null. */
    onAuthError?: () => Promise<Record<string, string> | null>;
    constructor(config: MCPSseServerConfig);
    get connected(): boolean;
    get url(): string;
    connect(): Promise<void>;
    request<T = unknown>(method: string, params?: Record<string, unknown>, options?: MCPRequestOptions): Promise<T>;
    notify(method: string, params?: Record<string, unknown>): Promise<void>;
    close(): Promise<void>;
}
/** Create and connect a legacy HTTP+SSE transport. */
export declare function createSseTransport(config: MCPSseServerConfig): Promise<LegacySseTransport>;
