/**
 * Registry read/write operations for the marketplace plugin system.
 *
 * Two registries:
 *   - marketplaces.json at getMarketplacesRegistryPath() — which catalogs the user has added
 *   - installed_plugins.json under getPluginsDir() — which plugins are installed
 *
 * Read/write functions accept explicit file paths so callers control the
 * location. Path helpers compute the default paths from the dir singleton.
 *
 * Both use atomic write (tmp + rename). On Windows, rename over existing file
 * can fail with EPERM — fallback: unlink target then rename.
 */
export { getMarketplacesRegistryPath } from "@oh-my-pi/pi-utils";
import type { InstalledPluginEntry, InstalledPluginsRegistry, MarketplaceRegistryEntry, MarketplacesRegistry } from "./types.js";
export declare function getInstalledPluginsRegistryPath(): string;
export declare function getMarketplacesCacheDir(): string;
export declare function getPluginsCacheDir(): string;
export declare function readMarketplacesRegistry(filePath: string): Promise<MarketplacesRegistry>;
export declare function writeMarketplacesRegistry(filePath: string, reg: MarketplacesRegistry): Promise<void>;
export declare function readInstalledPluginsRegistry(filePath: string): Promise<InstalledPluginsRegistry>;
export declare function writeInstalledPluginsRegistry(filePath: string, reg: InstalledPluginsRegistry): Promise<void>;
export declare function addMarketplaceEntry(reg: MarketplacesRegistry, entry: MarketplaceRegistryEntry): MarketplacesRegistry;
export declare function removeMarketplaceEntry(reg: MarketplacesRegistry, name: string): MarketplacesRegistry;
export declare function getMarketplaceEntry(reg: MarketplacesRegistry, name: string): MarketplaceRegistryEntry | undefined;
export declare function addInstalledPlugin(reg: InstalledPluginsRegistry, id: string, entry: InstalledPluginEntry): InstalledPluginsRegistry;
export declare function removeInstalledPlugin(reg: InstalledPluginsRegistry, id: string): InstalledPluginsRegistry;
export declare function getInstalledPlugin(reg: InstalledPluginsRegistry, id: string): InstalledPluginEntry[] | undefined;
/**
 * Collect all installPath values referenced by any of the provided registries.
 * Use this before deleting a cached plugin directory to verify it is not still
 * referenced by another scope's registry.
 */
export declare function collectReferencedPaths(...registries: InstalledPluginsRegistry[]): Set<string>;
