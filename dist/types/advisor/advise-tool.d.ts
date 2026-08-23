import type { AgentIdentity, AgentTelemetryConfig, AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
declare const adviseSchema: import("@oh-my-pi/omptype").FluentType<{
    note: string;
    severity?: "blocker" | "concern" | "nit" | undefined;
}, {
    note: string;
    severity?: "blocker" | "concern" | "nit" | undefined;
}>;
export type AdviseParams = typeof adviseSchema.infer;
export type AdvisorSeverity = "nit" | "concern" | "blocker";
export interface AdviseDetails {
    note: string;
    severity?: AdvisorSeverity;
    /** Which configured advisor produced this note (omitted for the default advisor). */
    advisor?: string;
}
/** One queued advice note. */
export interface AdvisorNote {
    note: string;
    severity?: AdvisorSeverity;
    /** Which configured advisor produced this note (omitted for the default advisor). */
    advisor?: string;
}
/** Details payload on the batched `advisor` custom message rendered in the transcript. */
export interface AdvisorMessageDetails {
    notes: AdvisorNote[];
}
/**
 * Render a batch of advisor notes as the agent-facing message body: one
 * `<advisory>` element per note, severity as an attribute. Shared by the
 * non-interrupting YieldQueue dispatcher and the interrupting steer path so both
 * build byte-identical content.
 */
export declare function formatAdvisorBatchContent(notes: readonly AdvisorNote[]): string;
/**
 * Whether advice at this severity should interrupt the running agent (delivered
 * via the steering channel, aborting in-flight tools) rather than ride the
 * non-interrupting aside queue that lands at the next step boundary. `concern`
 * and `blocker` interrupt; a plain `nit` queues.
 */
export declare function isInterruptingSeverity(severity: AdvisorSeverity | undefined): boolean;
/** How an advisor note is routed to the primary. */
export type AdvisorDeliveryChannel = "aside" | "steer" | "preserve";
/** Half-open turn-count fence for the post-interrupt cooldown. */
export declare function isAdvisorInterruptImmuneTurnActive(opts: {
    completedTurns: number;
    immuneTurnStart: number | undefined;
    immuneTurns: number;
}): boolean;
/**
 * Decide how one advisor note reaches the primary agent.
 *
 * - A `preserveOnly` caller records every note that arrives while the primary
 *   is idle as a visible card and never starts a new primary turn.
 * - A non-interrupting `nit` always rides the non-interrupting aside queue.
 * - An interrupting `concern`/`blocker` is normally steered into the agent: into
 *   the live turn while one is streaming, or (when idle) a triggered turn so the
 *   advice is acted on immediately.
 * - If the primary tail is already a terminal text answer and there is no queued
 *   work, a late `concern` is preserved as a visible card instead of waking the
 *   primary to restate completion. A `blocker` is the exception: it means the
 *   agent handed off broken or unexercised work, so it still steers a triggered
 *   turn to force the primary to acknowledge and continue before the turn is
 *   considered done (#5628) — deferring it to the next user turn is the bug.
 * - After a deliberate user interrupt (`autoResumeSuppressed`) the advisor must
 *   not auto-resume the stopped run. While the agent is idle — or still tearing
 *   the interrupted turn down (`aborting`) — the note is preserved as a visible
 *   card instead of restarting the run. But once a turn is actively streaming
 *   again (a resume the user already drove), steering the note in does NOT
 *   auto-resume anything, so it is delivered live. Parking it during an active
 *   run instead strands it (it never reaches the running agent) and the withheld
 *   notes dump as one burst at the next user prompt — the bug this guards.
 * - During the post-interrupt immune-turn window, further `concern` notes are
 *   downgraded to asides; preservation still wins. A `blocker` is exempt: it
 *   means the agent handed off broken or unexercised work, so it still steers a
 *   triggered turn even right after a prior interrupt (#5628).
 */
export declare function resolveAdvisorDeliveryChannel(opts: {
    severity: AdvisorSeverity | undefined;
    autoResumeSuppressed: boolean;
    streaming: boolean;
    aborting: boolean;
    terminalAnswerNoQueuedWork?: boolean;
    interruptImmuneTurnActive?: boolean;
    preserveOnly?: boolean;
}): AdvisorDeliveryChannel;
/**
 * Derive the advisor loop's telemetry from the primary session's config so the
 * advisor model's GenAI spans and usage/cost hooks (onChatUsage, onCostDelta,
 * costEstimator) fire under the same pipeline as every other model call —
 * stamped with the advisor's own agent identity. `conversationId` is cleared so
 * the advisor loop falls back to its own `-advisor` session id for
 * `gen_ai.conversation.id` instead of inheriting the primary's conversation.
 *
 * Returns undefined when the primary has no telemetry (instrumentation off), so
 * the advisor `Agent` stays a zero-overhead no-op as well.
 */
export declare function deriveAdvisorTelemetry(primaryTelemetry: AgentTelemetryConfig | undefined, identity: AgentIdentity): AgentTelemetryConfig | undefined;
/**
 * The tools an advisor receives by default when its config omits `tools` — the
 * read-only investigative set. The full available pool is every built tool the
 * session has (the advisor is a full agent); a config's `tools` selects from it.
 */
export declare const ADVISOR_DEFAULT_TOOL_NAMES: ReadonlySet<string>;
export declare class AdviseTool implements AgentTool<typeof adviseSchema, AdviseDetails> {
    #private;
    private readonly onAdvice;
    readonly name = "advise";
    readonly label = "Advise";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        note: string;
        severity?: "blocker" | "concern" | "nit" | undefined;
    }, {
        note: string;
        severity?: "blocker" | "concern" | "nit" | undefined;
    }>;
    readonly intent: "omit";
    constructor(onAdvice: (note: string, severity?: AdviseDetails["severity"]) => void);
    /**
     * Mark whether the next advisor prompt reviews an in-progress primary turn.
     * Non-blockers are withheld until a completed update so partial work does
     * not interrupt the primary before it can finish its planned steps.
     */
    beginUpdate(inProgress: boolean): void;
    /** Clear delivered-note memory when the advisor starts a fresh conversation. */
    resetDeliveredNotes(): void;
    execute(_toolCallId: string, args: AdviseParams, _signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<AdviseDetails>, _context?: AgentToolContext): Promise<AgentToolResult<AdviseDetails>>;
}
export {};
