import type { SourceMeta } from "./types.js";
/**
 * A hook script.
 */
export interface Hook {
    /** Hook name (filename without extension) */
    name: string;
    /** Absolute path to hook file */
    path: string;
    /** Hook type (pre/post) and associated tool */
    type: "pre" | "post";
    /** Tool this hook applies to, or "*" for all */
    tool: string;
    /** Source level */
    level: "user" | "project";
    /** Source metadata */
    _source: SourceMeta;
}
export declare const hookCapability: import("./types.js").Capability<Hook>;
