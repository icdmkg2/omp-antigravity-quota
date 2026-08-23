/** A unique prompt with provenance from its most recent submission. */
export interface HistoryEntry {
    /** Stable row identifier used by the full-text index. */
    id: number;
    /** Trimmed prompt text, unique across the history database. */
    prompt: string;
    /** Unix timestamp of the most recent submission. */
    created_at: number;
    /** Project working directory of the most recent submission. */
    cwd?: string;
    /** Session ID of the most recent submission, if known. */
    sessionId?: string;
}
/** Stores searchable prompts with only their latest project and session metadata. */
export declare class HistoryStorage {
    #private;
    private constructor();
    /** Opens the process-wide prompt history database. */
    static open(dbPath?: string): HistoryStorage;
    /** @internal Reset the singleton and close its database — test-only. */
    static resetInstance(): void;
    /**
     * Register a resolver that supplies the current session ID for prompts added
     * without an explicit `sessionId`. Evaluated synchronously at `add()` time so
     * batched writes capture the session active when the prompt was submitted.
     */
    setSessionResolver(resolver: () => string | undefined): void;
    /** Stores a prompt and replaces its provenance with the latest submission. */
    add(prompt: string, cwd?: string, sessionId?: string): Promise<void>;
    /** Returns unique prompts ordered by their most recent submission. */
    getRecent(limit: number): HistoryEntry[];
    /** Finds unique prompts matching every query token, newest first. */
    search(query: string, limit: number): HistoryEntry[];
    /**
     * IDs of the sessions whose stored prompts match `query`, ordered by prompt
     * recency and de-duplicated. Used to augment session ranking in the resume
     * picker with prompts that the 4KB session-list prefix never sees.
     */
    matchingSessionIds(query: string, limit?: number): string[];
}
