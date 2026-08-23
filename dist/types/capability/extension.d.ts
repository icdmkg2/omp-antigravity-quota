import type { MCPServer } from "./mcp.js";
import type { SourceMeta } from "./types.js";
/**
 * Extension manifest structure.
 */
export interface ExtensionManifest {
    name?: string;
    description?: string;
    mcpServers?: Record<string, Omit<MCPServer, "name" | "_source">>;
    tools?: unknown[];
    context?: unknown;
}
/**
 * A loaded extension.
 */
export interface Extension {
    /** Extension name (from manifest.name or directory name) */
    name: string;
    /** Absolute path to extension directory */
    path: string;
    /** Parsed manifest data */
    manifest: ExtensionManifest;
    /** Source level */
    level: "user" | "project";
    /** Source metadata */
    _source: SourceMeta;
}
export declare const extensionCapability: import("./types.js").Capability<Extension>;
