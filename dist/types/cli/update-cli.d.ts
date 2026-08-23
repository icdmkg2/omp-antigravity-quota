/** Distribution channel advertised by a release's published npm manifest. */
export type ReleaseDist = "npm" | "binary";
export type UpdateChannel = "stable" | "canary";
/** npm package names a release installs: the agent package and its natives companion. */
export interface ReleasePackages {
    pkg: string;
    natives: string;
}
/** Parsed `omp.rename` pointer: the new agent package name and optional new natives name. */
export interface ReleaseRename {
    pkg: string;
    natives?: string;
}
export interface ReleaseInfo {
    tag: string;
    version: string;
    /** Parsed `omp.dist` from the registry manifest; undefined when absent. */
    dist?: ReleaseDist;
    /** npm names to install, resolved after following any `omp.rename` pointers. */
    packages: ReleasePackages;
}
export interface ReleaseBinaryAsset {
    url: string;
    size: number;
    digest: string;
}
type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
/**
 * Parse the `omp.dist` field from a published package manifest.
 *
 * Forward-compatibility contract with future releases: a release that is not
 * installable as an npm package (e.g. a native rewrite) publishes
 * `"omp": { "dist": "binary" }` in its package.json. Any value other than
 * "npm" — including values this updater does not know yet — maps to "binary"
 * so already-deployed updaters never run a package-manager install against a
 * release that no longer supports it.
 */
export declare function resolveReleaseDist(manifest: unknown): ReleaseDist | undefined;
/**
 * Parse the `omp.rename` pointer from a published package manifest.
 *
 * Forward-compatibility contract for renaming the npm package: the final
 * version published under an old name is a stub whose manifest carries
 * `"omp": { "rename": { "package": "<new-agent-pkg>", "natives": "<new-natives-pkg>" }, "dist": "binary" }`.
 * Updaters that understand `rename` follow the pointer and resolve the
 * release from the renamed package instead ({@link getLatestRelease});
 * older deployed updaters ignore it and take the `dist: "binary"` escape
 * hatch, replacing the install with the GitHub release binary rather than
 * installing the stub via bun/npm.
 *
 * The renamed package's own manifest MUST declare `"dist": "npm"` (so
 * package-manager installs stay package-managed across a major bump) and
 * MUST continue the old version line (a version reset would compare as
 * "already up to date" against the running build).
 */
export declare function resolveReleaseRename(manifest: unknown): ReleaseRename | undefined;
/**
 * Whether the update must bypass bun/npm and install the release binary.
 *
 * An explicit `omp.dist` wins in both directions. Without one, a release with
 * a higher major than the running build is assumed not npm-installable: the
 * runtime may have changed out from under the package layout, and the pinned
 * `@oh-my-pi/pi-natives*` companions ({@link buildBunInstallArgs}) may not
 * exist at that version, which would strand bun/npm-managed installs behind a
 * hard install failure. Homebrew and mise installs are unaffected — both
 * already pull GitHub release binaries.
 */
export declare function shouldForceBinaryUpdate(release: {
    version: string;
    dist?: ReleaseDist;
}, currentVersion?: string): boolean;
/**
 * Select and validate the binary asset from GitHub release metadata.
 */
export declare function resolveReleaseBinaryAsset(release: unknown, expectedTag: string, binaryName: string): ReleaseBinaryAsset;
export interface VerifiedBinaryDownloadOptions {
    url: string;
    targetPath: string;
    expectedSize: number;
    expectedDigest: string;
    fetchImpl?: Fetch;
}
/**
 * Download a binary and verify its GitHub-reported size and SHA-256 digest.
 */
export declare function downloadVerifiedBinary(options: VerifiedBinaryDownloadOptions): Promise<void>;
/** Result from running the installed binary and parsing its reported version. */
export interface InstalledVersionVerification {
    ok: boolean;
    actual?: string;
    path?: string;
}
/** Paths and verifier used while replacing a downloaded binary update. */
export interface BinaryReplacementOptions {
    targetPath: string;
    tempPath: string;
    backupPath: string;
    expectedVersion: string;
    verifyInstalledVersion: (expectedVersion: string) => Promise<InstalledVersionVerification>;
}
/**
 * Parse update subcommand arguments.
 * Returns undefined if not an update command.
 */
