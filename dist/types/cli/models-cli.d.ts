import { ModelRegistry } from "../config/model-registry.js";
export type ModelsAction = "ls" | "find" | "refresh";
export interface ModelsCommandArgs {
    action: ModelsAction;
    /** Search substring for `find`, or optional filter for `ls`. */
    pattern?: string;
    flags: {
        json?: boolean;
        /** CLI `-e <path>` extension paths to load before listing (issue #905). */
        extensions?: string[];
        /** Skip extension discovery; only load explicit `extensions`. */
        noExtensions?: boolean;
        /** Extra `config.yml` overlays to apply for this invocation. */
        config?: string[];
    };
}
/** Resolve the two positional args into an action + filter (provider names fall through to `ls`). */
export declare function resolveModelsArgs(first: string | undefined, second: string | undefined): {
    action: ModelsAction;
    pattern: string | undefined;
};
/**
 * Options for {@link runModelsListing}: render the catalog from a caller-supplied
 * registry. Loads extensions (CLI `-e` paths and configured `settings.extensions`)
 * and discovers their providers before rendering so extension-contributed models
 * appear (issue #905). The caller is responsible for refreshing built-in providers.
 */
export interface RunModelsListingOptions {
    modelRegistry: ModelRegistry;
    cwd: string;
    action?: ModelsAction;
    pattern?: string;
    json?: boolean;
    /** CLI-supplied extension paths (e.g. from `-e <path>`). */
    additionalExtensionPaths?: string[];
    /** Extension paths configured under `extensions:` in user settings. */
    settingsExtensions?: string[];
    /** Disabled extension ids from settings (`disabledExtensions`). */
    disabledExtensionIds?: string[];
    /** When true, exclude ambient factories and resolve only `additionalExtensionPaths`. */
    disableExtensionDiscovery?: boolean;
}
export declare function runModelsListing(options: RunModelsListingOptions): Promise<void>;
/**
 * Entry point for the standalone `omp models` command: bootstraps auth storage,
 * settings, and the model registry, force/cache-refreshes built-in providers per
 * the chosen action, then delegates to {@link runModelsListing}.
 */
export declare function runModelsCommand(command: ModelsCommandArgs): Promise<void>;
