/** Default cap on a single `direnv` invocation. The first export for a devenv
 *  `.envrc` can build a shell; callers may raise this via `bash.direnvLoadTimeoutMs`. */
export declare const DEFAULT_DIRENV_TIMEOUT_MS = 30000;
/** Walk up from `startDir` to the nearest directory containing an `.envrc`. */
export declare function findEnvrc(startDir: string): Promise<string | null>;
export interface DirenvExportDiff {
    /** Variables direnv sets to a concrete value. */
    set: Record<string, string>;
    /** Variables direnv removes (JSON `null`). */
    unset: string[];
}
/** Parse `direnv export json` output (`{VAR: value|null}`) into set/unset halves. */
export declare function parseDirenvExport(jsonText: string): DirenvExportDiff;
/**
 * Resolve the nearest `.envrc` from `cwd` and return its `direnv export` diff
 * (variables to set, and variables direnv removes). Returns `null` when there
 * is no `.envrc`, `direnv` is not installed, the `.envrc` is not on direnv's
 * allow list, or the export fails/times out.
 *
 * direnv's own allow list is honored — an `.envrc` the user has not
 * `direnv allow`ed is NEVER executed or auto-allowed. This keeps OMP's trust
 * boundary identical to the user's own shell: cloning a repo with a poisoned
 * `.envrc` grants it nothing until the user explicitly allows it.
 *
 * Always re-invokes `direnv export json` rather than serving a cached diff:
 * direnv is fast once warm, and its own watch/mtime invalidation is the
 * authoritative freshness signal (a content-hash cache here would go stale when
 * a `watch_file` target changes without the `.envrc` text changing).
 */
export declare function loadDirenvEnv(cwd: string, opts?: {
    timeoutMs?: number;
    signal?: AbortSignal;
}): Promise<DirenvExportDiff | null>;
