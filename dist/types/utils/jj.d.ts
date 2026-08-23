import * as git from "./git.js";
/** Result from a completed `jj` subprocess invocation. */
export interface JjCommandResult {
    /** Process exit code reported by `jj`. */
    exitCode: number;
    /** Captured standard output as UTF-8 text. */
    stdout: string;
    /** Captured standard error as UTF-8 text. */
    stderr: string;
}
/** Resolved Jujutsu workspace metadata. */
export interface JjRepository {
    /** Root directory containing the `.jj` workspace metadata. */
    repoRoot: string;
    /** Path to the shared workspace store directory, resolved through `.jj/repo`'s file indirection for non-default workspaces. */
    storeDir: string;
}
/** Options for `jj diff` invocations. */
export interface DiffOptions extends JjCommandOptions {
    /** Optional file paths to restrict the diff with `-- <files>`. */
    readonly files?: readonly string[];
    /** Return only changed file names instead of Git-format diff text. */
    readonly nameOnly?: boolean;
}
/** Options for a bounded `jj` subprocess query. */
export interface JjCommandOptions {
    /** Optional cancellation signal for the subprocess. */
    readonly signal?: AbortSignal;
    /** Deadline in milliseconds. Defaults to {@link JJ_COMMAND_TIMEOUT_MS}. */
    readonly timeoutMs?: number;
}
/** Default finite deadline for local jj subprocesses. */
export declare const JJ_COMMAND_TIMEOUT_MS = 5000;
/** Error thrown when a checked `jj` command exits non-zero. */
export declare class JjCommandError extends Error {
    /** Arguments passed after the common `jj --no-pager --color=never` prefix. */
    readonly args: readonly string[];
    /** Captured command result that caused the failure. */
    readonly result: JjCommandResult;
    /** Create an error for a failed checked `jj` command. */
    constructor(args: readonly string[], result: JjCommandResult);
}
declare function parseWorkingCopyLabel(raw: string): string | null;
declare function parseStatusSummary(raw: string): git.GitStatusSummary;
/** Run `jj diff --git` for the current workspace commit and return the raw Git-format diff text. */
export declare const diff: ((cwd: string, options?: DiffOptions) => Promise<string>) & {
    /** List changed file paths. */
    changedFiles(cwd: string, options?: Pick<DiffOptions, "files" | "signal">): Promise<string[]>;
};
/** Jujutsu working-copy metadata used by status displays. */
export declare const workingCopy: {
    /**
     * Label `@` with its nearest bookmark, falling back to its short change ID.
     * Returns `null` when `jj` is unavailable or the query fails.
     */
    label(cwd: string, options?: JjCommandOptions): Promise<string | null>;
    /** Parse working-copy label query output. */
    parseLabel: typeof parseWorkingCopyLabel;
};
/** Jujutsu working-copy status derived from the changes in `@`. */
export declare const status: {
    /**
     * Count changes in `@` relative to its parent using the Git status shape.
     * Jujutsu has no index, so `staged` is always zero.
     */
    summary(cwd: string, options?: JjCommandOptions): Promise<git.GitStatusSummary | null>;
    /** Parse `jj diff --summary` output into status counts. */
    parse: typeof parseStatusSummary;
};
export declare const repo: {
    /** Clear cached workspace roots. Intended for tests that mutate JJ metadata under an existing path. */
    clearRootCache(): void;
    /**
     * Resolve the current workspace root synchronously from on-disk metadata.
     * Intended for render paths that cannot await filesystem I/O.
     */
    rootSync(cwd: string): string | null;
    /** Resolve the current Jujutsu workspace root, or `null` when `cwd` is not in a JJ repository. */
    root(cwd: string): Promise<string | null>;
    /** Full Jujutsu workspace metadata. */
    resolve(cwd: string): Promise<JjRepository | null>;
    /** Check whether `cwd` is inside a Jujutsu repository. */
    is(cwd: string): Promise<boolean>;
};
/**
 * Detect a "pure" Jujutsu workspace — one where Git-mutating automation has
 * no safe Git target. Invoking `git checkout -b`, `git worktree add`, or
 * `git apply` against a pure jj workspace either fails outright (no `.git/`
 * present) or mutates state that jj itself cannot reconcile.
 *
 * `cwd` is "pure jj" iff its nearest jj workspace ancestor is **closer than**
 * its nearest Git checkout ancestor (or no Git checkout is present at all).
 * Both lookups walk upward from `cwd`, so the deeper ancestor is the one the
 * user is actually working inside.
 *
 * Returns:
 * - `false` for plain Git checkouts (no jj metadata anywhere up the tree).
 * - `false` for colocated jj-git workspaces — `jj git init --colocate` keeps
 *   `.jj/` and `.git/` at the same root.
 * - `false` when a nested Git checkout (e.g. a vendored repo or fixture)
 *   lives **under** an outer jj workspace; Git automation targets the inner
 *   repo and never touches the surrounding jj tree.
 * - `true` when jj is the deeper ancestor — either a standalone pure jj
 *   workspace, or a jj workspace nested under an unrelated outer Git
 *   checkout, where Git automation against the outer root would silently
 *   bypass jj.
 * - `false` for directories backed by neither tool.
 */
export declare function isPureJjRepo(cwd: string): Promise<boolean>;
export {};
