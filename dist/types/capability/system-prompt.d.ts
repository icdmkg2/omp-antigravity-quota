import type { SourceMeta } from "./types.js";
/**
 * A system prompt customization file.
 */
export interface SystemPrompt {
    /** Absolute path to the file */
    path: string;
    /** File content */
    content: string;
    /** Which level this came from */
    level: "user" | "project";
    /** Source metadata */
    _source: SourceMeta;
}
export declare const systemPromptCapability: import("./types.js").Capability<SystemPrompt>;
