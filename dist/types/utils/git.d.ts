import type { FileDiff, FileHunks, NumstatEntry } from "../commit/types.js";
export interface GitCommandResult {
    exitCode: number;
    stdout: string;
    stderr: string;
    /** True when stdout or stderr hit {@link GIT_COMMAND_OUTPUT_LIMIT_BYTES} and the captured text is incomplete. */
    truncated: boolean;
}
export interface GitRepository {
    commonDir: string;
    gitDir: string;
    gitEntryPath: string;
    headPath: string;
    repoRoot: string;
    isReftable?: boolean;
}
export interface GitStatusSummary {
    staged: number;
    unstaged: number;
    untracked: number;
}
export type HunkSelection = {
    path: string;
    hunks: {
        type: "all";
    } | {
        type: "indices";
        indices: number[];
    } | {
        type: "lines";
        start: number;
        end: number;
    };
};
export interface StageHunksOptions {
    readonly diffCached?: boolean;
    readonly rawDiff?: string;
    readonly signal?: AbortSignal;
}
export interface HunkSelectionValidationError {
    readonly path: string;
    readonly message: string;
}
export interface DiffOptions {
    readonly allowFailure?: boolean;
    readonly base?: string;
    readonly binary?: boolean;
    readonly cached?: boolean;
    readonly env?: Record<string, string | undefined>;
    readonly files?: readonly string[];
    readonly head?: string;
    readonly nameOnly?: boolean;
    readonly noIndex?: {
        left: string;
        right: string;
    };
    readonly numstat?: boolean;
    readonly signal?: AbortSignal;
    readonly stat?: boolean;
    readonly requireComplete?: boolean;
}
export interface StatusOptions {
    readonly pathspecs?: readonly string[];
    readonly porcelainV1?: boolean;
    readonly signal?: AbortSignal;
    readonly untrackedFiles?: "all" | "no" | "normal";
    readonly z?: boolean;
}
export interface CommitAuthor {
    readonly date?: string;
    readonly email: string;
    readonly name: string;
}
export interface CommitDetails {
    readonly author: CommitAuthor;
    readonly message: string;
}
export interface CommitOptions {
    readonly allowEmpty?: boolean;
    readonly author?: CommitAuthor;
    readonly files?: readonly string[];
    readonly signal?: AbortSignal;
}
export interface PushOptions {
    readonly forceWithLease?: boolean;
    readonly refspec?: string;
    readonly remote?: string;
    readonly signal?: AbortSignal;
}
export interface PatchOptions {
    readonly cached?: boolean;
    readonly check?: boolean;
    readonly env?: Record<string, string | undefined>;
    readonly reverse?: boolean;
    readonly threeWay?: boolean;
    readonly signal?: AbortSignal;
}
export interface RestoreOptions {
    readonly files?: readonly string[];
    readonly signal?: AbortSignal;
    readonly source?: string;
    readonly staged?: boolean;
    readonly worktree?: boolean;
}
export interface FetchOptions {
    readonly signal?: AbortSignal;
    /** Deadline for the network transfer. Defaults to {@link GIT_NETWORK_TIMEOUT_MS}. */
    readonly timeoutMs?: number;
}
export interface CloneOptions {
    readonly ref?: string;
    readonly sha?: string;
    readonly signal?: AbortSignal;
    /** Deadline for the network transfer. Defaults to {@link GIT_NETWORK_TIMEOUT_MS}. */
    readonly timeoutMs?: number;
}
interface GitHeadBase extends GitRepository {
    headContent: string;
}
export interface GitRefHead extends GitHeadBase {
    branchName: string | null;
    commit: string | null;
    kind: "ref";
    ref: string;
}
export interface GitDetachedHead extends GitHeadBase {
    commit: string | null;
    kind: "detached";
}
export type GitHeadState = GitRefHead | GitDetachedHead;
export interface GitWorktreeEntry {
    branch?: string;
    detached: boolean;
    head?: string;
    path: string;
}
export declare class GitCommandError extends Error {
    readonly args: readonly string[];
    readonly result: GitCommandResult;
    constructor(args: readonly string[], result: GitCommandResult);
}
/**
 * A git subprocess produced more output than {@link GIT_COMMAND_OUTPUT_LIMIT_BYTES}
 * and its captured stdout was truncated. Thrown only for callers that opt into
 * completeness via `diff({ requireComplete: true })`, where operating on a partial
 * diff would silently corrupt downstream parsing — e.g. the split-commit builder,
 * which would otherwise throw a misleading "No diff found" for files sorting after
 * a large binary blob whose base85 payload pushed the diff past the cap.
 */
