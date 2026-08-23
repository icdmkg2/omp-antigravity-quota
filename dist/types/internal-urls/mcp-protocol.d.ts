import type { InternalResource, InternalUrl, ProtocolHandler } from "./types.js";
/**
 * Protocol handler for MCP resources.
 *
 * URL forms:
 * - mcp://<resource-uri> (e.g. mcp://test://notes, mcp://ibkr://portfolio/positions)
 * - A resource's native URI when its scheme has no OMP handler (e.g. ags://capabilities/current-host)
 */
export declare class McpProtocolHandler implements ProtocolHandler {
    readonly scheme = "mcp";
    readonly immutable = true;
    resolve(url: InternalUrl): Promise<InternalResource>;
}
