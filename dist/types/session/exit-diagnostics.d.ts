import type { AssistantMessage } from "@oh-my-pi/pi-ai";
import type { SessionEntry } from "./session-entries.js";
export declare const TOOL_EXECUTION_START_CUSTOM_TYPE = "tool_execution_start";
export declare const SESSION_EXIT_CUSTOM_TYPE = "session_exit";
/**
 * Compact projection of tool-call arguments persisted with the start marker.
 * The assistant message already carries the full arguments; this exists only
 * so `appendArgumentSummary` can name the command/path in resume warnings
 * without duplicating whole argument payloads into the session JSONL.
 */
export interface ToolArgumentSummary {
    command?: string;
    path?: string;
}
/** Persisted marker written before a tool implementation starts running. */
export interface ToolExecutionStartData {
    toolCallId: string;
    toolName: string;
    args?: ToolArgumentSummary;
    intent?: string;
    startedAt: string;
}
/** Tool call left without a matching toolResult at the end of a branch. */
export interface PendingToolCallDiagnostic {
    toolCallId?: string;
    toolName: string;
    args?: unknown;
    intent?: string;
    assistantTimestamp?: number;
    startedAt?: string;
}
/** Session shutdown marker written during normal and fatal process teardown. */
export interface SessionExitData {
    reason: string;
    kind: "normal" | "signal" | "fatal" | "process_exit";
    recordedAt: string;
    pendingToolCalls?: PendingToolCallDiagnostic[];
}
export interface AssistantModelMetadata {
    api: AssistantMessage["api"];
    provider: string;
    model: string;
}
/**
 * createInterruptedTurnAbortMessage returns a terminal assistant record when
 * the latest persisted process exit follows a non-terminal conversation tail.
 */
export declare function createInterruptedTurnAbortMessage(entries: readonly SessionEntry[], fallbackModel?: AssistantModelMetadata): AssistantMessage | undefined;
/**
 * Project full tool-call arguments down to the fields the pending-tool-call
 * resume warning actually renders (`command`/`path`), truncated. Returns
 * `undefined` when the arguments carry neither, so callers can omit `args`
 * entirely instead of persisting an empty object.
 */
export declare function summarizeToolArguments(args: unknown): ToolArgumentSummary | undefined;
/** Finds tool calls left pending at the end of a session branch. */
export declare function collectPendingToolCalls(entries: readonly SessionEntry[]): PendingToolCallDiagnostic[];
/** Builds the resume warning shown when a prior branch ended mid-tool-call. */
export declare function describePendingToolCalls(entries: readonly SessionEntry[]): string | undefined;
