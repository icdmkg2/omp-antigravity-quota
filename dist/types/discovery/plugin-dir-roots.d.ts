/** Synthetic plugin root for a --plugin-dir path. Shape-compatible with ClaudePluginRoot. */
export interface PluginDirRoot {
    id: string;
    marketplace: string;
    plugin: string;
    version: string;
    path: string;
    scope: "user" | "project";
}
/**
 * Build a synthetic plugin root from a --plugin-dir resolved path.
 * @param resolvedPath Absolute path to the plugin directory
 * @param manifestName Plugin name from manifest; falls back to directory basename
 */
export declare function buildPluginDirRoot(resolvedPath: string, manifestName?: string): PluginDirRoot;
