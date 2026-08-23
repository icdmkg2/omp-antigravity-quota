/**
 * HTTP header precedence and redirect-origin policy for remote MCP transports.
 *
 * Two invariants, applied at every transport fetch:
 *
 * 1. Client-generated headers (protocol headers like `Content-Type`, `Accept`,
 *    `Mcp-Session-Id`, and authorization) take precedence over configured
 *    headers with the same case-insensitive name. Configured headers can never
 *    corrupt the MCP wire protocol via casing tricks.
 * 2. Origin-locked servers (Agent Plugins §7.2.1) never forward configured
 *    headers to a different origin: redirects are followed manually and
 *    configured headers are attached only when the hop targets the configured
 *    origin. Method-changing redirects of non-GET requests are refused.
 */
/** Header buckets for one MCP HTTP request. */
interface MCPHeaderSources {
    /** Client-generated HTTP/MCP/authorization headers; win case-insensitively. */
    generated: Record<string, string>;
    /** Configured headers from the server entry (package or user config). */
    configured?: Record<string, string>;
}
/**
 * Merge configured headers under client-generated ones: a configured entry is
 * dropped when a generated header with the same case-insensitive name exists.
 */
export declare function mergeMCPHeaders({ generated, configured }: MCPHeaderSources): Record<string, string>;
/**
 * Set a client-generated header, removing any existing entry with the same
 * case-insensitive name so the generated value is the only one sent.
 */
export declare function setGeneratedHeader(headers: Record<string, string>, name: string, value: string): void;
/**
 * Return `headers` without any entry whose name case-insensitively matches
 * `name`. Used to keep transport-reserved protocol headers (e.g.
 * `MCP-Protocol-Version`) out of user-configured headers so config can never
 * inject them. Returns the original reference when there is nothing to strip,
 * so the common (no-match) path allocates nothing.
 */
export declare function withoutHeader(headers: Record<string, string> | undefined, name: string): Record<string, string> | undefined;
export interface MCPFetchInit {
    method: "GET" | "POST" | "DELETE";
    body?: string;
    signal?: AbortSignal;
}
/**
 * Fetch an MCP endpoint with header precedence and, for origin-locked servers,
 * manual redirect handling that strips configured headers on cross-origin hops.
 *
 * Non-locked servers keep the platform default redirect behavior. Locked
 * non-GET requests only follow 307/308 (method-preserving); a 301/302/303
 * redirect of a JSON-RPC POST is a connection error, never a silent GET.
 */
export declare function mcpFetch(url: string, init: MCPFetchInit, sources: MCPHeaderSources, originLocked: boolean): Promise<Response>;
export {};
