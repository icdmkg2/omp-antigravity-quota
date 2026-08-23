import * as path from "node:path";
declare const BUNDLED_VIRTUAL_NAMESPACE = "omp-legacy-pi-bundled";
interface BundledVirtualResolveResult {
    path: string;
    namespace: typeof BUNDLED_VIRTUAL_NAMESPACE;
}
/** Maps a bundled virtual specifier or registry key to Bun's plugin namespace shape. */
export declare function resolveBundledVirtualSpecifier(specifier: string): BundledVirtualResolveResult;
/** Test seam for the virtual module's named/default export forwarding. */
export declare function __synthesizeLegacyPiBundledSourceWithModules(moduleKey: string, modules: Readonly<Record<string, Readonly<Record<string, unknown>>>>): string;
/** Test seam for the global bridge key shared with synthetic module source. */
export declare function __getLegacyPiBundledModulesGlobal(): string;
/**
 * Compute the package root for the npm prebuilt `dist/cli.js` bundle.
 *
 * `bundle-dist.ts` defines `process.env.PI_BUNDLED="true"`; after bundling,
 * `import.meta.dir` points at `<package>/dist`. Do not resolve the package via
 * bare `@oh-my-pi/pi-coding-agent` here: from a global install Bun can pick an
 * older cache entry, recreating mixed-runtime plugin loading.
 */
export declare function __computeBundledSelfPackageRoot(metaDir: string, pathImpl?: typeof path): string;
/**
 * Resolve the coding-agent compatibility surface that composes omptype's
 * TypeBox facade with legacy `Type.Unsafe`, then drop the remap when that
 * entrypoint is missing.
 *
 * In compiled-binary mode the surface is served through the
 * `omp-legacy-pi-bundled:` virtual namespace (issue #3423). Dev, source-link,
 * and installed-package modes use the shipped source module.
 *
 * Exported for tests; production callers use `TYPEBOX_SHIM_PATH`.
 */
export declare function __resolveTypeBoxShimPath(isCompiled: boolean, sourcePath: string, pathExistsSync?: (p: string) => boolean): string | null;
/**
 * Drop overrides whose filesystem targets are missing so they can fall
 * through to the canonical-resolution path. Virtual `omp-legacy-pi-bundled:`
 * entries always pass — live bundled module references are the source of truth
 * in compiled mode where bunfs paths are unreachable (issue #3423).
 *
 * `pathExistsSync` defaults to `fs.existsSync`; tests inject a stub to
 * simulate the missing-entrypoint failure mode without touching the real FS.
 */
export declare function __validateLegacyPiPackageRootOverrides(candidates: Record<string, string>, pathExistsSync?: (p: string) => boolean): Record<string, string>;
/**
 * Compute the override map keyed by every canonical specifier the host serves
 * directly: the pi-ai / pi-coding-agent roots (compat shims that re-attach
 * legacy helpers) plus, in compiled mode, every build-supplied module key.
 * Subpath coverage stops `@(scope)/pi-ai/oauth` and friends from falling
 * through to the extension's absent peer install when bunfs walks fail.
 */
export declare function __buildLegacyPiPackageRootOverrides(isCompiled: boolean, bundledModuleKeys?: Iterable<string>): Record<string, string>;
/** Test seam for compiled-binary legacy extension source rewriting. */
export declare function __rewriteLegacyExtensionSourceForTests(source: string, importerPath: string, mtimeTag?: string | null, resolvedImportMtimeTag?: string | null): Promise<string>;
/**
 * Register {@link evaluateGraphCommonJs} as the graph-owned CommonJS require
 * bridge on `globalThis`, first-wins.
 *
 * On source-link installs the `@(scope)/pi-coding-agent` root shim is served
 * from `src/`, so an extension import can evaluate a second instance of this
 * module with empty graph state. An unconditional set would let that empty
 * instance clobber the host bundle's populated bridge and break transitive
 * CommonJS resolution (#6449); guarding preserves the first (host-owned)
 * registration. Idempotent: a subsequent call with a value already present is a
 * no-op.
 */
export declare function ensureGraphCommonJsRequireRegistered(): void;
/** Test seam for compiled-binary dependency graph discovery and rewriting. */
export declare function __collectLegacyPiExtensionSourcesForTests(entryPath: string): Promise<ReadonlyMap<string, string>>;
/**
 * Load a legacy Pi extension module from its real on-disk location.
 *
 * The extension runs in place, so its `import.meta.url` is the real source file
 * and `__dirname`-relative `readFileSync` asset loads (HTML/CSS bundled next to
 * the entry) resolve exactly as they do under the original Pi runtime — no
 * temp-directory mirroring and no asset copying. An `onLoad` hook scoped to the
 * entry's source graph rewrites only host-resolved compatibility imports in the
 * extension's own source; everything else resolves natively.
 */
export declare function loadLegacyPiModule(resolvedPath: string): Promise<unknown>;
export declare function installLegacyPiSpecifierShim(): void;
/** Test seam: clears the memoized canonical specifier resolutions. */
export declare function __resetLegacyPiResolutionCache(): void;
export {};
