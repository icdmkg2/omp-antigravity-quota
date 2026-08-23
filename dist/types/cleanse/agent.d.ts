import type { AgentProgress } from "../task/types.js";
import type { CleanseCheckerDescriptor, CustomCleanseCheckerSpec } from "./checkers.js";
import type { CleanseAgentOutcome, CleanseAssignment, CleanseDiagnostic, CleanseLoopResult } from "./types.js";
/** Hooks used by the standalone command to render subagent lifecycle progress. */
export interface CleanseAgentHooks {
    onStart?(name: string, assignment: CleanseAssignment): void;
    /** Streaming progress snapshots from a running repair subagent. */
    onProgress?(name: string, assignment: CleanseAssignment, progress: AgentProgress): void;
    onFinish?(outcome: CleanseAgentOutcome, assignment: CleanseAssignment): void;
}
/** Persisted parent session that dispatches file-disjoint cleanse workers. */
export interface CleanseAgentRuntime {
    readonly model: string;
    readonly sessionFile: string;
    /** Run one discovery subagent that translates a user request into runnable checker specs. */
    discoverCheckers(request: string, signal?: AbortSignal): Promise<CustomCleanseCheckerSpec[]>;
    /** Run one repair subagent to completion; the scheduler bounds concurrency. */
    dispatchWorker(assignment: CleanseAssignment, context: {
        worker: number;
        peers: readonly CleanseAssignment[];
        checkers: readonly CleanseCheckerDescriptor[];
    }, signal?: AbortSignal): Promise<CleanseAgentOutcome>;
    /** Steer late diagnostics into a running worker's chat; false when undeliverable. */
    followUp(worker: number, diagnostics: readonly CleanseDiagnostic[]): Promise<boolean>;
    close(result?: CleanseLoopResult): Promise<void>;
}
/** Resolve the requested model and create a fresh persisted cleanse session. */
export declare function createCleanseAgentRuntime(options: {
    cwd?: string;
    model: string;
    hooks?: CleanseAgentHooks;
}): Promise<CleanseAgentRuntime>;
