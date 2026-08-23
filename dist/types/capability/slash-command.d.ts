import type { SourceMeta } from "./types.js";
/**
 * A file-based slash command.
 */
export interface SlashCommand {
    /** Command name (without leading slash) */
    name: string;
    /** Absolute path to command file */
    path: string;
    /** Command content (markdown template) */
    content: string;
    /** Source level */
    level: "user" | "project" | "native";
    /** Source metadata */
    _source: SourceMeta;
}
export declare const slashCommandCapability: import("./types.js").Capability<SlashCommand>;
