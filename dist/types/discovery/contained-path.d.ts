/** Resolve symlinks and equivalents; `null` when the path is missing or unresolvable. */
export declare function realpathIfExists(p: string): Promise<string | null>;
/** Outcome of resolving a fixed package path without reading it. */
type ContainedPathResolution = {
    status: "missing";
} | {
    status: "outside";
} | {
    status: "ok";
    realPath: string;
};
/**
 * Resolve a fixed package path WITHOUT reading it: symlinks and equivalent
 * mechanisms are resolved first, and a path escaping the filesystem-resolved
 * plugin root is rejected before any I/O could consume outside content.
 */
export declare function resolveContainedPath(realBase: string, target: string): Promise<ContainedPathResolution>;
/**
 * Verify a package path stays within the filesystem-resolved plugin root:
 * lexically, and — when the target exists — after resolving symlinks. Unlike
 * {@link resolveContainedPath}, a missing target passes. ONLY for configured
 * paths that are validated but never read or executed at load time (stdio
 * `command`, `cwd` — including `${PLUGIN_DATA}` paths created after
 * validation); access paths MUST use {@link resolveContainedPath} instead,
 * which fails closed on unresolvable targets.
 */
export declare function isContainedResolved(realBase: string, target: string): Promise<boolean>;
/**
 * Sync variant of {@link resolveContainedPath} for synchronous callsites
 * (bash `skill://` expansion).
 */
export declare function resolveContainedPathSync(realBase: string, target: string): ContainedPathResolution;
export {};
