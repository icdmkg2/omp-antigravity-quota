import type { SessionStorage } from "./session-storage.js";
export declare function resolveManagedSessionRoot(sessionDir: string, cwd: string): string | undefined;
/**
 * Compute the default session directory for a cwd.
 * Classifies cwd by canonical location so symlink/alias paths resolve to the
 * same home-relative or temp-root directory names as their real targets.
 */
export declare function computeDefaultSessionDir(cwd: string, storage: SessionStorage, sessionsRoot?: string): string;
/**
 * Write a breadcrumb linking the current terminal to a session file.
 * The breadcrumb contains the cwd and session path so --continue can
 * find "this terminal's last session" even when running concurrent instances.
 *
 * `fresh` marks a `/new` (or freshly-minted) session boundary whose JSONL is
 * not yet materialized (new-session persistence is lazy until assistant output
 * exists). A fresh breadcrumb is honored by {@link readTerminalBreadcrumbEntry}
 * even when its target file is still absent, so relaunch/auto-resume reopens the
 * post-`/new` session instead of falling back to the pre-`/new` transcript. Once
 * the session materializes the caller rewrites the breadcrumb with `fresh:false`
 * so a later external delete is still treated as a genuinely stale crumb.
 */
export declare function writeTerminalBreadcrumb(cwd: string, sessionFile: string, fresh?: boolean): void;
export interface TerminalBreadcrumb {
    cwd: string;
    sessionFile: string;
    /** The recorded session file exists on disk right now. */
    exists: boolean;
    /** Recorded as a `/new` fresh-session boundary whose JSONL may not exist yet. */
    fresh: boolean;
}
/**
 * Read the raw terminal breadcrumb for the current terminal.
 * Returns the recorded cwd + session file regardless of whether the recorded
 * cwd still matches the current one. Callers decide how to interpret a cwd
 * mismatch (e.g. a moved/renamed worktree).
 *
 * A missing target file yields `null` UNLESS the breadcrumb is a `fresh`
 * boundary — a lazy `/new` session whose JSONL was never written — in which case
 * the entry is returned with `exists:false` so the caller can distinguish it
 * from a genuinely stale/deleted breadcrumb.
 */
export declare function readTerminalBreadcrumbEntry(): Promise<TerminalBreadcrumb | null>;
