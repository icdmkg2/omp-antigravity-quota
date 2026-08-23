type MarketplaceAutoUpdateMode = "off" | "notify" | "auto";
interface MarketplaceAutoUpdateOptions {
    autoUpdate: MarketplaceAutoUpdateMode;
    resolveActiveProjectRegistryPath: (cwd: string) => Promise<string | null>;
    clearPluginRootsCache: () => void;
}
export declare function scheduleMarketplaceAutoUpdate(options: MarketplaceAutoUpdateOptions): void;
export {};
