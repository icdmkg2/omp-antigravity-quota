import type { Agent, AgentMessage } from "@oh-my-pi/pi-agent-core";
import type { Model, ProviderResponseMetadata } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { ContextUsage } from "../extensibility/extensions/types.js";
import { type NonMessageTokenSource } from "../modes/utils/context-usage.js";
import type { ContextUsageBreakdown, SessionStats } from "./agent-session-types.js";
import type { SessionManager } from "./session-manager.js";
interface PendingContextSnapshot {
    promptTokens: number;
    nonMessageTokens: number;
    cutoffCount: number;
    /**
     * Compaction epoch at rebase time. Distinguishes a genuinely fresh in-turn
     * anchor (same epoch) from a post-cutoff anchor that predates a mid-run
     * compaction (older epoch) so the latter never out-ranks this snapshot.
     */
    epoch: number;
}
/** Capabilities the stats tracker borrows from its owning session. */
export interface SessionStatsTrackerHost {
    session: NonMessageTokenSource;
    agent: Agent;
    sessionManager: SessionManager;
    modelRegistry: ModelRegistry;
    model(): Model | undefined;
    sessionId(): string;
}
/** Computes session totals and tracks the in-flight context estimate. */
export declare class SessionStatsTracker {
    #private;
    constructor(host: SessionStatsTrackerHost);
    /** Returns aggregate message, token, and cost statistics for the session. */
    getSessionStats(): SessionStats;
    /** Returns the current provider-context token breakdown. */
    getContextBreakdown(options?: {
        contextWindow?: number;
        pendingMessages?: AgentMessage[];
    }): ContextUsageBreakdown | undefined;
    /** Returns current context tokens, capacity, and percentage. */
    getContextUsage(options?: {
        contextWindow?: number;
    }): ContextUsage | undefined;
    /** Monotonic revision for in-flight context snapshot changes. */
    get revision(): number;
    /**
     * Monotonic compaction epoch, bumped whenever history is compacted. Stamped
     * onto each assistant snapshot at record time so {@link getContextBreakdown}
     * can reject a post-cutoff anchor whose usage predates the last compaction.
     */
    get compactionEpoch(): number;
    /** Non-message token count captured for the active provider request. */
    get pendingNonMessageTokens(): number | undefined;
    /**
     * Apply an estimated prompt-prefix reduction to the current provider anchor.
     *
     * History after the anchor is estimated live by {@link getContextBreakdown};
     * callers must pass only savings from entries already included in the
     * anchor's provider-reported prompt. Persisting the correction on the
     * assistant snapshot keeps reloads accurate, and the next successful
     * assistant response naturally replaces it with a fresh provider anchor.
     */
    recordAnchoredHistoryRewrite(tokensRemoved: number): void;
    /** Sets or clears the in-flight context snapshot. */
    setPendingSnapshot(snapshot: Omit<PendingContextSnapshot, "epoch"> | undefined): void;
    /** Recomputes an in-flight snapshot after history is compacted or rewritten. */
    rebaseAfterCompaction(): void;
    /** Records provider usage headers against the active session account. */
    ingestProviderUsageHeaders(response: ProviderResponseMetadata, model?: Model): void;
}
export {};