export declare class GitOutputTruncatedError extends Error {
    readonly args: readonly string[];
    readonly result: GitCommandResult;
    constructor(args: readonly string[], result: GitCommandResult);
}
/** Default deadline for git and gh subprocesses spawned by the coding agent. */
export declare const GIT_COMMAND_TIMEOUT_MS: number;
/**
 * Default deadline for git subprocesses that perform network transfers
 * (`clone`/`fetch`). Large-repo transfers legitimately outlive
 * {@link GIT_COMMAND_TIMEOUT_MS}, so they get a wider deadline; local plumbing
 * commands keep the short one.
 */
export declare const GIT_NETWORK_TIMEOUT_MS: number;
/** Maximum captured stdout or stderr bytes retained from git and gh subprocesses. */
export declare const GIT_COMMAND_OUTPUT_LIMIT_BYTES: number;
/**
 * Deadline for synchronous git plumbing commands launched via
 * {@link gitSpawnSyncText}. These run on the render path (e.g. reftable HEAD
 * resolution), so the deadline is short: a command that has not exited by then
 * is killed and reported as {@link GIT_COMMAND_TIMEOUT_EXIT_CODE} so the caller
 * degrades instead of freezing the UI indefinitely.
 */
export declare const GIT_SPAWN_SYNC_TIMEOUT_MS = 5000;
/**
 * Stat-poll interval for {@link head.watch}. One `stat` per interval keeps an
 * always-on status line cheap while surfacing a branch switch within a second.
 */
export declare const HEAD_WATCH_INTERVAL_MS = 1000;
interface CommandOptions {
    readonly env?: Record<string, string | undefined>;
    readonly maxOutputBytes?: number;
    readonly readOnly?: boolean;
    readonly signal?: AbortSignal;
    readonly stdin?: string | Uint8Array | ArrayBuffer | SharedArrayBuffer;
    readonly timeoutMs?: number;
}
/**
 * Serialize an async block that mutates a git repository against other
 * in-process callers operating on the same repository. The lock is keyed by
 * the primary repo root so worktrees of the same repo share a single queue.
 * Failures in one block do not poison the queue for the next caller.
 *
 * Not reentrant: do NOT nest acquisitions for the same repo. Helpers in this
 * module never auto-acquire — callers wrap the critical section themselves.
 */
