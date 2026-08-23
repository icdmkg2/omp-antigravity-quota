/**
 * Lock-file handling for the split-commit workflow.
 *
 * The commit agent hides these machine-generated files from analysis so the
 * model does not waste tokens on them and does not treat them as evidence for
 * commit boundaries. That leaves them staged but unseen: without deterministic
 * post-plan placement the split validator rejects the plan with
 * `Split commit plan missing staged files: <lockfile>`, and the executor
 * (`git stage.reset` -> per-group `stage.hunks`) would silently drop the file
 * if the validator were skipped. See issue #4632.
 */
import type { SplitCommitPlan } from "./state.js";
/**
 * Lock file basename -> ordered sibling manifests. Order matters: the first
 * manifest present in a commit group's changes wins.
 */
export declare const LOCK_FILE_MANIFESTS: Readonly<Record<string, readonly string[]>>;
/**
 * Lock-file basenames the commit agent excludes from `git_overview` output and
 * from split-commit validation. Derived from {@link LOCK_FILE_MANIFESTS} so a
 * single edit keeps both the analysis filter and the post-plan pairing in sync.
 */
export declare const EXCLUDED_LOCK_FILES: ReadonlySet<string>;
/**
 * Attach staged lock files the model never saw to the split plan.
 *
 * Placement precedence per lock file:
 *   1. commit group that touches a sibling manifest (same directory)
 *   2. commit group that touches a manifest in any directory
 *   3. last commit group (fallback)
 *
 * Mutates {@link plan} in place. No-ops on an empty plan, on lock files
 * already present in some commit group, and on staged files that are not
 * recognized lock files.
 */
export declare function assignLockFilesToPlan(plan: SplitCommitPlan, stagedFiles: readonly string[]): void;
