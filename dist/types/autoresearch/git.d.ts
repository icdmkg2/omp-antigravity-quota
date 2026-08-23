import type { ExtensionAPI } from "../extensibility/extensions/index.js";
export interface EnsureAutoresearchBranchFailure {
    error: string;
    ok: false;
}
export interface EnsureAutoresearchBranchSuccess {
    branchName: string | null;
    created: boolean;
    ok: true;
    warning?: string;
}
export type EnsureAutoresearchBranchResult = EnsureAutoresearchBranchFailure | EnsureAutoresearchBranchSuccess;
export declare function getCurrentAutoresearchBranch(_api: ExtensionAPI, workDir: string): Promise<string | null>;
/**
 * Ensure the working tree is on an `autoresearch/*` branch when possible.
 *
 * If the worktree is dirty and we're not already on an autoresearch branch, this returns
 * `{ ok: true, branchName: null, warning }` rather than failing. The caller surfaces the
 * warning and continues on the current branch — `keep` will skip auto-commits and `discard`
 * will revert only run-modified paths instead of resetting to baseline.
 */
export declare function ensureAutoresearchBranch(api: ExtensionAPI, workDir: string, goal: string | null): Promise<EnsureAutoresearchBranchResult>;
export declare function parseWorkDirDirtyPaths(statusOutput: string, workDirPrefix: string): string[];
export declare function relativizeGitPathToWorkDir(repoRelativePath: string, workDirPrefix: string): string | null;
export declare function parseDirtyPaths(statusOutput: string): string[];
export declare function normalizeStatusPath(rawPath: string): string;
export interface DirtyPathEntry {
    path: string;
    untracked: boolean;
}
export declare function parseDirtyPathsWithStatus(statusOutput: string): DirtyPathEntry[];
export declare function parseWorkDirDirtyPathsWithStatus(statusOutput: string, workDirPrefix: string): DirtyPathEntry[];
export declare function computeRunModifiedPaths(preRunDirtyPaths: string[], currentStatusOutput: string, workDirPrefix: string): {
    tracked: string[];
    untracked: string[];
};
