/**
 * Render helpers shared between the live transcript ({@link UiHelpers}) and the
 * file/remote-backed {@link ChatTranscriptBuilder}. Both surfaces build the same
 * transcript rows from persisted message entries; holding the row construction
 * here keeps the two byte-for-byte identical.
 */
import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import { type Component } from "@oh-my-pi/pi-tui";
import { type FileMentionMessage } from "../../session/messages.js";
import { ToolActivityContainer } from "../components/tool-activity.js";
import { TranscriptBlock } from "../components/transcript-container.js";
type CustomOrHookMessage = Extract<AgentMessage, {
    role: "custom" | "hookMessage";
}>;
type AssistantAgentMessage = Extract<AgentMessage, {
    role: "assistant";
}>;
/**
 * Render an `async-result` custom message (a completed background bash/task job,
 * or a batch of them) as a transcript block of one "Background job completed"
 * row per job.
 */
export declare function buildAsyncResultBlock(message: CustomOrHookMessage): ToolActivityContainer;
/**
 * Render a `launch-completion` custom message (terminal supervised-process
 * exits from the launch broker) as a transcript block of one compact
 * "Supervised process ..." row per daemon, matching background-job rows.
 */
export declare function buildLaunchCompletionBlock(message: CustomOrHookMessage): ToolActivityContainer;
/**
 * Render a live IRC traffic custom message (`irc:incoming` / `irc:autoreply` /
 * `irc:relay`) as a transcript card. `getExpanded` supplies the live
 * expanded-state getter for the cached card.
 */
export declare function buildIrcMessageCard(message: CustomOrHookMessage, getExpanded: () => boolean): Component;
/**
 * Render a `fileMention` message's files as a transcript block of "Read <path>"
 * rows. `indent` sets the left pad: the live chat renders within an outer gutter
 * (0), the transcript viewer renders body rows without one so rows own their pad
 * (1).
 */
export declare function buildFileMentionBlock(files: FileMentionMessage["files"], indent: number): TranscriptBlock;
/**
 * Whether an assistant turn has visible text, thinking, or image content — i.e.
 * content that closes the current read-tool run.
 */
export declare function assistantHasVisibleContent(message: AssistantAgentMessage): boolean;
/**
 * Split mixed assistant turns into visible text before tool execution and
 * visible text segments that must render immediately after the preceding tool.
 * Cursor can return intro text, tool calls, progress text, and the final answer
 * in one assistant message; keeping every text block in the leading assistant
 * block buries post-tool text above tool results in the transcript.
 */
export declare function splitAssistantMessageToolTimeline(message: AssistantAgentMessage): {
    beforeTools: AssistantAgentMessage;
    afterToolCalls: ReadonlyMap<string, AssistantAgentMessage>;
    hasToolCalls: boolean;
};
/**
 * Normalize raw tool-call arguments to a plain record, collapsing non-object or
 * array values to an empty object.
 */
export declare function normalizeToolArgs(args: unknown): Record<string, unknown>;
export type AssistantErrorPresentation = {
    kind: "none";
} | {
    kind: "full";
    text: string;
    isError: true;
} | {
    kind: "compact-recovered";
    text: string;
    isError: false;
};
/**
 * Resolve the turn-ending assistant error presentation, if any.
 * Silent and user-interrupt aborts yield no label. Recovered retry attempts
 * render a compact note; attempts superseded by an exhausted budget are hidden
 * while the final terminal error keeps its full presentation.
 */
export declare function resolveAssistantErrorPresentation(message: AssistantAgentMessage, retryAttempt?: number): AssistantErrorPresentation;
/**
 * Whether an assistant turn's `usage` reflects work the operator was billed
 * for. Empty automated turns from providers that emit `usage: 0` collapse to
 * `false`, but any input, output, cache, or premium request keeps the row so
 * cost transparency survives — the live path and the resume/rebuild path
 * agree turn-by-turn.
 */
export declare function assistantUsageIsBilled(usage: AssistantAgentMessage["usage"]): boolean;
export {};
