import { type SessionStorage } from "./session-storage.js";
/**
 * Coarse lifecycle status of a session, derived from its last persisted message.
 *
 * - `complete` — the last assistant turn ended with no unanswered tool calls, i.e.
 *   the agent yielded control back to the user.
 * - `interrupted` — work was cut off mid-flight: a trailing assistant turn with
 *   pending tool calls, a trailing tool result the agent never continued from, or
 *   a length-truncated turn.
 * - `aborted` — the last assistant turn was cancelled by the user.
 * - `error` — the last assistant turn ended in an error.
 * - `pending` — a trailing user message with no assistant reply persisted after it.
 * - `unknown` — status could not be determined (empty/header-only session, or the
 *   final message was larger than the tail window that was read).
 */
export type SessionStatus = "complete" | "interrupted" | "aborted" | "error" | "pending" | "unknown";
export interface SessionInfo {
    path: string;
    id: string;
    /** Working directory where the session was started. Empty string for old sessions. */
    cwd: string;
    title?: string;
    /** Path to the parent session (if this session was forked). */
    parentSessionPath?: string;
    created: Date;
    modified: Date;
    messageCount: number;
    /** File size in bytes on disk; used for compact list rendering. */
    size: number;
    firstMessage: string;
    allMessagesText: string;
    /**
     * Coarse lifecycle status from the session's last persisted message. Optional:
     * synthesized {@link SessionInfo}s (cross-project stubs, tests) leave it unset.
     */
    status?: SessionStatus;
}
export interface ResolvedSessionMatch {
    session: SessionInfo;
    scope: "local" | "global";
}
/** Lightweight metadata for a recent session, used in welcome/picker UI. */
export interface RecentSessionInfo {
    path: string;
    name: string;
    timeAgo: string;
}
/**
 * Promote orphaned `<basename>.jsonl.<snowflake>.bak` backups created by the
 * EPERM-rewrite path back to their primary path when the primary is missing.
 * This runs once per session-dir scan, before the main `*.jsonl` glob, so a
 * crash between the two renames in the EPERM-rewrite path does not leave the
 * user's last good state stranded outside the loader's view.
 *
 * Exported for testing.
 */
export declare function recoverOrphanedBackups(sessionDir: string, storage: SessionStorage): Promise<void>;
/**
 * List sessions in a resolved session directory (newest first), reading each
 * file's lifecycle {@link SessionStatus}.
 */
export declare function listSessions(sessionDir: string, storage: SessionStorage): Promise<SessionInfo[]>;
/**
 * List sessions without repairing orphaned backups or mutating the directory.
 */
export declare function listSessionsReadOnly(sessionDir: string, storage: SessionStorage): Promise<SessionInfo[]>;
/** List all sessions across all project directories (newest first). */
export declare function listAllSessions(storage?: SessionStorage): Promise<SessionInfo[]>;
/** Exported for testing */
export declare function findMostRecentSession(sessionDir: string, storage?: SessionStorage): Promise<string | null>;
/**
 * Get recent sessions for display in the welcome screen.
 *
 * Deliberately avoids {@link scanSessionDir}'s full-directory content scan
 * (multi-hundred-ms with thousands of sessions): lists files, sorts by mtime,
 * and resolves names for the newest `limit` files from the history.db title
 * index. Files without an indexed title (legacy sessions, branch/fork copies)
 * fall back to a per-file header scan whose title — when present — is
 * backfilled into the index so the next launch skips the read.
 */
export declare function getRecentSessions(sessionDir: string, limit?: number, storage?: SessionStorage): Promise<RecentSessionInfo[]>;
/** Controls cross-directory fallback for resumable session lookup. */
export interface ResolveResumableSessionOptions {
    /** Search default global session buckets after the active/custom session directory misses. */
    allowGlobalFallback?: boolean;
}
export declare function resolveResumableSession(sessionArg: string, cwd: string, sessionDir?: string, storageOrOptions?: SessionStorage | ResolveResumableSessionOptions, options?: ResolveResumableSessionOptions): Promise<ResolvedSessionMatch | undefined>;
