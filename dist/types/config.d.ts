export * from "./config/config-file.js";
/**
 * Walk up from `startDir` looking for a `package.json`. Returns the directory
 * containing the marker, or `undefined` when the walk hits the filesystem root
 * without finding one.
 *
 * Exported for unit-testing the resolution contract from arbitrary start
 * directories (notably the `bun --compile` case where `import.meta.dir`
 * resolves to `/$bunfs/root` and no owning package is locatable — issue
 * #1423). Production callers should use {@link getPackageDir} instead.
 */
export declare function walkUpForPackageDir(startDir: string): string | undefined;
/**
 * Get the base directory for resolving optional package assets (docs, examples, CHANGELOG.md).
 *
 * Honors the `PI_PACKAGE_DIR` override (useful for Nix/Guix store paths);
 * otherwise walks up from `import.meta.dir` looking for a `package.json`.
 * Returns `undefined` when no owning package is locatable — notably inside
 * `bun --compile` binaries where `import.meta.dir` resolves to `/$bunfs/root`
 * and the walk hits the filesystem root with nothing found.
 *
 * Callers MUST treat `undefined` as "no package assets available" and skip the
 * lookup. NEVER fall back to the user's `cwd` here: that conflates the host
 * project with omp's own assets and was the source of issue #1423 (the host
 * project's `CHANGELOG.md` rendered as omp's startup changelog).
 */
export declare function getPackageDir(): string | undefined;
/**
 * Path to omp's own `CHANGELOG.md`, or `undefined` when the package directory
 * cannot be resolved (e.g. inside `bun --compile` binaries that don't bundle
 * package assets). Callers MUST skip changelog parsing when this is undefined;
 * see issue #1423.
 */
export declare function getChangelogPath(): string | undefined;
export interface ConfigDirEntry {
    path: string;
    source: string;
    level: "user" | "project";
}
export interface GetConfigDirsOptions {
    /** Include user-level directories (~/.omp/agent/...). Default: true */
    user?: boolean;
    /** Include project-level directories (.omp/...). Default: true */
    project?: boolean;
    /** Current working directory for project paths. Default: getProjectDir() */
    cwd?: string;
    /** Only return directories that exist. Default: false */
    existingOnly?: boolean;
}
/**
 * Get all config directories for a subpath, ordered by priority (highest first).
 *
 * @param subpath - Subpath within config dirs (e.g., "commands", "hooks", "agents")
 * @param options - Options for filtering
 * @returns Array of directory entries, highest priority first
 *
 * @example
 * // Get all command directories
 * getConfigDirs("commands")
 * // → [{ path: "~/.omp/agent/commands", source: ".omp", level: "user" }, ...]
 *
 * @example
 * // Get only existing project skill directories
 * getConfigDirs("skills", { user: false, existingOnly: true })
 */
export declare function getConfigDirs(subpath: string, options?: GetConfigDirsOptions): ConfigDirEntry[];
/**
 * Get all config directory paths for a subpath (convenience wrapper).
 * Returns just the paths, highest priority first.
 */
export declare function getConfigDirPaths(subpath: string, options?: GetConfigDirsOptions): string[];
export interface ConfigFileResult<T> {
    path: string;
    source: string;
    level: "user" | "project";
    content: T;
}
/**
 * Find the first existing config file (for non-JSON files like SYSTEM.md).
 * Returns just the path, or undefined if not found.
 */
export declare function findConfigFile(subpath: string, options?: GetConfigDirsOptions): string | undefined;
/**
 * Find the first existing config file with metadata.
 */
export declare function findConfigFileWithMeta(subpath: string, options?: GetConfigDirsOptions): Omit<ConfigFileResult<never>, "content"> | undefined;
/**
 * Find all nearest config directories by walking up from cwd.
 * Returns one entry per config base (.omp, .claude) - the nearest one found.
 * Results are in priority order (highest first).
 */
export declare function findAllNearestProjectConfigDirs(subpath: string, cwd?: string): ConfigDirEntry[];
