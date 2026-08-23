/**
 * Append-only journal of snapcompact tool-result savings.
 *
 * Snapcompact frames are transient — built per provider request in
 * `transformProviderContext` and never written to session.jsonl — so the tokens
 * they keep off the wire would otherwise leave no trace. This records one line
 * the FIRST time a tool result is imaged in a session:
 *
 *   {"ts":<epochMs>,"session":<sessionFile>,"provider":..,"model":..,"toolCallId":..,"savedTokens":..}
 *
 * Newline-delimited JSON, opened with O_APPEND so concurrent appenders (parallel
 * agents/subagents) never interleave a partial line. Writes are fire-and-forget;
 * a failure is logged at debug and never propagates into the request hot path.
 *
 * Readers MUST dedup by (session, toolCallId): a session resumed in a fresh
 * process re-images the same results and may append a second line. The savings
 * for a given (session, toolCallId) are stable, so any-per-key is correct.
 */
import type { Model } from "@oh-my-pi/pi-ai";
export interface SnapcompactSavingsRecord {
    /** Epoch milliseconds when the swap was applied. */
    ts: number;
    /** Session file path (matches the stats `messages.session_file` key). */
    session: string;
    provider: string;
    model: string;
    toolCallId: string;
    savedTokens: number;
}
/** `~/.omp/.../snapcompact-savings.jsonl`, colocated with stats.db. */
export declare function snapcompactSavingsJournalPath(): string;
/**
 * Appends savings to the journal, deduped by toolCallId for the recorder's
 * lifetime (one per session). Returns the in-flight append so callers/tests can
 * await durability; the production transform leaves it floating (fire-and-forget,
 * and it never rejects — I/O errors are swallowed to debug). `getSession` is read
 * at write time so a session file assigned late is still captured; a null session
 * (in-memory / SDK embedding) or non-positive savings skip the write.
 */
export type SnapcompactSavingsRecorder = (savings: ReadonlyArray<{
    toolCallId: string;
    savedTokens: number;
}>, model: Model) => Promise<void>;
export declare function createSnapcompactSavingsRecorder(getSession: () => string | null, journalPath?: string): SnapcompactSavingsRecorder;
/** Read all journal records. Malformed lines are skipped; a missing file is empty. */
export declare function readSnapcompactSavingsJournal(journalPath?: string): Promise<SnapcompactSavingsRecord[]>;
