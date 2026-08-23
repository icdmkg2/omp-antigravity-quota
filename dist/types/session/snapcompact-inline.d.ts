/**
 * Snapcompact inline imaging: per-request transform that swaps the system
 * prompt, loaded context-file instructions, and/or large historical tool
 * results for dense PNG frames on vision-capable models.
 * Runs inside the agent loop's `transformProviderContext` hook — after the
 * persisted history is converted to the outgoing `Context`, before the
 * provider stream call. It only ever builds NEW message objects/arrays; the
 * input context shares `content` array references with the persisted
 * `SessionMessageEntry` messages, so mutation would leak rendered images
 * into session.jsonl.
 *
 * The swap policy (budget, savings gate, skip rules) lives in
 * `planInlineSwaps`, shared by the transform and the `/context` savings
 * estimate (`estimateInlineSavings`) so the two can never disagree.
 */
import type { Context, Model } from "@oh-my-pi/pi-ai";
import * as snapcompact from "@oh-my-pi/snapcompact";
import type { SnapcompactFrameSink } from "../blob-broker/service.js";
export type SnapcompactSystemPromptMode = "none" | "agents-md" | "all";
export interface SnapcompactInlineOptions {
    renderSystemPrompt: SnapcompactSystemPromptMode;
    renderToolResults: boolean;
    /** Frame variant override; `"auto"`/omitted picks the provider's eval winner. */
    shape?: snapcompact.ShapeVariantName | "auto";
}
/**
 * Reports the per-tool-result tokens kept off the wire when a swap is applied.
 * `savedTokens` is `textTokens - frames * shape.frameTokenEstimate` for each
 * imaged tool result (always > 0; the savings gate guarantees it). Wired to the
 * append-only savings journal; never throws into the request path.
 */
export type SnapcompactSavingsSink = (savings: ReadonlyArray<{
    toolCallId: string;
    savedTokens: number;
}>, model: Model) => void;
/** Tool-result swap candidate, in context order. */
export interface InlineToolResultCandidate {
    /** Stable identifier for rendering cache key and applying the swap. */
    id: string;
    /** Token count of the joined text blocks (0 for empty or image-carrying). */
    textTokens: number;
    /** Frames needed to render the text (0 = empty, below floor, image-carrying, or error). */
    frames: number;
    /** Already carries an image (screenshot etc.) — never re-imaged. */
    hasImage: boolean;
    /** Error tool results must stay text-only for provider API validation. */
    isError?: boolean;
}
export interface InlineSystemPromptCandidate {
    textTokens: number;
    frames: number;
}
export interface InlinePlanInput {
    options: SnapcompactInlineOptions;
    shape: snapcompact.Shape;
    /** Provider image-count budget minus images already present in the context. */
    budget: number;
    /** All tool results in context order, INCLUDING the most recent one. */
    toolResults: readonly InlineToolResultCandidate[];
    /** Selected prompt text; undefined when system-prompt imaging is off or empty. */
    systemPrompt: InlineSystemPromptCandidate | undefined;
    /** Whether a user message exists to carry the prompt frames. */
    hasUserMessage: boolean;
}
export interface InlineSwapPlan {
    /** Tool results to swap, oldest first. */
    toolResults: Array<{
        id: string;
        textTokens: number;
        frames: number;
    }>;
    /** Set when the system prompt should swap to frames (uses leftover budget). */
    systemPrompt: InlineSystemPromptCandidate | undefined;
}
/**
 * Decide which content gets swapped for frames. Pure — the same rules drive
 * the provider-request transform and the /context savings estimate.
 */
export declare function planInlineSwaps(input: InlinePlanInput): InlineSwapPlan;
/**
 * Minimal structural view of a history message — both pi-ai `Message`s (the
 * outgoing context) and agent-core `AgentMessage`s (the live session) satisfy
 * it, so the estimator can read session state without conversion.
 */
export interface InlineMessageView {
    role: string;
    toolCallId?: string;
    content?: unknown;
    isError?: boolean;
}
export interface SnapcompactSavingsEstimate {
    /** Frames only ship on models that accept image input. */
    visionCapable: boolean;
    /** Present iff system-prompt imaging is enabled. */
    systemPrompt?: {
        applied: boolean;
        /** Why the prompt stays text when `applied` is false. */
        reason?: "empty" | "margin" | "budget";
        textTokens: number;
        frames: number;
        /** Estimated billed tokens for the frames (0 when there are none). */
        imageTokens: number;
        savedTokens: number;
        scope: Exclude<SnapcompactSystemPromptMode, "none">;
    };
    /** Present iff tool-result imaging is enabled. */
    toolResults?: {
        /** Tool results currently in history. */
        total: number;
        swapped: number;
        /** Text tokens of the swapped results only. */
        textTokens: number;
        frames: number;
        imageTokens: number;
        savedTokens: number;
    };
    /** Net estimated wire savings for the next request. */
    savedTokens: number;
}
/**
 * Estimate what `SnapcompactInlineTransformer.transform` would save on the
 * NEXT request, given the session's live system prompt and message history.
 *
 * Mirrors the transform exactly via `planInlineSwaps`, with one deliberate
 * difference: `hasUserMessage` is assumed true, because the request being
 * estimated is always triggered by a user prompt — even when the current
 * history is still empty.
 */
export declare function estimateInlineSavings(input: {
    options: SnapcompactInlineOptions;
    model: Model | undefined;
    systemPrompt: readonly string[];
    messages: readonly InlineMessageView[];
}): SnapcompactSavingsEstimate;
/**
 * Stateless with respect to the model (passed per call, so mid-session model
 * switches re-resolve shape and budget); stateful only for the render caches,
 * which live as long as the session's Agent.
 */
export declare class SnapcompactInlineTransformer {
    #private;
    private readonly options;
    private readonly onToolResultSavings?;
    private readonly frameSink?;
    constructor(options: SnapcompactInlineOptions, onToolResultSavings?: SnapcompactSavingsSink | undefined, frameSink?: SnapcompactFrameSink | undefined);
    transform(context: Context, model: Model): Promise<Context>;
}
