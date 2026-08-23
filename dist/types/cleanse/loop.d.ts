import type { CleanseAgentOutcome, CleanseAssignment, CleanseDiagnostic, CleanseDiagnosticReport, CleanseLoopResult } from "./types.js";
/** Runtime seams for one streaming diagnose-while-dispatching pass plus verification. */
export interface CleanseLoopDependencies {
    /**
     * Streaming diagnostic pass. Implementations invoke `onDiagnostics` as
     * checkers emit output and resolve with the final aggregate report once
     * every checker has exited.
     */
    collect(onDiagnostics: (diagnostics: readonly CleanseDiagnostic[]) => void, signal?: AbortSignal): Promise<CleanseDiagnosticReport>;
    /** Post-repair verification pass; never dispatches. */
    verify(signal?: AbortSignal): Promise<CleanseDiagnosticReport>;
    /** Run one repair subagent to completion. `peers` are the other in-flight assignments. */
    dispatch(assignment: CleanseAssignment, worker: number, peers: readonly CleanseAssignment[], signal?: AbortSignal): Promise<CleanseAgentOutcome>;
    /**
     * Deliver late diagnostics for files owned by a running worker into that
     * worker's chat. Resolve false (or reject) when undeliverable; the loop
     * requeues them for a fresh worker instead.
     */
    followUp?(worker: number, diagnostics: readonly CleanseDiagnostic[]): Promise<boolean>;
    /** Final streaming report, before verification. */
    onCollected?(report: CleanseDiagnosticReport): void;
    /** Verification finished with `report` remaining. */
    onVerified?(report: CleanseDiagnosticReport): void;
}
/** Inputs controlling one complete cleanse loop. */
export interface CleanseLoopOptions {
    maxAgents: number;
    signal?: AbortSignal;
}
/**
 * Stream diagnostics into a bounded worker pool, then verify the combined edits.
 *
 * Diagnostics are grouped per file and dispatched as they arrive: a new file
 * group goes to a fresh worker while fewer than `maxAgents` run; otherwise it
 * queues until a slot frees. Files stay sticky — two workers never edit the
 * same file concurrently. Late diagnostics for an owned file are steered into
 * the owning worker's chat via `followUp`; when that fails (worker not yet
 * registered or already finishing) they are requeued for a fresh worker once
 * the owner releases the file. Each diagnostic is dispatched at most once;
 * the final verification pass decides `clean`.
 */
export declare function runCleanseLoop(options: CleanseLoopOptions, dependencies: CleanseLoopDependencies): Promise<CleanseLoopResult>;
