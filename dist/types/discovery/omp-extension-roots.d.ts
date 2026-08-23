import type { LoadContext } from "../capability/types.js";
/** A resolved extension package directory wired into the discovery surfaces. */
export interface OmpExtensionRoot {
    /** Absolute path to the package directory. */
    path: string;
    /** Stable display name (basename of the package directory). */
    name: string;
    /** Scope from which the path was sourced. */
    level: "user" | "project";
}
export type OmpExtensionRootMode = "merge" | "explicit-only";
export interface InjectOmpExtensionCliRootOptions {
    /**
     * `explicit-only` exposes only roots named by this CLI invocation. Use it
     * with `--no-extensions` so configured and installed packages cannot
     * contribute sibling capabilities through the `omp-plugins` provider.
     */
    mode?: OmpExtensionRootMode;
    /** Replace roots from an earlier invocation instead of extending them. */
    replace?: boolean;
}
/**
 * Run one SDK invocation with its own extension-package roots. Async resources
 * started inside `callback` retain this scope, including discovery deliberately
 * deferred until the end of session startup. Raw relative paths are resolved by
 * {@link listOmpExtensionRoots} against that invocation's active cwd.
 */
export declare function withOmpExtensionRootScope<T>(paths: readonly string[], mode: OmpExtensionRootMode, callback: () => T): T;
/**
 * Register CLI-provided extension package paths (e.g. from `--extension`/`-e`)
 * so the sub-discovery providers can find their sibling `skills/`, `hooks/`,
 * etc. Paths that do not resolve to a directory are silently dropped — file
 * entrypoints have no package sub-tree to scan.
 *
 * Call once during startup before any capability load. Repeated calls extend
 * the registered set; {@link clearOmpExtensionCliRoots} resets for tests.
 */
export declare function injectOmpExtensionCliRoots(paths: readonly string[], home: string, cwd: string, options?: InjectOmpExtensionCliRootOptions): void;
/** Drop every CLI-injected root. Tests use this between cases. */
export declare function clearOmpExtensionCliRoots(): void;
/** Inspect currently-injected CLI roots (read-only). Exposed for diagnostics + tests. */
export declare function getInjectedOmpExtensionCliRoots(): readonly OmpExtensionRoot[];
/**
 * Resolve every configured extension package directory for the given context.
 *
 * Sources, in order of precedence (later entries with the same absolute path
 * are dropped):
 *
 * 1. Invocation-scoped SDK roots, when present; otherwise CLI roots injected
 *    via {@link injectOmpExtensionCliRoots}
 * 2. Project `<cwd>/.omp/settings.json#extensions`
 * 3. User `~/.omp/agent/settings.json#extensions`
 * 4. Enabled npm/link plugins installed under `<plugins>/node_modules/` (for
 *    `omp install <pkg>` / `omp plugin install` / `omp plugin link`). Marketplace
 *    installs are loaded by the `claude-plugins` provider and are excluded here.
 * Only entries that resolve to a directory on disk are returned; file
 * entrypoints contribute zero sub-discovery surface and are filtered out.
 * Installed-plugin enumeration failures (missing lockfile, unreadable
 * `package.json`, etc.) are logged at `debug` and degrade gracefully — the
 * other sources still surface.
 */
export declare function listOmpExtensionRoots(ctx: LoadContext): Promise<OmpExtensionRoot[]>;
