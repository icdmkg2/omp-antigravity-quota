type WorktreeKind = "pr-checkout" | "task-isolation" | "empty" | "stray";
export interface WorktreeEntry {
    /** Absolute path to the worktree dir (or stray container) under `~/.omp/wt/`. */
    path: string;
    /** Classification of what we found on disk. */
    kind: WorktreeKind;
    /** Parent repo root, when this is a registered git worktree. */
    parentRepo?: string;
    /** Branch name extracted from the parent's tracking file, when available. */
    branch?: string;
    /** When set, the entry is unhealthy and `omp worktree clear` will remove it. */
    orphanReason?: string;
}
export interface ListWorktreesOptions {
    json: boolean;
}
export interface ClearWorktreesOptions {
    /** Remove every entry, including live PR-checkout worktrees. */
    all: boolean;
    /** Print what would be removed without touching the filesystem. */
    dryRun: boolean;
    json: boolean;
}
export declare function listWorktrees(options: ListWorktreesOptions): Promise<void>;
export declare function clearWorktrees(options: ClearWorktreesOptions): Promise<void>;
export {};
