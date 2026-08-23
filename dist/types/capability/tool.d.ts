import type { SourceMeta } from "./types.js";
/**
 * A custom tool definition.
 */
export interface CustomTool {
    /** Tool name (unique key) */
    name: string;
    /** Absolute path to tool definition file */
    path: string;
    /** Tool description */
    description: string;
    /** Tool implementation (script path or inline) */
    implementation?: string;
    /** Source level */
    level: "user" | "project";
    /** Source metadata */
    _source: SourceMeta;
}
export declare const toolCapability: import("./types.js").Capability<CustomTool>;
