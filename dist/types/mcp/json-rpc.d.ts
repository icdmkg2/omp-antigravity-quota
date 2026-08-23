/**
 * Redact credential-bearing query params (e.g. `exaApiKey`) so failed
 * requests never write secrets to the persistent log file.
 */
export declare function redactUrlForLog(url: string): string;
/** Parse SSE response format (lines starting with "data: ") */
export declare function parseSSE(text: string): unknown;
/** JSON-RPC 2.0 response structure */
export interface JsonRpcResponse<T = unknown> {
    jsonrpc: "2.0";
    id: string | number;
    result?: T;
    error?: {
        code: number;
        message: string;
        data?: unknown;
    };
}
/** Options controlling a single MCP JSON-RPC HTTP request. */
export interface CallMcpOptions {
    signal?: AbortSignal;
}
/**
 * Call an MCP server with JSON-RPC 2.0 over HTTPS.
 *
 * @param url - Full MCP server URL (including any query parameters)
 * @param method - JSON-RPC method name (e.g., "tools/list", "tools/call")
 * @param params - Method parameters
 * @param options - Optional transport controls such as cancellation.
 * @returns Parsed JSON-RPC response
 */
export declare function callMCP<T = unknown>(url: string, method: string, params?: Record<string, unknown>, options?: CallMcpOptions): Promise<JsonRpcResponse<T>>;
