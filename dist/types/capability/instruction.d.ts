import type { SourceMeta } from "./types.js";
/**
 * An instruction with optional file pattern matching.
 */
export interface Instruction {
    /** Instruction name (derived from filename) */
    name: string;
    /** Absolute path to instruction file */
    path: string;
    /** Instruction content (markdown) */
    content: string;
    /** Glob pattern for files this applies to */
    applyTo?: string;
    /** Source metadata */
    _source: SourceMeta;
}
export declare const instructionCapability: import("./types.js").Capability<Instruction>;
