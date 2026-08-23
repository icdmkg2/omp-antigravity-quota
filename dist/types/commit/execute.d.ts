/**
 * Shared commit-execution helpers for the agentic and legacy `omp commit`
 * pipelines: readable failure reporting for refusing git hooks and a push
 * wrapper that keeps a requested `--push` honest.
 */
import * as git from "../utils/git.js";
/**
 * A commit or push failure that has already been reported to the user with a
 * readable message. It is thrown so the CLI exits non-zero without the runtime
 * dumping a stack trace — in a bundled build that trace is several kilobytes of
 * minified source, which buries the one line the user needs (issue #7834).
 *
 * `runCommitCommand`'s caller (`commands/commit.ts`) maps this to exit code 1.
 */
export declare class CommitAbortedError extends Error {
    constructor();
}
/**
 * Print a git-command failure — most often a `pre-commit`/`commit-msg` hook
 * that exited non-zero — as an indented message under `context`, then abort.
 *
 * @param context Label for the failed step, e.g. `"Commit 1 of 2 failed"`.
 * @param error The failure to surface; its captured stderr/stdout is shown.
 * @param note Optional trailing status line (split-plan progress, recovery).
 */
export declare function abortOnGitFailure(context: string, error: git.GitCommandError, note?: string): never;
/**
 * Push the current branch, reporting a refused push (missing upstream, rejected
 * ref) through {@link abortOnGitFailure} instead of letting the raw
 * `GitCommandError` escape. Prints the success line on completion.
 */
export declare function pushOrAbort(cwd: string): Promise<void>;
