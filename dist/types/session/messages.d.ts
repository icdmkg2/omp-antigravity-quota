/**
 * Custom message types and transformers for the coding agent.
 *
 * Extends the base AgentMessage type with coding-agent specific message types,
 * and provides a transformer to convert them to LLM-compatible messages.
 */
import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import { type BranchSummaryMessage, type CompactionSummaryMessage } from "@oh-my-pi/pi-agent-core/compaction/messages";
import type { AssistantMessage, ImageContent, Message, MessageAttribution, TextContent } from "@oh-my-pi/pi-ai";
export { type BranchSummaryMessage, type CompactionSummaryMessage, createBranchSummaryMessage, createCompactionSummaryMessage, createCustomMessage, } from "@oh-my-pi/pi-agent-core/compaction/messages";
import type { OutputMeta } from "../tools/output-meta.js";
export declare const SKILL_PROMPT_MESSAGE_TYPE = "skill-prompt";
export declare const LSP_LATE_DIAGNOSTIC_MESSAGE_TYPE = "lsp-late-diagnostic";
export declare const BACKGROUND_TAN_DISPATCH_MESSAGE_TYPE = "background-tan-dispatch";
export declare const PREWALK_PLAN_MESSAGE_TYPE = "prewalk-plan";
/**
 * Logs provider-error turns so their actual cause is available outside the
 * session transcript. No-op for non-error stop reasons.
 */
export declare function logProviderTurnError(msg: AssistantMessage): void;
/**
 * Removes replay-bound provider state before reparenting an assistant message
 * under a different user turn.
 */
export declare function sanitizeAssistantForReparentedHistory(message: AssistantMessage): AssistantMessage;
/**
 * Collapses degenerate repeated lines and bounds an ephemeral side-channel
 * reply to 4 KiB.
 */
export declare function dedupeEphemeralReply(text: string): string;
/** Builds the recent user/assistant context supplied to title regeneration. */
export declare function buildReplanTitleContext(messages: AgentMessage[]): string;
/**
 * Compares session messages by provider-replay semantics, ignoring runtime-only
 * fields that do not change a restored request.
 */
export declare function didSessionMessagesChange(previousMessages: AgentMessage[], nextMessages: AgentMessage[]): boolean;
/** Fallback type for extension-injected messages that omit a custom type. */
export declare const DEFAULT_CUSTOM_MESSAGE_TYPE = "custom-message";
/** Custom message carrying a coding request delegated by the live voice model. */
export declare const LIVE_DELEGATION_MESSAGE_TYPE = "live-delegation";
/** Content shape accepted for extension-injected messages. */
export type CustomMessageContent = string | (TextContent | ImageContent)[];
/** Public input accepted by `pi.sendMessage` and `AgentSession.sendCustomMessage`. */
export type CustomMessagePayload<T = unknown> = string | Partial<Pick<CustomMessage<T>, "customType" | "content" | "display" | "details" | "attribution">>;
/** Custom message payload after applying runtime defaults. */
export type NormalizedCustomMessagePayload<T = unknown> = Pick<CustomMessage<T>, "customType" | "content" | "display" | "details" | "attribution">;
/** Custom message type for hidden interrupted-thinking continuity context. */
export declare const INTERRUPTED_THINKING_MESSAGE_TYPE = "interrupted-thinking";
/** Custom message type for the transient checkpoint-active reminder. */
export declare const CHECKPOINT_ACTIVE_REMINDER_TYPE = "checkpoint-active-reminder";
/** Metadata persisted with a hidden interrupted-thinking continuity message. */
export interface InterruptedThinkingDetails {
    interruptedAt: number;
    provider: AssistantMessage["provider"];
    model: string;
    blockCount: number;
}
/** Pure helper result for persisting interrupted thinking outside the assistant turn. */
export interface DemotedInterruptedThinking {
    reasoning: string;
    strippedContent: AssistantMessage["content"];
    blockCount: number;
}
/**
 * Demote a trailing run of *incomplete* interrupted-thinking from an assistant
 * message — reasoning that was still streaming when the user aborted.
 *
 * A block joins the run only when it is a non-empty `thinking` block with no
 * `thinkingSignature`. A signed/complete thinking block (Anthropic signature,
 * OpenAI reasoning item id) is safely replayable, so it ends the run and stays
 * in place — as do `redactedThinking` encrypted blobs, text, tool calls,
 * empty-thinking blocks, and trailing empty text placeholders.
 */
