/**
 * Strip alias definitions brush's whitespace-only expander cannot execute.
 *
 * Returns the rewritten snapshot plus the list of dropped alias names so the
 * caller can surface them in the debug log.
 */
export declare function sanitizeSnapshotForBrush(content: string): {
    content: string;
    dropped: string[];
};
/**
 * Create a shell snapshot, caching the result.
 * Returns the path to the snapshot file, or null if creation failed.
 *
 * `timeoutMs` is configurable so callers exercising failure handling do not
 * have to wait out the production startup budget.
 */
export declare function getOrCreateSnapshot(shell: string, env: Record<string, string | undefined>, timeoutMs?: number): Promise<string | null>;
