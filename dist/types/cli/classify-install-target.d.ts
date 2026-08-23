export type ClassifiedInstallTarget = {
    type: "local";
    path: string;
} | {
    type: "marketplace";
    name: string;
    marketplace: string;
} | {
    type: "npm";
    spec: string;
};
export declare function classifyInstallTarget(spec: string, knownMarketplaces: Set<string>): ClassifiedInstallTarget;
