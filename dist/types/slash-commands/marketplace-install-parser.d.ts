export interface MarketplaceInstallArgs {
    force: boolean;
    scope: "user" | "project";
    installSpec: string;
}
/**
 * Parse the argument string following `/marketplace install`.
 *
 * Returns either the parsed args or an `{ error }` object whose message is
 * suitable for direct display to the user via `ctx.showStatus`.
 *
 * Accepted flags (any order):
 *   --force                 Force-reinstall even if already installed
 *   --scope user|project    Installation scope (default: user)
 *
 * Exactly one positional argument is required: `name@marketplace`.
 */
export declare function parseMarketplaceInstallArgs(rest: string): MarketplaceInstallArgs | {
    error: string;
};
export interface PluginScopeArgs {
    pluginId: string;
    scope?: "user" | "project";
}
/**
 * Parse `[--scope user|project] <name@marketplace>` for commands that accept a
 * single plugin ID and an optional scope flag.
 *
 * Returns parsed args or `{ error }` ready for `ctx.showStatus`.
 */
export declare function parsePluginScopeArgs(rest: string, usageHint: string): PluginScopeArgs | {
    error: string;
};