export declare function demoteInterruptedThinking(message: Pick<AssistantMessage, "content">): DemotedInterruptedThinking | undefined;
/** Details persisted on a `/tan` background-dispatch breadcrumb. */
export interface BackgroundTanDispatchDetails {
    jobId: string;
    work: string;
    /** Forked clone session file, named `<agentId>.jsonl`; the Agent Hub reads its transcript. */
    sessionFile: string;
}
export interface SkillPromptDetails {
    name: string;
    path: string;
    args?: string;
    lineCount: number;
    /** Internal: compact label shown for a queued custom message. Optional —
     *  non-streaming skill prompts never set it. Stripped from persisted
     *  `details` by `SessionManager.appendCustomMessageEntry` via the
     *  `INTERNAL_DETAILS_FIELDS` allowlist below. */
    __queueChipText?: string;
}
/** Sentinel value for `AssistantMessage.errorMessage` indicating that the abort
 *  was an *expected internal transition* (plan-mode → execution compaction)
 *  and must NOT surface as a red "Operation aborted" line. Distinct from
 *  `undefined` (default) so user-cancel aborts with no errorMessage still
 *  render normally. Persists through SessionManager so history replay
 *  branches identically.
 *
 *  Consumers: `AgentSession.#handleAgentEvent` (stamper) writes this value;
 *  `EventController.#handleMessageEnd`, `AssistantMessageComponent`,
 *  `ui-helpers.addMessageToChat` (renderers), `AgentHubOverlayComponent
 *  #buildTranscriptLines`, `runPrintMode`, and `AcpAgent#replayAssistantMessage`
 *  (fallback error emission) read it via `isSilentAbort`. */
export declare const SILENT_ABORT_MARKER = "__omp.silent_abort__";
/** Type-guard for silent aborts. Renderers MUST call this helper so structured
 *  `errorId` and legacy persisted marker messages stay in lockstep. */
export declare function isSilentAbort(message: Pick<AssistantMessage, "errorId" | "errorMessage">): boolean;
/** Reason threaded through `AbortController.abort(reason)` when the user aborts
 *  the turn with Esc (see `AgentSession.abort`). The agent keeps it on the
 *  aborted assistant message's `errorMessage` so queued follow-ups/tool-result
 *  placeholders can distinguish a deliberate interrupt from a bare lifecycle
 *  abort, but interactive renderers suppress this redundant transcript line. */
export declare const USER_INTERRUPT_LABEL = "Interrupted by user";
export declare function isUserInterruptAbort(message: Pick<AssistantMessage, "errorId" | "errorMessage">): boolean;
export declare function shouldRenderAbortReason(message: Pick<AssistantMessage, "errorId" | "errorMessage">): boolean;
/** A provider-rejection turn carrying nothing but the error flag: stopReason
 *  "error" with no text, thinking, or tool calls — e.g. a request the provider
 *  rejected before any output (an oversized 413 payload). Persisting it writes an
 *  empty assistant turn that replays on reload and re-sends the rejected context;
 *  the error is surfaced live (pinned) instead. A turn that streamed partial text,
 *  reasoning, or tool calls is NOT empty and stays in history. */
export declare function isEmptyErrorTurn(message: Pick<AssistantMessage, "stopReason" | "content">): boolean;
/** A `stop`/`toolUse` turn that produced nothing actionable. Any other stop
 *  reason is not an "empty stop": an `error`/`aborted` turn is a failure rather
 *  than an empty completion, and a `length` stop was cut off mid-output. */
