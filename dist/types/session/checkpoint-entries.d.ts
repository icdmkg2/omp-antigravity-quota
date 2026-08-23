import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import type { ImageContent, TextContent } from "@oh-my-pi/pi-ai";
import type { CompletedRewindState } from "../tools/checkpoint.js";
import type { SessionEntry } from "./session-entries.js";
/** Extracts text from custom message content. */
export declare function customMessageContentText(content: string | (TextContent | ImageContent)[]): string;
/** Extracts the report body from persisted rewind-report content. */
export declare function reportFromRewindReportContent(content: string): string;
/** Checkpoint-domain tool names normalized from native and xdev calls. */
export type SemanticCheckpointToolName = "checkpoint" | "rewind";
/** Normalized checkpoint-domain tool result. */
export interface SemanticToolResult {
    toolName: SemanticCheckpointToolName;
    details?: unknown;
}
/** Normalizes checkpoint and rewind results across native calls and xdev dispatches. */
export declare function semanticToolResult(toolName: string | undefined, result: unknown): SemanticToolResult | undefined;
/** Restores completed rewind state from a persisted session entry. */
export declare function completedRewindFromEntry(entry: SessionEntry): CompletedRewindState | undefined;
/** Whether an entry is a successful checkpoint tool result. */
export declare function isSuccessfulCheckpointEntry(entry: SessionEntry): entry is SessionEntry & {
    type: "message";
    message: Extract<AgentMessage, {
        role: "toolResult";
    }>;
};
/** Returns the checkpoint start timestamp represented by an entry. */
export declare function checkpointStartedAtFromEntry(entry: SessionEntry): string | undefined;