export declare function withRepoLock<T>(cwd: string, fn: () => Promise<T>, signal?: AbortSignal): Promise<T>;
export declare function createHunkSelectionValidator(rawDiff: string): (selections: readonly HunkSelection[]) => HunkSelectionValidationError[];
export declare function validateHunkSelections(rawDiff: string, selections: readonly HunkSelection[]): HunkSelectionValidationError[];
declare function parseStatusPorcelain(text: string): GitStatusSummary;
/** Run `git diff` with the given options. Returns raw diff text. */
export declare const diff: ((cwd: string, options?: DiffOptions) => Promise<string>) & {
    /** List changed file paths. */
    changedFiles(cwd: string, options?: Pick<DiffOptions, "cached" | "files" | "signal">): Promise<string[]>;
    /** Parsed per-file add/remove counts. */
    numstat(cwd: string, options?: Pick<DiffOptions, "cached" | "signal">): Promise<NumstatEntry[]>;
    /** Parsed diff hunks for the given files. */
    hunks(cwd: string, files: readonly string[], options?: {
        cached?: boolean;
        signal?: AbortSignal;
    }): Promise<FileHunks[]>;
    /** Check whether a diff exists (uses `--quiet` for efficiency). */
    has(cwd: string, options?: Pick<DiffOptions, "cached" | "files" | "signal">): Promise<boolean>;
    /** Diff between two tree-ish objects (`git diff-tree`). */
    tree(cwd: string, base: string, headRef: string, options?: {
        binary?: boolean;
        signal?: AbortSignal;
        allowFailure?: boolean;
    }): Promise<string>;
    /** Parse raw diff text into per-file diffs. */
    parseFiles(text: string): FileDiff[];
    /** Parse raw diff text into per-file hunks. */
    parseHunks(text: string): FileHunks[];
};
/** Run `git status --porcelain`. Returns raw status text. */
export declare const status: ((cwd: string, options?: StatusOptions) => Promise<string>) & {
    /** Parsed status counts (staged, unstaged, untracked). */
    summary(cwd: string, signal?: AbortSignal): Promise<GitStatusSummary | null>;
    /** Parse porcelain status text into counts. */
    parse: typeof parseStatusPorcelain;
};
export declare const stage: {
    /** Stage files. Empty array stages all (`git add -A`). */
    files(cwd: string, files?: readonly string[], signal?: AbortSignal): Promise<void>;
    /** Selectively stage hunks from the provided diff or the current working tree diff. */
    hunks(cwd: string, selections: HunkSelection[], options?: StageHunksOptions): Promise<void>;
    /** Unstage files. Empty array unstages all (`git reset`). */
    reset(cwd: string, files?: readonly string[], signal?: AbortSignal): Promise<void>;
};
/** Create a commit with the given message (passed via stdin). */
export declare function commit(cwd: string, message: string, options?: CommitOptions): Promise<GitCommandResult>;
/** Push the current branch (branch-scoped: never follows tags). */
export declare function push(cwd: string, options?: PushOptions): Promise<void>;
/** Checkout a ref. */
export declare function checkout(cwd: string, ref: string, signal?: AbortSignal): Promise<void>;
/** Fetch a specific refspec from a remote. Network transfer: defaults to the {@link GIT_NETWORK_TIMEOUT_MS} deadline. */
export declare function fetch(cwd: string, remote: string, source: string, target: string, options?: FetchOptions): Promise<void>;
/** Read a tree-ish into the index. */
export declare function readTree(cwd: string, treeish: string, options?: Pick<CommandOptions, "env" | "signal">): Promise<void>;
/** Write the current index as a tree and return its object id. */
export declare function writeTree(cwd: string, options?: Pick<CommandOptions, "env" | "signal">): Promise<string>;
/** Outcome of {@link detachGitDir}. */
export type DetachGitDirResult = 
/** `worktreeRoot` had no `.git`; nothing to detach. */
"no-git"
/** `.git` already resolves to an independent object DB — left untouched. */
 | "independent"
/** Detached into a standalone repo borrowing `sourceCommonDir`'s objects. */
 | "detached";
/**
 * Sever a copied/mounted working tree from the git metadata it shares with a
 * source checkout, turning it into a standalone repository that borrows the
 * source object database through `objects/info/alternates`.
 *
 * Isolation backends (reflink/apfs/btrfs/rcopy…) materialise `merged` by
 * copying `worktreeRoot` byte-for-byte. When `worktreeRoot` is a **linked git
 * worktree** its `.git` is a pointer file (`gitdir: …/worktrees/<name>`), so
 * the copy still resolves HEAD/index/refs through the source repo — a task's
 * `git checkout`/`commit` inside the isolation then mutates the *parent*
 * checkout. The rcopy `git worktree add` path leaks the other way: task
 * branches land in the shared ref namespace and stack on each other.
 *
 * After detaching, the working tree keeps its files verbatim while:
 * - HEAD, refs, and the index are frozen to the snapshot at call time;
 * - all commits/branches the task creates stay private to the isolation;
 * - objects resolve against `sourceCommonDir` via alternates, so history reads
 *   and later `git fetch <merged>` object transfer keep working;
 * - the source checkout's HEAD, branch, index, and working tree are untouched.
 *
 * A full-copy `.git` (non-worktree source) already owns its object DB and is
 * returned as `"independent"` without modification. `worktreeRoot` without a
 * `.git` yields `"no-git"`.
 */
