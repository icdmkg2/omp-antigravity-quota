/**
 * Record (or replace) the indexed title for a session id. Best-effort: index
 * failures must never break a rename, so errors are logged and swallowed.
 */
export declare function recordSessionTitle(sessionId: string, title: string): void;
/** Indexed title for a session id, or undefined when unindexed/unavailable. */
export declare function lookupSessionTitle(sessionId: string): string | undefined;
/** @internal Close the cached connection so the next call re-resolves the db path — test-only. */
export declare function resetSessionTitleIndexForTests(): void;
