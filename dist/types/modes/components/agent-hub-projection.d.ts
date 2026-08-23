import type { AgentMetricsSummary, AgentRef, AgentStatus } from "../../registry/agent-registry.js";
import type { ObservableSession } from "../session-observer-registry.js";
export type AgentMetrics = AgentMetricsSummary;
export interface AggregateMetrics extends AgentMetrics {
    reportedAgents: number;
    /** Rows whose duration is an observer-measured active runtime. */
    activeDurationAgents: number;
}
interface AgentTreeProjection {
    rows: AgentRef[];
    depthById: Map<string, number>;
    parentById: Map<string, string>;
    lastSiblingById: Map<string, boolean>;
}
export declare const STATUS_ORDER: Record<AgentStatus, number>;
/** Exact observer usage for one roster entry. */
export declare function progressMetrics(observed: ObservableSession | undefined): AgentMetrics | undefined;
export declare function aggregateMetrics(args: {
    rows: readonly AgentRef[];
    observedById: ReadonlyMap<string, ObservableSession>;
    metricsFor: (ref: AgentRef, observed: ObservableSession | undefined) => AgentMetrics | undefined;
    fallbackStatsSession: (ref: AgentRef, observed: ObservableSession | undefined) => NonNullable<AgentRef["session"]> | undefined;
    sessionMetrics: WeakMap<object, {
        metrics: AgentMetrics | undefined;
    }>;
    refreshFallback: boolean;
}): {
    metrics: AggregateMetrics;
    hasFallbackLiveSessions: boolean;
};
/** Parent-before-child projection preserving the roster's stable sibling order. */
export declare function projectAgentTree(refs: readonly AgentRef[]): AgentTreeProjection;
export {};
