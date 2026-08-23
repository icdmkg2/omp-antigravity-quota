import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
/**
 * Reserved transcript stem for advisor session files. Chosen so it cannot
 * collide with a task subagent's `<id>.jsonl` (task ids are reserved against
 * this exact stem in {@link AgentOutputManager}).
 */
export declare const ADVISOR_TRANSCRIPT_STEM = "__advisor";
export declare const ADVISOR_TRANSCRIPT_FILENAME = "__advisor.jsonl";
/**
 * Transcript filename for an advisor: `__advisor.jsonl` for the legacy/default
 * advisor (empty slug), `__advisor.<slug>.jsonl` for a named advisor. The `.`
 * separator keeps named files out of the output manager's `-<n>` bump namespace.
 */
export declare function advisorTranscriptFilename(slug: string): string;
/** Whether a filename is any advisor transcript (`__advisor.jsonl` or `__advisor.<slug>.jsonl`). */
export declare function isAdvisorTranscriptName(name: string): boolean;
/**
 * Sum the advisor spend already persisted next to a primary session transcript,
 * keyed by advisor slug.
 *
 * The ledger a session keeps in memory only covers the current process, so a
 * resumed session would report zero until the next advisor turn. The recorded
 * transcripts are the durable copy of exactly the same finalized messages, so
 * they are read back through the shared loader - no lock, no writer, and no
 * second parser to keep in step with the session format.
 *
 * Only the session's own advisors count: subagent advisors write to
 * `<session>/<SubId>/__advisor.jsonl`, and their spend belongs to the subagent,
 * not to this roster. Hence the scan stays at the top level of the directory.
 */
export declare function loadAdvisorTranscriptCosts(sessionFile: string | undefined): Promise<Map<string, number>>;
/**
 * Append-only persister for an advisor agent's transcript.
 *
 * The advisor is a passive reviewer with its own model usage, so — like a task
 * subagent — its turns are written to a JSONL inside the owning session's
 * artifacts dir (`<session>/__advisor.jsonl`, `<session>/<SubId>/__advisor.jsonl`
 * for subagent advisors). That single file gives the advisor model proper usage
 * attribution in `omp stats` (the stats parser scans the session dir
 * recursively) and a read-only transcript in the Agent Hub, without making the
 * advisor a registered, messageable peer.
 *
 * The target is derived from the *session file* (`getSessionFile()`), never
 * `getArtifactsDir()` — subagents adopt the parent's artifact manager, so the
 * artifacts dir points at the parent root and every subagent advisor would
 * collide. The file path is resolved synchronously when a message finalizes and
 * captured for the queued write, so a `/new`, resume, or session switch in
 * flight can never misattribute an old advisor turn into the new session's file.
 * On such a switch the previous writer is closed and the new file opened on the
 * next recorded turn. The recorder never truncates: the advisor's in-memory
 * context resets/compacts independently, but every billed turn is appended here.
 */
export declare class AdvisorTranscriptRecorder {
    #private;
    private readonly resolveSessionFile;
    private readonly resolveCwd;
    /**
     * @param filename Transcript filename within the session dir. Defaults to
     *   `__advisor.jsonl`; named advisors pass `__advisor.<slug>.jsonl` via
     *   {@link advisorTranscriptFilename}.
     * @param after Optional barrier the queue starts behind — used on the advisor
     *   on→off→on toggle so a fresh recorder's first `open` waits for the prior
     *   recorder's `close` and the two never hold the same file at once.
     */
    constructor(resolveSessionFile: () => string | undefined, resolveCwd: () => string, filename?: string, after?: Promise<unknown>);
    /**
     * Persist one finalized advisor message. Assistant turns carry the usage the
     * stats parser reads; tool results round out the Hub transcript; user deltas
     * (the advisor's "session update" prompts) are persisted but flagged
     * `synthetic`/agent-attributed so they never inflate user-message metrics.
     * Non-conversational message kinds are skipped.
     */
    record(message: AgentMessage): void;
    /** Flush pending writes (best-effort). */
    flush(): Promise<void>;
    /** Flush and close the writer, releasing the session file. */
    close(): Promise<void>;
}
