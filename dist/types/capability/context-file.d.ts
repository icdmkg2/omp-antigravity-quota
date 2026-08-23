import type { SourceMeta } from "./types.js";
/**
 * A context file that provides persistent instructions to the agent.
 */
export interface ContextFile {
    /** Absolute path to the file */
    path: string;
    /** File content */
    content: string;
    /** Which level this came from */
    level: "user" | "project";
    /** Distance from cwd (0 = in cwd, 1 = parent, etc.) for project files */
    depth?: number;
    /** Source metadata */
    _source: SourceMeta;
}
export declare const contextFileCapability: import("./types.js").Capability<ContextFile>;