export declare function isEmptyAssistantStop(message: Pick<AssistantMessage, "stopReason" | "content">): boolean;
/**
 * True when this assistant turn actually produced output, making its model the
 * one that served the run.
 *
 * Attribution asks this from two places that MUST reach the same verdict: the
 * live session, which flips a fallback to "served", and the offline walk
 * replaying a transcript. `error` and `aborted` are both failures — a stalled or
 * dropped stream is finalized as `aborted` with its partial block still
 * attached, so a stop reason alone is not proof.
 *
 * Actionable content is required on top of the empty-stop rule, which only
 * inspects `stop`/`toolUse`. A `length` stop burns the whole output budget
 * without necessarily emitting anything usable, and every other stop reason
 * bypasses that rule entirely.
 */
export declare function assistantTurnProducedOutput(message: Pick<AssistantMessage, "stopReason" | "content">): boolean;
/** Sentinel `errorMessage` the agent stamps on any abort that carried no custom
 *  reason (bare `abort()`). Renderers treat it as "no specific reason given". */
export declare const GENERIC_ABORT_SENTINEL = "Request was aborted";
/** Resolve the operator-facing label for an aborted assistant turn. A custom
 *  abort reason threaded onto `errorMessage` is returned verbatim; aborts with
 *  no threaded reason fall back to the retry-aware generic label. Call
 *  `shouldRenderAbortReason` before rendering when user interrupts should stay
 *  visually quiet. */
export declare function resolveAbortLabel(message: Pick<AssistantMessage, "errorId" | "errorMessage">, retryAttempt?: number): string;
/** Extract the optional `__queueChipText` field from a CustomMessage's
 *  `details` blob. Safe over `unknown`; returns undefined when the field is
 *  absent or non-string. */
export declare function readQueueChipText(details: unknown): string | undefined;
/** Explicit allowlist of `details` field names that are AgentSession-internal
 *  transient bookkeeping and MUST be removed before SessionManager persists
 *  the CustomMessageEntry to disk. Scoped intentionally narrow: only fields
 *  declared here are stripped. Adding a new entry is a deliberate, reviewed
 *  change — unrelated future payload fields are never silently dropped. */
export declare const INTERNAL_DETAILS_FIELDS: readonly ["__queueChipText"];
/** Return a `details` copy with every key in `INTERNAL_DETAILS_FIELDS`
 *  removed. Returns the input unchanged when there is nothing to strip
 *  (null/non-object, or no listed fields present) so callers don't pay a
 *  clone cost on the common path. */
export declare function stripInternalDetailsFields<T>(details: T | undefined): T | undefined;
/** True when a persisted or extension-supplied value can be sent as custom-message content. */
export declare function isCustomMessageContent(content: unknown): content is CustomMessageContent;
/** Normalizes extension-provided custom message input before it reaches session state or disk. */
export declare function normalizeCustomMessagePayload<T = unknown>(payload: CustomMessagePayload<T> | unknown): NormalizedCustomMessagePayload<T>;
export declare function wrapSteeringForModel(messages: AgentMessage[]): AgentMessage[];
/**
 * Strip image content blocks from `message` in place. Returns the count of
 * images removed across `content` (every role that carries `ImageContent`) and
 * any tool-result `details.images` payload. Callers MUST rewrite session
 * entries (`SessionManager.rewriteEntries`) and replay them through
 * `Agent.replaceMessages` afterwards so persisted state and provider-side
 * caches stay aligned with the mutated tree — `stripImagesFromMessage` is a
 * pure local mutation and intentionally does neither.
 */
export declare function stripImagesFromMessage(message: AgentMessage): number;
/**
 * Replace every `ImageContent` block in already-converted LLM {@link Message}s
 * with a text placeholder, returning a new array only when something changed.
 *
 * Unlike {@link stripImagesFromMessage} (which mutates persisted `AgentMessage`s
 * in place), this operates on the ephemeral provider-request view produced by
 * {@link convertToLlm}, so history on disk keeps its images while the outbound
 * request is scrubbed. Used to keep image blocks off the wire when the active
 * model has no vision support (or `images.blockImages` is set) — e.g. after
 * switching from a vision model to a text-only one mid-session (#5400).
 *
 * Consecutive placeholder texts collapse into one so a message that was nothing
 * but images does not balloon into a run of identical notes.
 */
