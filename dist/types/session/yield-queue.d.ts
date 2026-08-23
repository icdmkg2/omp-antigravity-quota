import { type AgentMessage } from "@oh-my-pi/pi-agent-core";
export interface YieldDispatcher<P> {
    /** Drop entries already delivered through another path. Called per-entry at flush time. */
    isStale?(entry: P): boolean;
    /** Produce one batched AgentMessage from non-stale entries. Return null to skip. */
    build(survivors: P[]): AgentMessage | null;
    /** If true, entries for this kind are drained only by {@link drainLazy} and never trigger the idle flush. */
    skipIdleFlush?: boolean;
}
export interface YieldQueueOptions {
    isStreaming: () => boolean;
    injectStreaming?(msg: AgentMessage): void;
    injectIdle(messages: AgentMessage[]): Promise<void>;
    scheduleIdleFlush(run: () => Promise<void>): void;
}
type YieldFlushMode = "streaming" | "idle";
export declare class YieldQueue {
    #private;
    constructor(options: YieldQueueOptions);
    register<P>(kind: string, dispatcher: YieldDispatcher<P>): () => void;
    enqueue<P>(kind: string, entry: P): void;
    enqueueWithReceipt<P>(kind: string, entry: P): Promise<void>;
    has(kind?: string): boolean;
    /** Arrange an idle flush for entries queued near the end of a streaming run. */
    requestIdleFlush(): void;
    flush(mode: YieldFlushMode): Promise<void>;
    /**
     * Snapshot and remove all queued entries, returning one lazy thunk per kind.
     * Each thunk applies the dispatcher's staleness filter and builds the batched
     * message only when called — so the consumer (the agent loop) decides, at the
     * moment it injects, whether the message is still worth delivering (a thunk may
     * return null to skip). Background-job completions and late diagnostics reach
     * the model between requests without the agent having to stop.
     */
    drainLazy(): Array<() => AgentMessage | null>;
    /** Drop queued entries. With `kind`, drop only that kind's entries (leaving
     *  any pending idle-flush for other kinds intact); otherwise drop everything. */
    clear(kind?: string): void;
    /** Clear a scheduled-flush latch when its host task is cancelled before running. */
    cancelIdleFlushScheduling(): void;
}
export {};
