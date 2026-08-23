import type { InstalledPlugin } from "./types.js";
/** Installed plugin plus the root scope that supplied its runtime metadata. */
export interface ScopedInstalledPlugin extends InstalledPlugin {
    scope: "user" | "project";
}
/**
 * Get list of enabled plugins with their resolved configurations.
 *
 * Enumerates two plugin roots in order: the user root
 * (`getPluginsDir(home)`) and, when a project anchor (`.omp/` or `.git/`)
 * exists at or above `cwd`, the project root
 * (`<projectAnchor>/.omp/plugins`). Each root contributes the union of its
 * `package.json#dependencies` and `omp-plugins.lock.json#plugins`. Project
 * entries shadow user entries with the same package name, matching the
 * shadow semantics of `MarketplaceManager.listInstalledPlugins`.
 *
 * The optional `home` parameter pins the user plugins root for callers that
 * need to enumerate plugins relative to a non-default home (tests with a
 * tempdir, discovery loaders threaded with `LoadContext.home`).
 */
export declare function getEnabledPlugins(cwd: string, opts?: {
    home?: string;
}): Promise<ScopedInstalledPlugin[]>;
/**
 * Declared manifest entries paired with their resolved file path. Returns one
 * record per declared entry — base entries first, then enabled-feature entries
 * — so callers (e.g. install-time validation) can detect manifest entries that
 * point at missing files instead of silently skipping them like
 * {@link resolvePluginPaths} does.
 */
export declare function resolvePluginManifestEntries(plugin: InstalledPlugin, key: "tools" | "hooks" | "commands" | "extensions"): Array<{
    entry: string;
    resolvedPath: string | null;
}>;
export declare function resolvePluginToolPaths(plugin: InstalledPlugin): string[];
export declare function resolvePluginHookPaths(plugin: InstalledPlugin): string[];
export declare function resolvePluginCommandPaths(plugin: InstalledPlugin): string[];
export declare function resolvePluginExtensionPaths(plugin: InstalledPlugin): string[];
/**
 * Get all tool paths from all enabled plugins.
 */
export declare function getAllPluginToolPaths(cwd: string): Promise<string[]>;
/**
 * Get all hook paths from all enabled plugins.
 */
export declare function getAllPluginHookPaths(cwd: string): Promise<string[]>;
/**
 * Get all command paths from all enabled plugins.
 */
export declare function getAllPluginCommandPaths(cwd: string): Promise<string[]>;
/**
 * Get all extension module paths from all enabled plugins.
 */
export declare function getAllPluginExtensionPaths(cwd: string): Promise<string[]>;
/**
 * Get plugin settings for use in tool/hook contexts.
 * Merges global settings with project overrides.
 */
export declare function getPluginSettings(pluginName: string, cwd: string): Promise<Record<string, unknown>>;
