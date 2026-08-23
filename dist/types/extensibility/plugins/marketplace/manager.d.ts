/**
 * MarketplaceManager — orchestrates registry, fetcher, resolver, and cache.
 *
 * Constructor takes explicit paths for testability (same pattern as registry.ts).
 * The `clearPluginRootsCache` dependency is injected so callers can provide
 * the real `clearClaudePluginRootsCache` while tests supply a counter stub.
 */
import type { InstalledPluginEntry, InstalledPluginSummary, MarketplacePluginEntry, MarketplaceRegistryEntry } from "./types.js";
export interface MarketplaceManagerOptions {
    marketplacesRegistryPath: string;
    installedRegistryPath: string;
    /**
     * Path to the project-scoped installed_plugins.json.
     * Required when installPlugin / uninstallPlugin is called with scope: "project".
     * Resolved by resolveActiveProjectRegistryPath(cwd) in callers.
     */
    projectInstalledRegistryPath?: string;
    marketplacesCacheDir: string;
    pluginsCacheDir: string;
    /** Injected for testing; production callers pass clearClaudePluginRootsCache.
     *  Receives any additional file paths that should also be invalidated from the fs cache.
     */
    clearPluginRootsCache?: (extraPaths?: readonly string[]) => void;
}
export declare class MarketplaceManager {
    #private;
    constructor(options: MarketplaceManagerOptions);
    addMarketplace(source: string): Promise<MarketplaceRegistryEntry>;
    removeMarketplace(name: string): Promise<void>;
    updateMarketplace(name: string): Promise<MarketplaceRegistryEntry>;
    updateAllMarketplaces(): Promise<MarketplaceRegistryEntry[]>;
    listMarketplaces(): Promise<MarketplaceRegistryEntry[]>;
    listAvailablePlugins(marketplace?: string): Promise<MarketplacePluginEntry[]>;
    getPluginInfo(name: string, marketplace: string): Promise<MarketplacePluginEntry | null>;
    installPlugin(name: string, marketplace: string, options?: {
        force?: boolean;
        scope?: "user" | "project";
    }): Promise<InstalledPluginEntry>;
    /** Validates and removes a marketplace plugin, or only validates when `dryRun` is set. */
    uninstallPlugin(pluginId: string, scope?: "user" | "project", options?: {
        dryRun?: boolean;
    }): Promise<void>;
    listInstalledPlugins(): Promise<InstalledPluginSummary[]>;
    setPluginEnabled(pluginId: string, enabled: boolean, scope?: "user" | "project"): Promise<void>;
    refreshStaleMarketplaces(): Promise<void>;
    checkForUpdates(): Promise<Array<{
        pluginId: string;
        scope: "user" | "project";
        from: string;
        to: string;
    }>>;
    upgradePlugin(pluginId: string, scope?: "user" | "project"): Promise<InstalledPluginEntry>;
    upgradePluginAcrossScopes(pluginId: string): Promise<InstalledPluginEntry[]>;
    upgradeAllPlugins(): Promise<Array<{
        pluginId: string;
        scope: "user" | "project";
        from: string;
        to: string;
    }>>;
}