export declare function parseUpdateArgs(args: string[]): {
    force: boolean;
    check: boolean;
    plugins: boolean;
    channel?: UpdateChannel;
} | undefined;
type UpdateMethod = "brew" | "mise" | "nix" | "bun" | "npm" | "binary";
interface UpdateMethodResolutionOptions {
    homebrewPrefix?: string;
    miseBinDirs?: readonly string[];
    miseDataDir?: string;
    npmBinDir?: string;
    /** Bun's configured global package directory, independent of its bin directory. */
    bunGlobalDir?: string;
    /**
     * Whether the resolved omp path is a plain file (the standalone binary)
     * rather than a package-manager symlink. Stops a binary install from being
     * misrouted to npm/bun when the global bin dir overlaps the installer's
     * target directory.
     */
    ompIsRegularFile?: boolean;
    /**
     * Absolute path named by the bin entry's first symlink hop. This deliberately
     * preserves a global package symlink instead of resolving into its checkout.
     */
    ompLinkTarget?: string;
    /**
     * Whether bun's launcher metadata (`<name>.bunx`) sits beside the resolved
     * launcher. Bun writes that sidecar next to every `.exe` shim it installs, so
     * its presence is what makes a regular-file launcher in bun's bin dir
     * bun-managed rather than a standalone binary that took the launcher over.
     */
    bunShimMarker?: boolean;
    /**
     * Whether package-manager routing (bun/npm) is permitted. Binary-only
     * releases pass `false`: a manager launcher then resolves to `"binary"` and
     * is taken over in place rather than reinstalled through its manager. Defaults
     * to `true` in {@link resolveUpdateMethod} so callers that only classify need
     * not set it.
     */
    allowPackageManagers?: boolean;
}
type UpdateTarget = {
    method: "brew";
} | {
    method: "mise";
} | {
    method: "nix";
} | {
    method: "bun";
    path?: string;
} | {
    method: "npm";
    path?: string;
} | {
    method: "binary";
    path: string;
    replacesSymlink: boolean;
};
export declare function resolveUpdateMethodForTest(ompPath: string, bunBinDir: string | undefined, options?: UpdateMethodResolutionOptions): UpdateMethod;
/** Resolve an update target from the concrete PATH entry selected by the shell. */
export declare function resolveUpdateTargetFromPath(ompPath: string, bunBinDir: string | undefined, options: UpdateMethodResolutionOptions & {
    allowPackageManagers: boolean;
}): UpdateTarget;
/**
 * Get the latest release info from the npm registry, following `omp.rename`
 * pointers ({@link resolveReleaseRename}) when the package has moved to a new
 * npm name. Version, dist, and install names all come from the final manifest
 * in the chain. Uses npm instead of GitHub API to avoid unauthenticated rate
 * limiting.
 */
export declare function getLatestRelease(options?: {
    timeoutMs?: number;
    channel?: UpdateChannel;
}): Promise<ReleaseInfo>;
interface BunInstallCachePruneResult {
    scannedPackages: number;
    removedEntries: number;
}
/**
 * Prune Bun's package cache so each package keeps only its newest cached version.
 *
 * Bun stores package cache entries as both a package marker directory
 * (`react/19.2.6@@@1`) and a materialized package directory
 * (`react@19.2.6@@@1`). Global `omp` updates can leave one full copy per
 * release. The marker and materialized entries are removed together so the
 * cache stays internally consistent.
 */
export declare function pruneBunInstallCache(cacheDir: string, packageNames?: Set<string>): Promise<BunInstallCachePruneResult>;
interface BunGlobalInstallLocations {
    globalDir?: string;
    globalBinDir?: string;
    cacheDir?: string;
}
/** Resolve Bun's global node_modules root from explicit, default, or cache locations. */
export declare function resolveBunGlobalNodeModulesDirFromLocations({ globalDir, globalBinDir, cacheDir, }: BunGlobalInstallLocations): string | undefined;
/**
 * Detect a musl-libc Linux host (Alpine, Void-musl) so self-update replaces a
 * musl binary with the musl release asset instead of the glibc build, which
 * would fail to start on the next run. The loader file alone is not sufficient:
 * glibc hosts may have musl installed for cross-compilation.
 */
interface MuslDetectionOptions {
    platform?: NodeJS.Platform;
    alpineRelease?: boolean;
    lddOutput?: string;
}
/** Test seam for libc detection. */
export declare function isMuslLinuxForTest(options: Required<MuslDetectionOptions>): boolean;
/**
 * Run a specific binary and check if it reports the expected version.
 */
