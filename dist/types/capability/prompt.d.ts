import type { SourceMeta } from "./types.js";
/**
 * A reusable prompt template.
 */
export interface Prompt {
    /** Prompt name (filename without extension) */
    name: string;
    /** Absolute path to prompt file */
    path: string;
    /** Prompt content (markdown) */
    content: string;
    /** Source metadata */
    _source: SourceMeta;
}
export declare const promptCapability: import("./types.js").Capability<Prompt>;
