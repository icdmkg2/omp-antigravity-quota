/**
 * AgentRegistry - Process-global registry of agents (the main session plus
 * every subagent), keyed by stable id.
 *
 * Tracks each agent's status and (when live) its AgentSession so peers can be
 * addressed by id (`hub`, `task resume`, `history://`). Sessions are
 * registered explicitly at creation; finished agents stay registered as
 * `idle` (live) or `parked` (session disposed, ref + sessionFile retained for
 * revival) and are only removed on explicit release/teardown.
 */
import type { AgentSession } from "../session/agent-session.js";
export declare const MAIN_AGENT_ID = "Main";
export declare function getAgentTombstonePath(sessionFile: string): string;
/**
 * - `running`: a turn is in flight.
 * - `idle`: live AgentSession in memory, awaiting work. Finished agents are
 *   `idle`, not removed.
 * - `parked`: session disposed; AgentRef + sessionFile retained, revivable.
 * - `aborted`: hard-killed, terminal.
 */
export type AgentStatus = "running" | "idle" | "parked" | "aborted";
/** Provenance of a displayed duration: active runtime, transcript span, or unavailable. */
type AgentDurationKind = "active" | "span" | "unknown";
/**
 * - `main`/`sub`: the user-facing agent tree (driving agent + task subagents).
 * - `advisor`: a passive review transcript persisted like a subagent for usage
 *   attribution and Agent Hub observability, but never a peer — hidden from
 *   agent-facing rosters (`hub`, `history://`) and not messageable/revivable.
 */
export type AgentKind = "main" | "sub" | "advisor";
/** Persisted per-agent totals reconstructed from the child session transcript. */
export interface AgentMetricsSummary {
    tokens: number;
    requests: number;
    tools: number;
    cost: number;
    durationMs: number;
    durationKind?: AgentDurationKind;
    contextTokens?: number;
    contextWindow?: number;
}
/** Historical identity and telemetry that remain available after the live session is disposed. */
export interface AgentHistorySummary {
    agent?: string;
    modelRole?: string;
    resolvedModel?: string;
    /** Whether the last resolved model was selected by retry fallback routing. */
    resolvedModelIsFallback?: boolean;
    metrics?: AgentMetricsSummary;
    readOnly?: boolean;
    /** Durable task output artifact, when the executor wrote one. */
    outputPath?: string;
    /** Captured isolated-worktree patch, when patch capture succeeded. */
    patchPath?: string;
    /** Isolated branch identity, when branch-mode capture succeeded. */
    branchName?: string;
}
export interface AgentRef {
    id: string;
    displayName: string;
    kind: AgentKind;
    parentId?: string;
    status: AgentStatus;
    /** Null exactly when parked/aborted. */
    session: AgentSession | null;
    sessionFile: string | null;
    createdAt: number;
    lastActivity: number;
    /** Short gist of what the agent is currently doing (latest intent or tool), for the work-aware roster. Display-only. */
    activity?: string;
    /** Persisted identity and telemetry restored after the live observer is gone. */
    history?: AgentHistorySummary;
}
export type AgentRefExpectation = AgentRef | AgentSession;
export type RegistryEvent = {
    type: "registered";
    ref: AgentRef;
} | {
    type: "status_changed";
    ref: AgentRef;
} | {
    type: "metadata_changed";
    ref: AgentRef;
} | {
    type: "removed";
    ref: AgentRef;
};
type RegistryListener = (event: RegistryEvent) => void;
export interface RegisterInput {
    id: string;
    displayName: string;
    kind: AgentKind;
    parentId?: string;
    session: AgentSession | null;
    sessionFile?: string | null;
    status?: AgentStatus;
    /** Last persisted task summary, when restoring a historical agent. */
    activity?: string;
    /** Original registration timestamp, when known from persisted history. */
    createdAt?: number;
    /** Last transcript activity timestamp, when known from persisted history. */
    lastActivity?: number;
    /** Persisted identity and telemetry restored after the live observer is gone. */
    history?: AgentHistorySummary;
}
export declare class AgentRegistry {
    #private;
    static global(): AgentRegistry;
    /** Reset the global registry. Test-only. */
    static resetGlobalForTests(): void;
    register(input: RegisterInput): AgentRef;
    /**
     * Register a new id only when it is absent, or reuse the exact detached
     * `parked` ref a revival was authorized to revive. A missing, replaced, or
     * terminal expected ref is a failed CAS: delayed revivers must never claim an
     * id after its prior generation disappeared or was hard-killed.
     */
    registerIfAvailable(input: RegisterInput, expected: AgentRef | null): AgentRef | undefined;
    /** Attach transcript-derived identity and telemetry without changing lifecycle state. */
    setHistory(id: string, history: AgentHistorySummary, expectedSessionFile?: string): boolean;
    setStatus(id: string, status: AgentStatus, expected?: AgentRefExpectation): boolean;
    /**
     * Record a short activity gist for the work-aware roster. Display-only and
     * read on demand (`irc list`, peer roster), so it emits no event — keeping
     * the per-tool-call update rate off the registry listener path (same as
     * `attachSession`, which also bumps `lastActivity` without emitting). Only a
     * `running` agent has current work: a heartbeat for any other status is
     * dropped, so a late progress flush can't resurrect activity on a ref that
     * `setStatus` just cleared. Every running heartbeat refreshes `lastActivity`
     * — even when the gist text is unchanged — so the roster's "active … ago" and
     * recency sort track real work, not just the last status change.
     * The gist is normalized to one bounded line (`oneLineLabel`) so model-derived
     * intent text can neither break the roster nor smuggle terminal escapes —
     * every caller is safe without sanitizing at its own call site.
     */
    setActivity(id: string, activity: string): void;
    attachSession(id: string, session: AgentSession, sessionFile?: string | null, expected?: AgentRefExpectation): boolean;
    detachSession(id: string, expected?: AgentRefExpectation): boolean;
    unregister(id: string, expected?: AgentRefExpectation): boolean;
    get(id: string): AgentRef | undefined;
    list(): AgentRef[];
    /**
     * Returns every alive agent (running | idle) except the caller. Advisor refs
     * are observability-only transcripts, never peers, so they are excluded.
     * Flat namespace: every other agent is visible.
     */
    listVisibleTo(id: string): AgentRef[];
    /** Whether a ref's claimed running state is corroborated by its attached live session. */
    isRunning(ref: AgentRef): boolean;
    /** Mirror a session's authoritative run-state notifications into its owned registry ref. */
    syncSessionStatus(id: string, session: AgentSession): () => void;
    onChange(listener: RegistryListener): () => void;
}
export {};