export declare function replaceLlmImagesWithText(messages: Message[], placeholder: string): Message[];
/**
 * Message type for bash executions via the ! command.
 */
export interface BashExecutionMessage {
    role: "bashExecution";
    command: string;
    output: string;
    exitCode: number | undefined;
    cancelled: boolean;
    truncated: boolean;
    meta?: OutputMeta;
    timestamp: number;
    /** If true, this message is excluded from LLM context (!! prefix) */
    excludeFromContext?: boolean;
}
/**
 * Message type for user-initiated Python executions via the $ command.
 * Shares the same kernel session as eval's Python backend.
 */
export interface PythonExecutionMessage {
    role: "pythonExecution";
    code: string;
    output: string;
    exitCode: number | undefined;
    cancelled: boolean;
    truncated: boolean;
    meta?: OutputMeta;
    timestamp: number;
    /** If true, this message is excluded from LLM context ($$ prefix) */
    excludeFromContext?: boolean;
}
/**
 * Message type for extension-injected messages via sendMessage().
 */
export interface CustomMessage<T = unknown> {
    role: "custom";
    customType: string;
    content: CustomMessageContent;
    display: boolean;
    details?: T;
    /** Who initiated this message for billing/attribution semantics. */
    attribution?: MessageAttribution;
    timestamp: number;
}
/**
 * Legacy hook message type (pre-extensions). Kept for session migration.
 */
export interface HookMessage<T = unknown> {
    role: "hookMessage";
    customType: string;
    content: CustomMessageContent;
    display: boolean;
    details?: T;
    /** Who initiated this message for billing/attribution semantics. */
    attribution?: MessageAttribution;
    timestamp: number;
}
/**
 * Message type for auto-read file mentions via @filepath syntax.
 */
export interface FileMentionMessage {
    role: "fileMention";
    files: Array<{
        path: string;
        content: string;
        lineCount?: number;
        /** File size in bytes, if known. */
        byteSize?: number;
        /** Why the file contents were omitted from auto-read. */
        skippedReason?: "tooLarge" | "binary";
        image?: ImageContent;
    }>;
    timestamp: number;
}
declare module "@oh-my-pi/pi-agent-core" {
    interface CustomAgentMessages {
        bashExecution: BashExecutionMessage;
        pythonExecution: PythonExecutionMessage;
        custom: CustomMessage;
        hookMessage: HookMessage;
        branchSummary: BranchSummaryMessage;
        compactionSummary: CompactionSummaryMessage;
        fileMention: FileMentionMessage;
    }
}
/**
 * Convert a BashExecutionMessage to user message text for LLM context.
 */
export declare function bashExecutionToText(msg: BashExecutionMessage): string;
/**
 * Convert a PythonExecutionMessage to user message text for LLM context.
 */
export declare function pythonExecutionToText(msg: PythonExecutionMessage): string;
export declare function sanitizeRehydratedOpenAIResponsesAssistantMessage(message: AssistantMessage): AssistantMessage;
/** True for a `/skill:<name>` prompt the user invoked directly (attribution `user`), as opposed to an agent/autoload injection. */
export declare function isUserInvokedSkillPrompt(message: CustomMessage): boolean;
/**
 * Transform AgentMessages (including custom types) to LLM-compatible Messages.
 *
 * This is used by:
 * - Agent's transormToLlm option (for prompt calls and queued messages)
 * - Compaction's generateSummary (for summarization)
 * - Custom extensions and tools
 *
 * Settled history converts once and is reused per message identity: an
 * append-only turn on the same array re-pays only the new suffix, and an
 * unchanged re-convert of the same array hands back the same outer `Message[]`.
 * Owner mutations (prune/shake/strip-images) invalidate the affected message
 * through the shared registry before the next pass.
 */
export declare function convertToLlm(messages: AgentMessage[]): Message[];