export declare function detachGitDir(worktreeRoot: string, sourceCommonDir: string): Promise<DetachGitDirResult>;
/** Run `git show` on a revision. */
export declare const show: ((cwd: string, revision: string, options?: {
    format?: string;
    signal?: AbortSignal;
}) => Promise<string>) & {
    /** Get the path prefix of the current directory relative to the repo root. */
    prefix(cwd: string, signal?: AbortSignal): Promise<string>;
};
/** Read commit message and author metadata for replay/rewrite flows. */
export declare function commitDetails(cwd: string, revision: string, signal?: AbortSignal): Promise<CommitDetails>;
export declare const log: {
    /** Recent commit subjects (one-line each). */
    subjects(cwd: string, count: number, signal?: AbortSignal): Promise<string[]>;
    /** Recent commits as `<short-sha> <subject>` onelines. */
    onelines(cwd: string, count: number, signal?: AbortSignal): Promise<string[]>;
};
export declare const revList: {
    /** Commits in `base..head`, oldest first. */
    range(cwd: string, base: string, head: string, signal?: AbortSignal): Promise<string[]>;
    /** Commits reachable from `ref` that touched `file`, newest first, capped at `limit`. */
    touching(cwd: string, ref: string, file: string, limit: number, signal?: AbortSignal): Promise<string[]>;
};
export declare const branch: {
    /** Current branch name, or null if detached/unavailable. */
    current(cwd: string, signal?: AbortSignal): Promise<string | null>;
    /** Default branch name (from remote HEAD refs). */
    default(cwd: string, signal?: AbortSignal): Promise<string | null>;
    /** Create a new branch at the given start point. */
    create(cwd: string, name: string, startPoint?: string, signal?: AbortSignal): Promise<void>;
    /** Force-move a branch to a new start point. */
    force(cwd: string, name: string, startPoint: string, signal?: AbortSignal): Promise<void>;
    /** Delete a branch. Throws on failure. */
    delete(cwd: string, name: string, options?: {
        force?: boolean;
        signal?: AbortSignal;
    }): Promise<void>;
    /** Delete a branch. Returns false on failure instead of throwing. */
    tryDelete(cwd: string, name: string, options?: {
        force?: boolean;
        signal?: AbortSignal;
    }): Promise<boolean>;
    /** Create and checkout a new branch. */
    checkoutNew(cwd: string, name: string, signal?: AbortSignal): Promise<void>;
    /** List branches. Pass `{ all: true }` to include remotes. */
    list(cwd: string, options?: {
        all?: boolean;
        signal?: AbortSignal;
    }): Promise<string[]>;
};
export declare const remote: {
    /** List remote names. */
    list(cwd: string, signal?: AbortSignal): Promise<string[]>;
    /** Get the URL for a remote. */
    url(cwd: string, name: string, signal?: AbortSignal): Promise<string | undefined>;
    /**
     * Add a remote pointing at `url`. Idempotent: if a remote named `name`
     * already exists with the same URL (e.g. an in-process race or a leftover
     * remote from a previous run), this is treated as success. Throws when the
     * remote exists with a different URL — that's a real conflict the caller
     * needs to resolve, not paper over.
     */
    add(cwd: string, name: string, url: string, signal?: AbortSignal): Promise<void>;
};
export declare const ref: {
    /** Check if a ref exists. */
    exists(cwd: string, refName: string, signal?: AbortSignal): Promise<boolean>;
    /** Resolve a ref to its commit SHA. */
    resolve(cwd: string, refName: string, signal?: AbortSignal): Promise<string | null>;
    /** Tags pointing at a ref. */
    tags(cwd: string, refName?: string, signal?: AbortSignal): Promise<string[]>;
};
export declare const config: {
    get(cwd: string, key: string, signal?: AbortSignal): Promise<string | undefined>;
    set(cwd: string, key: string, value: string, signal?: AbortSignal): Promise<void>;
    getBranch(cwd: string, branchName: string, key: string, signal?: AbortSignal): Promise<string | undefined>;
    setBranch(cwd: string, branchName: string, key: string, value: string, signal?: AbortSignal): Promise<void>;
};
export declare const worktree: {
    add(cwd: string, worktreePath: string, refName: string, options?: {
        detach?: boolean;
        signal?: AbortSignal;
    }): Promise<void>;
    remove(cwd: string, worktreePath: string, options?: {
        force?: boolean;
        signal?: AbortSignal;
    }): Promise<void>;
    tryRemove(cwd: string, worktreePath: string, options?: {
        force?: boolean;
        signal?: AbortSignal;
    }): Promise<boolean>;
    list(cwd: string, signal?: AbortSignal): Promise<GitWorktreeEntry[]>;
    prune(cwd: string, signal?: AbortSignal): Promise<void>;
};
export declare const patch: {
    /** Apply a patch file. */
    apply(cwd: string, patchPath: string, options?: PatchOptions): Promise<void>;
    /** Apply a patch from a string (writes to a temp file). */
    applyText(cwd: string, patchText: string, options?: PatchOptions): Promise<void>;
    /** Check if a patch file can be applied cleanly. */
    canApply(cwd: string, patchPath: string, options?: Omit<PatchOptions, "check">): Promise<boolean>;
    /** Check if a patch string can be applied cleanly. */
    canApplyText(cwd: string, patchText: string, options?: Omit<PatchOptions, "check">): Promise<boolean>;
    /**
     * Join patch parts into a single patch string.
     *
     * Each part is terminated with a single `\n` if it lacks one, then parts are
     * concatenated verbatim — matching git's native multi-file diff layout. Parts
     * are NOT separated by an extra blank line and trailing newlines are NOT
     * stripped: a `GIT binary patch` block ends in a blank line that
     * `git apply --binary` requires, and stripping it corrupts the patch (#8899).
     */
    join(parts: string[]): string;
};
export declare const cherryPick: ((cwd: string, revision: string, signal?: AbortSignal) => Promise<void>) & {
    abort(cwd: string, signal?: AbortSignal): Promise<void>;
    /**
     * Skip the current commit of an in-progress cherry-pick sequence and
     * continue with the rest of the range. Use after {@link isEmptyError}
     * reports the current attempt collapsed to a no-op — the alternative,
     * `--abort`, throws away every remaining commit in the range.
     */
    skip(cwd: string, signal?: AbortSignal): Promise<void>;
    /**
     * True when a cherry-pick failure was caused by the current commit
     * being empty against HEAD — either redundant with an already-applied
     * change, or auto-resolved to HEAD by a 3-way merge. Callers should
     * `--skip` in this case to advance the sequencer rather than aborting
     * the whole range: an empty commit is not a merge conflict, and any
     * later commits in the range still deserve to land.
     */
    isEmptyError(err: unknown): boolean;
};
export declare const stash: {
    /** Stash working tree + index changes. Returns true when git created a new stash entry. */
    push(cwd: string, message?: string): Promise<boolean>;
    /** Pop the most recent stash entry, optionally restoring its staged state. */
    pop(cwd: string, options?: {
        index?: boolean;
    }): Promise<void>;
    /**
     * Return the working-tree patch that `stash@{0}` would apply, in a form
     * that `git apply --check` can consume. Empty string when no stash entry
     * exists or the stash contains no diffable working-tree changes.
     */
    showPatch(cwd: string): Promise<string>;
    /** Return untracked paths stored in the top stash entry. */
    untrackedFiles(cwd: string): Promise<string[]>;
    /**
     * Attempt to restore the top stash entry. On success returns `true` and
     * git drops the stash entry. On conflict returns `false`, leaves the stash
     * entry preserved for manual resolution, and guarantees the failed restore
     * leaves no unmerged index entries or partially-restored untracked files.
     *
     * The historical raw `pop` catches the failure in a `finally` block and
     * only logs — it leaves `.git/index` with stage 1/2/3 unmerged entries
     * that survive indefinitely, corrupting every subsequent overlay-isolated
     * task that reads through this repo's `.git/`. See issue #4175.
     */
    tryPop(cwd: string, options?: {
        index?: boolean;
    }): Promise<boolean>;
};
export declare function clone(url: string, targetDir: string, options?: CloneOptions): Promise<void>;
export declare function restore(cwd: string, options?: RestoreOptions): Promise<void>;
/**
 * Run `git reset` with options. Default is a soft reset (no flag); pass `hard: true` for a destructive reset.
 *
 * NOTE: stage.reset() handles the per-file unstaging case. This helper exists for tree-wide resets.
 */
