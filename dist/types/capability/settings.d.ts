import type { SourceMeta } from "./types.js";
/**
 * A settings file.
 */
export interface Settings {
    /** Absolute path to settings file */
    path: string;
    /** Parsed settings data */
    data: Record<string, unknown>;
    /** Source level */
    level: "user" | "project";
    /** Source metadata */
    _source: SourceMeta;
}
export declare const settingsCapability: import("./types.js").Capability<Settings>;