declare function verifyBinaryAtPath(binaryPath: string, expectedVersion: string): Promise<InstalledVersionVerification>;
/**
 * Run the PATH-resolved omp binary and check if it reports the expected version.
 */
declare function verifyInstalledVersion(expectedVersion: string): Promise<InstalledVersionVerification>;
/**
 * Best-effort removal of binary-update leftovers from earlier runs.
 *
 * Each self-update writes to `<binary>.<timestamp>.<pid>.new` and moves the
 * previous executable to `<binary>.<timestamp>.<pid>.bak` before swapping the
 * new one in. On Windows a backup cannot be deleted while the updating process
 * is alive (it is the running process image), so it is left for a later run to
 * reclaim once its owning process has exited. A `.new` temp file only survives
 * a hard kill mid-download; it is reaped once older than the download window,
 * which a live download cannot exceed without timing out and cleaning up after
 * itself — so a concurrent run's in-progress temp is never deleted. Legacy
 * fixed `<binary>.bak` / `<binary>.new` names (from before suffixes were made
 * unique) are matched too, so users upgrading from a buggy release get the
 * orphaned files cleaned up.
 */
export declare function sweepStaleUpdateArtifacts(targetPath: string): Promise<void>;
/**
 * Atomically replace the installed binary and roll back if version verification fails.
 */
export declare function replaceBinaryForUpdate(options: BinaryReplacementOptions): Promise<InstalledVersionVerification>;
/**
 * Build the bun argv used to globally install a specific omp version.
 *
 * The version is selected by hitting {@link NPM_REGISTRY} directly in
 * {@link getLatestRelease}, so the install MUST observe the same catalog:
 *
 * - `--registry=${NPM_REGISTRY}` pins the install to the official registry
 *   regardless of the user's bunfig/`.npmrc`. A mirror (corporate proxy,
 *   Taobao, …) that hasn't yet replicated the release would otherwise reject
 *   a version the upstream registry already advertises.
 * - `--no-cache` tells bun to ignore its on-disk manifest snapshot so it
 *   re-fetches metadata from that registry on every invocation.
 *
 * Together these two flags make `omp update` produce exactly the registry
 * lookup the version check just performed. See #1686.
 *
 * Also pins {@link NATIVES_PACKAGE} and the platform-specific
 * `@oh-my-pi/pi-natives-<tag>` leaf to `expectedVersion`. `bun install -g`
 * does not reliably refresh transitive `optionalDependencies` when the
 * top-level package is the only one bumped, so the native addon and its
 * version sentinel can drift out of sync with the freshly installed
 * `@oh-my-pi/pi-coding-agent` and the loader aborts at
 * `validateLoadedBindings` on the next launch
 * (`The .node file on disk is from a different release than this loader`).
 * Listing the natives explicitly forces bun to replace them in lock-step.
 * The leaf is added only on tags the release pipeline actually publishes
 * ({@link SUPPORTED_NATIVE_TAGS}) so unsupported platforms still fail with
 * the original "no matching version" message instead of `EBADPLATFORM`.
 * See #1824.
 */
export declare function buildBunInstallArgs(expectedVersion: string, nativeTag?: string, packages?: ReleasePackages): string[];
/**
 * Build the npm argv used to update npm-managed global installs.
 *
 * `force` is set only for rename migrations: npm refuses to write the `omp`
 * bin while the old package still owns it (`EEXIST`), and the migration
 * installs the new package BEFORE removing the old one so a failed install
 * never leaves the user without a working `omp`.
 */
export declare function buildNpmInstallArgs(expectedVersion: string, nativeTag?: string, packages?: ReleasePackages, flags?: {
    force?: boolean;
}): string[];
export declare function buildHomebrewUpdateArgs(force: boolean): string[];
export declare function buildMiseUpgradeArgs(): string[];
export declare function buildMiseForceInstallArgs(expectedVersion: string): string[];
/**
 * Old-name globals a rename migration removes after the new install exists:
 * the set difference between the old install's top-level globals
 * ({@link buildVersionedPackageInstallArgs} installs the agent, natives core,
 * and platform leaf explicitly) and the resolved install's. An agent-only
 * rename keeps the natives names, and removing them would strip the addon
 * the new install just pinned.
 */