export declare function reset(cwd: string, options?: {
    hard?: boolean;
    mixed?: boolean;
    soft?: boolean;
    target?: string;
    signal?: AbortSignal;
}): Promise<void>;
export declare function clean(cwd: string, options?: {
    ignoredOnly?: boolean;
    includeIgnored?: boolean;
    literalPathspecs?: boolean;
    paths?: readonly string[];
    signal?: AbortSignal;
}): Promise<void>;
export declare const ls: {
    /** List files tracked or untracked by git. */
    files(cwd: string, options?: {
        others?: boolean;
        excludeStandard?: boolean;
        signal?: AbortSignal;
    }): Promise<string[]>;
    /** List untracked files (excludes ignored). */
    untracked(cwd: string, signal?: AbortSignal): Promise<string[]>;
    /** List paths present in a ref, optionally filtered to specific paths. */
    tree(cwd: string, ref: string, files?: readonly string[], signal?: AbortSignal): Promise<string[]>;
    /** List submodule paths (recursive). */
    submodules(cwd: string, signal?: AbortSignal): Promise<string[]>;
};
export declare const head: {
    /** Full HEAD state (branch, commit, repo info). */
    resolve(cwd: string, signal?: AbortSignal): Promise<GitHeadState | null>;
    /** Full HEAD state (synchronous). */
    resolveSync(cwd: string): GitHeadState | null;
    /** Current HEAD commit SHA. */
    sha(cwd: string, signal?: AbortSignal): Promise<string | null>;
    /** Abbreviated HEAD commit SHA. */
    short(cwd: string, length?: number, signal?: AbortSignal): Promise<string | null>;
    /**
     * Watch the repository's HEAD for branch moves. Returns a disposer.
     *
     * Deliberately stat-polls via `fs.watchFile` instead of `fs.watch`: git
     * swaps HEAD with `HEAD.lock` + atomic rename, which unlinks the HEAD inode
     * — and Bun's inotify-backed `fs.watch` permanently stops delivering events
     * after observing a rename in the watched directory (oven-sh/bun#24875), so
     * an event watcher fires once and then freezes on Linux (issue #8412 was
     * the same freeze for file-inode watches on every platform). A path-based
     * stat poll re-resolves the path each interval and survives inode swaps
     * everywhere. Reftable repos keep ref state in `<gitDir>/reftable` (their
     * HEAD file is a static stub), so the poll targets that directory instead.
     */
    watch(repository: GitRepository, onChange: () => void): () => void;
};
export declare const repo: {
    /** Resolve the repository root (may be a worktree root). */
    root(cwd: string, signal?: AbortSignal): Promise<string | null>;
    /** Resolve the primary checkout root, or the shared common dir for bare-repo worktrees. */
    primaryRoot(cwd: string, signal?: AbortSignal): Promise<string | null>;
    /**
     * Sync sibling of {@link primaryRoot}. Resolves only via on-disk `.git`/
     * `commondir` walking — no subprocess fallback — so it stays usable from
     * paths where async I/O is impractical (e.g. `computeBankScope`). Returns
     * `null` when `cwd` is outside a repository. Bare-repo worktrees resolve to
     * the shared common dir (`foo.git`) because they have no primary checkout.
     */
    primaryRootSync(cwd: string): string | null;
    /**
     * Linked-worktree metadata for `cwd`, or `null` when `cwd` is the primary
     * checkout (or outside a repository). `root` is the worktree's own checkout
     * root; `primaryRoot` is the shared main checkout that names the project.
     * Resolves purely via on-disk `.git`/`commondir` walking — no subprocess —
     * so the status line may call it on every render.
     */
    linkedWorktreeSync(cwd: string): {
        root: string;
        primaryRoot: string;
    } | null;
    /** Full GitRepository metadata (sync). */
    resolveSync(cwd: string): GitRepository | null;
    /** Full GitRepository metadata. */
    resolve(cwd: string): Promise<GitRepository | null>;
    /** Check if the repository uses the reftable reference storage format (sync). */
    isReftableSync(repository: GitRepository): boolean;
    /** Check if the repository uses the reftable reference storage format. */
    isReftable(repository: GitRepository): Promise<boolean>;
};
export interface GhCommandResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}
export interface GhCommandOptions {
    repoProvided?: boolean;
    trimOutput?: boolean;
}
export declare const github: {
    /** Check if `gh` CLI is installed. */
    available(): boolean;
    /** Run a raw `gh` CLI command. Does not throw on non-zero exit. */
    run(cwd: string, args: string[], signal?: AbortSignal, options?: GhCommandOptions): Promise<GhCommandResult>;
    /** Run `gh` and parse stdout as JSON. Throws on non-zero exit or invalid JSON. */
    json<T>(cwd: string, args: string[], signal?: AbortSignal, options?: GhCommandOptions): Promise<T>;
    /** Run `gh` and return stdout as text. Throws on non-zero exit. */
    text(cwd: string, args: string[], signal?: AbortSignal, options?: GhCommandOptions): Promise<string>;
};
export {};
