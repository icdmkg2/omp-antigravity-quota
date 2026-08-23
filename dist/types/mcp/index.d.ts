/**
 * MCP (Model Context Protocol) support.
 *
 * Provides per-project .mcp.json configuration for connecting to
 * MCP servers via stdio or HTTP transports.
 */
export * from "./client.js";
export * from "./config.js";
export * from "./config-writer.js";
export { callMCP, parseSSE } from "./json-rpc.js";
export * from "./loader.js";
export * from "./manager.js";
export * from "./oauth-discovery.js";
export * from "./tool-bridge.js";
export * from "./tool-cache.js";
export * from "./transports/http.js";
export * from "./transports/stdio.js";
export * from "./types.js";
