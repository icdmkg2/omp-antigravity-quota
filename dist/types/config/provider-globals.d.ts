interface ProviderGlobalSettings {
    get(path: "providers.webSearchOrder"): unknown;
    get(path: "providers.webSearchExclude"): unknown;
    get(path: "providers.imageOrder"): unknown;
}
export declare function applyProviderGlobalsFromSettings(settings: ProviderGlobalSettings): void;
export {};
