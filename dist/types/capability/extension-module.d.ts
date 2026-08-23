import type { SourceMeta } from "./types.js";
/**
 * A loaded extension module.
 */
export interface ExtensionModule {
    /** Extension module name (derived from path) */
    name: string;
    /** Absolute path to extension entrypoint */
    path: string;
    /** Source level */
    level: "user" | "project";
    /** Source metadata */
    _source: SourceMeta;
}
export declare const extensionModuleCapability: import("./types.js").Capability<ExtensionModule>;
