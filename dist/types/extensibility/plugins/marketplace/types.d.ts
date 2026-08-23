/**
 * Marketplace plugin system types.
 *
 * Two registries:
 *   - MarketplacesRegistry: which marketplace catalogs the user has added (config)
 *   - InstalledPluginsRegistry: which plugins are installed (data, Claude Code-compatible)
 *
 * The installed registry MUST pass `parseClaudePluginsRegistry()` validation —
 * it uses `version: 2` (numeric) and `plugins: Record<string, ...[]>`.
 */
/** Validate a plugin or marketplace name segment. */
export declare function isValidNameSegment(s: string): boolean;
/** Build canonical plugin ID: `"name@marketplace"`. Both segments are validated. */
export declare function buildPluginId(name: string, marketplace: string): string;
/** Parse `"name@marketplace"` → `{ name, marketplace }` or `null`. */
export declare function parsePluginId(id: string): {
    name: string;
    marketplace: string;
} | null;
export interface MarketplaceCatalogOwner {
    name: string;
    email?: string;
}
export interface MarketplaceCatalogMetadata {
    description?: string;
    version?: string;
    /** If set, prepended to relative plugin source paths. */
    pluginRoot?: string;
}
export interface MarketplaceCatalog {
    name: string;
    owner: MarketplaceCatalogOwner;
    metadata?: MarketplaceCatalogMetadata;
    plugins: MarketplacePluginEntry[];
}
export interface MarketplacePluginAuthor {
    name: string;
    email?: string;
}
export interface MarketplacePluginEntry {
    name: string;
    source: PluginSource;
    description?: string;
    version?: string;
    author?: MarketplacePluginAuthor;
    homepage?: string;
    repository?: string;
    license?: string;
    keywords?: string[];
    category?: string;
    tags?: string[];
    strict?: boolean;
    commands?: string | string[];
    agents?: string | string[];
    hooks?: string | Record<string, unknown>;
    mcpServers?: string | Record<string, unknown>;
    lspServers?: string | Record<string, unknown>;
    dapAdapters?: string | Record<string, unknown>;
}
export type PluginSource = string | PluginSourceGitHub | PluginSourceUrl | PluginSourceGitSubdir | PluginSourceNpm;
export interface PluginSourceGitHub {
    source: "github";
    repo: string;
    ref?: string;
    sha?: string;
}
export interface PluginSourceUrl {
    source: "url";
    url: string;
    ref?: string;
    sha?: string;
}
export interface PluginSourceGitSubdir {
    source: "git-subdir";
    url: string;
    path: string;
    ref?: string;
    sha?: string;
}
export interface PluginSourceNpm {
    source: "npm";
    package: string;
    version?: string;
    registry?: string;
}
export interface MarketplacesRegistry {
    version: 1;
    marketplaces: MarketplaceRegistryEntry[];
}
export type MarketplaceSourceType = "github" | "git" | "url" | "local";
export interface MarketplaceRegistryEntry {
    name: string;
    sourceType: MarketplaceSourceType;
    sourceUri: string;
    catalogPath: string;
    addedAt: string;
    updatedAt: string;
}
export interface InstalledPluginsRegistry {
    /** MUST be 2 — parseClaudePluginsRegistry rejects non-numeric version. */
    version: 2;
    plugins: Record<string, InstalledPluginEntry[]>;
}
export interface InstalledPluginEntry {
    scope: "user" | "project";
    /** Absolute path to cached plugin directory. */
    installPath: string;
    version: string;
    /** ISO 8601 date string. */
    installedAt: string;
    /** ISO 8601 date string. */
    lastUpdated: string;
    /** For git-sourced plugins. */
    gitCommitSha?: string;
    /** OMP extension — not in Claude Code's type. CLI/UI concern only in v1. */
    enabled?: boolean;
}
/**
 * A merged view of an installed plugin, combining entries from both the user and
 * project registries. Returned by MarketplaceManager.listInstalledPlugins().
 *
 * `shadowedBy` is set on user-scoped summaries when the same plugin ID also exists
 * in the project registry — the project entry takes precedence for capability loading.
 */
export interface InstalledPluginSummary {
    id: string;
    scope: "user" | "project";
    entries: InstalledPluginEntry[];
    /** Set when a user-scoped plugin is overridden by a project-scoped install. */
    shadowedBy?: "project";
}