export declare function buildRenameCleanupPackages(packages: ReleasePackages, nativeTag?: string): string[];
/** Injectable shell steps for {@link migrateRenamedInstall}; commands return process exit codes. */
export interface RenameMigrationSteps {
    /** Globally install the new package names. MUST be idempotent: re-running re-links the `omp` bin. */
    install(): Promise<number>;
    /** Remove the old-name globals. */
    removeOld(): Promise<number>;
    /** Check the PATH-resolved `omp` against the expected version. */
    verify(): Promise<InstalledVersionVerification>;
}
/**
 * Migrate a package-manager install across an `omp.rename` hop without a
 * window where no working `omp` exists:
 *
 * 1. Install the new package FIRST. Nothing has been removed yet, so a
 *    failure here leaves the old install fully functional.
 * 2. Remove the old-name globals. Failure is non-fatal: a stale package
 *    wastes disk, but the bin already points at the new install.
 * 3. Verify the PATH-resolved `omp`. If the removal deleted the shared bin
 *    link (manager-dependent), re-run the idempotent install to restore it
 *    and verify again; only a repeated failure aborts, with a recovery hint.
 */
export declare function migrateRenamedInstall(release: ReleaseInfo, steps: RenameMigrationSteps): Promise<void>;
/** Injectable steps for {@link updateViaManager}; mirrors {@link RenameMigrationSteps}. */
export interface ManagerUpdateSteps {
    /** Manager name used in progress and recovery messages. */
    manager: string;
    /**
     * Run the manager's global install. Resolves to the PATH-resolved launcher
     * check, or `undefined` when a rename migration already verified and
     * reported its own result.
     */
    install(): Promise<InstalledVersionVerification | undefined>;
    /** Re-check the PATH-resolved launcher after the install threw. */
    verify(): Promise<InstalledVersionVerification>;
    /** Take `launcherPath` over with the standalone release binary. */
    repair(launcherPath: string): Promise<void>;
}
/**
 * Run a package-manager self-update, repairing the launcher when the manager
 * leaves this install without a working `omp`.
 *
 * A global reinstall has to replace files the running process still holds open.
 * On Windows that is unavoidable — the launcher image, the loaded native addon,
 * and the package tree being executed are all locked — and either manager can
 * end the attempt with no usable launcher: npm moves the global bin shims aside
 * before unpacking and restores them only if its own rollback succeeds, and bun
 * aborts the whole install on the first file it cannot overwrite, which leaves
 * a half-replaced package the launcher can no longer run.
 *
 * Only a launcher that is gone from PATH, or that can no longer report a
 * version, is repaired — by taking its path over with the standalone release
 * binary. A launcher that still reports the old version means the install did
 * not land (usually a transient registry failure): the previous version keeps
 * working, so that case surfaces the error and leaves the managed install
 * alone instead of migrating a healthy install off its manager.
 */
export declare function updateViaManager(release: ReleaseInfo, launcherPath: string | undefined, steps: ManagerUpdateSteps): Promise<void>;
/**
 * Download a release binary to a target path, replacing an existing file.
 */
export declare function updateViaBinaryAt(targetPath: string, expectedVersion: string, options?: {
    binaryName?: string;
    fetchImpl?: Fetch;
    githubToken?: string;
    verifyInstalledVersion?: typeof verifyInstalledVersion;
}): Promise<void>;
/**
 * Take over a Windows script-launcher install for a binary-only release.
 *
 * npm-managed Windows installs are launched through script shims
 * (`omp`/`omp.cmd`/`omp.ps1`) that cannot be overwritten with a native
 * executable. The release binary is installed as `omp.exe` beside them and
 * the shims are then renamed aside: cmd.exe would already prefer `.exe` via
 * PATHEXT, but PowerShell resolves `.ps1` first, so the takeover only sticks
 * once the shims are out of the way. A working launcher exists at every
 * step — the exe lands before any shim moves, a shim that refuses to move
 * (a running `.cmd` can be renamed but may be held open some other way) is
 * rewritten in place as a forwarder to the exe, and a failed version
 * verification moves everything back.
 */
export declare function updateViaShimTakeover(shimPath: string, expectedVersion: string, options?: {
    binaryName?: string;
    fetchImpl?: Fetch;
    githubToken?: string;
    verifyBinary?: typeof verifyBinaryAtPath;
}): Promise<void>;
/**
 * Run the update command.
 */
export declare function runUpdateCommand(opts: {
    force: boolean;
    check: boolean;
    channel?: UpdateChannel;
}): Promise<void>;
/**
 * Print update command help.
 */
export declare function printUpdateHelp(): void;
export {};
