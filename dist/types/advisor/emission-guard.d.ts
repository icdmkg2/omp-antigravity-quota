/**
 * Per-session policy gate for advisor `advise()` calls.
 *
 * The advisor system prompt tells the watcher model:
 *
 * > at most one `advise` per update
 * > NEVER repeat advice you already gave, and NEVER send the same advice twice
 *
 * Real advisor models violate this. Issue #3520 captured a session where
 * `__advisor.jsonl` recorded 309 `advise` calls covering 92 unique notes —
 * 114× `Stop.`, 52× `No issue; continue.`, 41× `Done.` — flooding the primary
 * transcript with `<advisory severity="blocker">Stop.</advisory>` after the
 * task was already complete. The fix is to make the rules load-bearing in code
 * instead of prose: silently drop duplicates, content-free self-talk, and
 * over-budget calls at the `enqueueAdvice` boundary so the primary stays
 * clean even when the advisor misbehaves.
 *
 * The gate is intentionally invisible to the advisor model — `AdviseTool`
 * still returns `Recorded.` for a suppressed call. Surfacing "suppressed"
 * back into advisor context risks the model rephrasing the same useless note
 * to bypass the dedupe ("Stop.", then "Halt." then "Stop now.").
 */
/**
 * Case-insensitive, punctuation-folded normalization. Collapses every run of
 * non-letter / non-digit characters into a single space and trims, so
 * `"Stop."`, `"*Stop*"`, and `"  stop  "` all key to `stop`, while
 * `"No issue; continue."` keys to `no issue continue`.
 *
 * Exported for tests.
 */
export declare function normalizeAdvisorNote(note: string): string;
/**
 * Decides whether an advisor `advise()` call should reach the primary agent.
 *
 * Enforces — in this order — the noise filter, session-scoped exact-text
 * dedupe (FIFO-evicted at {@link DEFAULT_HISTORY_CAPACITY}), and a per-update
 * rate limit of one accepted note per advisor model prompt. Suppressed calls
 * never consume the per-update budget — a noise call doesn't burn the slot
 * for a real concern that follows in the same update.
 *
 * Reset on advisor reset (compaction, session switch, `/new`) via
 * {@link reset}. Per-update gate is cleared at the start of every advisor
 * `agent.prompt()` cycle via {@link beginUpdate}.
 */
export declare class AdvisorEmissionGuard {
    #private;
    constructor(opts?: {
        capacity?: number;
    });
    /**
     * Drop all dedupe and per-update state. Called from
     * `AgentSession#resetAdvisorSessionState()` whenever the advisor runtime is
     * reset — same boundary as `yieldQueue.clear("advisor")`, so a re-primed
     * advisor can re-raise old issues (the primary transcript was rewritten).
     */
    reset(): void;
    /**
     * Clear the per-update rate-limit gate. Called by `AdvisorRuntime` right
     * before each `agent.prompt(batch)` invocation so the next advisor model
     * cycle starts with a fresh budget of one advise.
     */
    beginUpdate(): void;
    /**
     * Whether the proposed note should reach the primary. On `true` the gate
     * has already recorded the note (consumed the per-update budget and added
     * it to the dedupe history) — caller delivers the note. On `false` the
     * caller drops it.
     *
     * Empty / whitespace-only notes are suppressed; the model's
     * tool-args contract still requires a non-empty string but defense-in-depth.
     */
    accept(note: string): boolean;
}
