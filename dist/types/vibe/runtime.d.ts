import type { AsyncJobManager } from "../async/job-manager.js";
import { SessionManager } from "../session/session-manager.js";
import type { ToolSession } from "../tools/index.js";
/** The two worker CLI flavors the director drives. */
export type VibeCli = "fast" | "good";
/**
 * CLI flavor → bundled agent type. This IS the model-tier mapping: `sonic`
 * carries `model: "@smol"` (the configured fast/low-latency role) and `task`
 * carries `model: "@task"` (inherits the session's strong model).
 * Resolution goes through {@link resolveAgentModelSelection} exactly like a
 * `task` spawn, so `task.agentModelOverrides` and model-role settings apply.
 */
export declare const VIBE_CLI_AGENT: Record<VibeCli, string>;
/** Worker session lifecycle as shown to the director. */
export type VibeSessionState = "starting" | "running" | "idle" | "dead";
export interface VibeOwnerScope {
    ownerId: string;
    parentSessionId: string;
    parentSessionFile: string | null;
}
export interface VibeParentSession {
    getAgentId?: () => string | null;
    getSessionId?: () => string | null;
    getSessionFile: () => string | null;
    sessionManager?: ToolSession["sessionManager"] & Partial<Pick<SessionManager, "appendModeChange" | "appendEntriesAtomically" | "recoverPersistenceFromCurrentState">>;
    asyncJobManager?: AsyncJobManager;
    settings: ToolSession["settings"];
    getActiveModelString?: () => string | undefined;
    getModelString?: () => string | undefined;
}
/**
 * Live per-session "screen" for rich rendering: what the worker is doing right
 * now (tool trace, current tool, streamed text tail) plus roster metadata.
 * Every string is already one-line sanitized.
 */
export interface VibeScreenSnapshot {
    id: string;
    cli: VibeCli;
    state: VibeSessionState;
    model?: string;
    turns: number;
    queued: number;
    /** Start of the in-flight turn, when running. */
    turnStartedAt?: number;
    /** Gist of the message that started the in-flight turn. */
    turnMessage?: string;
    currentTool?: string;
    currentToolArgs?: string;
    lastIntent?: string;
    /** Completed tool calls of the in-flight turn, oldest first (tail). */
    trace: string[];
    /** Latest streamed worker text lines, oldest first. */
    outputTail: string[];
    lastActivity?: string;
    lastActivityAt: number;
}
export interface VibeSpawnOutcome {
    id: string;
    jobId: string;
}
export interface VibeSendOutcome {
    id: string;
    /**
     * - `turn`: a new background turn was started (`jobId` set).
     * - `steered`: worker was mid-turn and streaming; delivered as steering.
     * - `queued`: worker was mid-turn but not steerable; drained into the next turn.
     */
    mode: "turn" | "steered" | "queued";
    jobId?: string;
}
export interface VibeKillOutcome {
    id: string;
    /** True when an in-flight turn job was cancelled along the way. */
    cancelledTurn: boolean;
}
export interface VibeWaitOutcome {
    /** Watched sessions whose snapshotted turn settled during (or before) the wait.
     * May overlap `stillRunning` when a queued follow-up turn already started. */
    settled: Array<{
        id: string;
        jobId: string;
        status: "completed" | "failed" | "cancelled";
        resultText: string;
    }>;
    /** Watched sessions with a turn in flight when the wait returned. */
    stillRunning: string[];
    timedOut: boolean;
}
/** Child ids claimed by valid Vibe spawn records from untrusted persisted JSON. */
export declare function persistedVibeChildIds(entries: Iterable<unknown>): Set<string>;
/** Thrown from a turn job body so the job manager marks the job failed while carrying the formatted result. */
export declare class VibeTurnError extends Error {
}
/**
 * Process-global registry of vibe worker sessions, scoped by both owner agent
 * id and stable parent session id. Persisted lifecycle events rebuild idle
 * records after a process restart; live turn jobs remain process-local.
 */
export declare class VibeSessionRegistry {
    #private;
    static global(): VibeSessionRegistry;
    /** Reset the global registry. Test-only. */
    static resetGlobalForTests(): void;
    /**
     * Insert a bare worker record without the spawn machinery. Test-only —
     * lets focused runtime tests attach an optional synthetic in-flight job.
     */
    registerRecordForTests(record: {
        id: string;
        cli?: VibeCli;
        ownerId: string;
        state?: VibeSessionState;
        jobId?: string;
    }): void;
    /** Override the teardown grace period for deterministic lifecycle tests. */
    setTeardownGraceForTesting(timeoutMs: number): void;
    ownerScope(session: VibeParentSession): VibeOwnerScope;
    /** Re-open spawn admission after an explicit Vibe-mode entry. */
    activateScope(scope: VibeOwnerScope): void;
    listIds(session: ToolSession): string[];
    /** Ids of every live worker owned by `ownerId`, across all parent scopes (status-line tok/s aggregation). */
    listIdsByOwner(ownerId: string): string[];
    /**
     * Live screen snapshots for rich rendering (the "TV wall"): one entry per
     * session in creation order, carrying the in-flight turn's trace, current
     * tool, and streamed text tail. All strings are one-line sanitized here so
     * renderers can print them verbatim.
     */
    screens(session: ToolSession, ids?: string[]): VibeScreenSnapshot[];
    /** Reconcile resumable and terminal workers from the persisted parent journal. */
    rehydrate(session: VibeParentSession): Promise<number>;
    /** Spawn a persistent worker session and start its first turn in the background. */
    spawn(session: ToolSession, args: {
        cli: VibeCli;
        name?: string;
        prompt: string;
    }): Promise<VibeSpawnOutcome>;
    /**
     * Send a message to a worker. Mid-turn and streaming → steering; mid-turn
     * otherwise → queued for the next turn; idle/parked → starts a new
     * background turn immediately.
     */
    send(session: ToolSession, args: {
        session: string;
        message: string;
    }): Promise<VibeSendOutcome>;
    /**
     * Block until one watched session's in-flight turn settles, the timeout
     * elapses, or `signal` aborts — `hub` wait semantics. Settled turns are
     * acknowledged against the job manager so their results are not delivered
     * a second time as async follow-ups.
     */
    wait(session: ToolSession, args: {
        sessions?: string[];
        timeoutMs?: number;
        signal?: AbortSignal;
    }): Promise<VibeWaitOutcome>;
    /** Detach one parent's process-local workers without tombstoning their persisted conversations. */
    suspendScope(scope: VibeOwnerScope, manager?: AsyncJobManager): Promise<number>;
    /** Terminate one worker; a tombstone failure still tears it down before reconciliation and error delivery. */
    kill(session: ToolSession, id: string): Promise<VibeKillOutcome>;
    /** Kill every live session in one parent scope after durably recording the complete mode-exit intent. */
    killAll(session: VibeParentSession, ownerScope?: VibeOwnerScope): Promise<number>;
}
/**
 * Aggregate tok/s across every live vibe worker session owned by `ownerId`.
 * Returns null when no workers are streaming (so callers can fall back to
 * their own rate unchanged). The director is often idle while workers stream,
 * so without this aggregation the status-line tok/s badge would show a stale
 * value while parallel work is actively generating tokens.
 *
 * Reads each worker's last assistant message via {@link calculateTokensPerSecond}
 * — the same leaf calculator the main status line uses — so worker rates are
 * computed identically to the main session's rate.
 */
export declare function aggregateVibeWorkerTokensPerSecond(ownerId: string): number | null;
