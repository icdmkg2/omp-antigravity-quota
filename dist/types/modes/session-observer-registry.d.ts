import type { AgentProgress } from "../task/index.js";
import type { EventBus } from "../utils/event-bus.js";
export interface ObservableSession {
    id: string;
    kind: "main" | "subagent";
    label: string;
    agent?: string;
    description?: string;
    status: "active" | "completed" | "failed" | "aborted";
    sessionFile?: string;
    parentToolCallId?: string;
    /**
     * Spawn runs as a detached background job (parent turn not blocked on it).
     * The anchored subagent HUD only lists detached spawns: sync task spawns
     * and eval `agent()` spawns are already rendered live by their own inline
     * tool block / eval cell.
     */
    detached?: boolean;
    index?: number;
    lastUpdate: number;
    /** Latest progress snapshot from the subagent executor */
    progress?: AgentProgress;
}
/** Coarse source of an observer change; callers use it to separate lifecycle work from high-frequency progress. */
export type SessionObserverChangeKind = "main" | "reset" | "lifecycle" | "progress";
export declare class SessionObserverRegistry {
    #private;
    /** Add a change listener. Returns unsubscribe function. */
    onChange(cb: (kind: SessionObserverChangeKind) => void): () => void;
    setMainSession(sessionFile?: string): void;
    /** Return one tracked session without copying or sorting the registry. */
    getSession(id: string): ObservableSession | undefined;
    getSessions(): ObservableSession[];
    getActiveSubagentCount(): number;
    /** Clear all tracked sessions (e.g. on session switch). Keeps EventBus subscriptions and listeners. */
    resetSessions(): void;
    dispose(): void;
    subscribeToEventBus(eventBus: EventBus): void;
}
