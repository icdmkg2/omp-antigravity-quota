/**
 * Structured metadata for tool outputs.
 *
 * Tools populate details.meta using the fluent OutputMetaBuilder.
 * The tool wrapper automatically formats and appends notices at message boundary.
 */
import type { AgentTool } from "@oh-my-pi/pi-agent-core";
import { type Settings } from "../config/settings.js";
import type { Theme } from "../modes/theme/theme.js";
import { type OutputSummary, type TruncationResult } from "../session/streaming-output.js";
/**
 * Truncation metadata for the output notice.
 */
export interface TruncationMeta {
    direction: "head" | "tail" | "middle";
    truncatedBy: "lines" | "bytes" | "middle";
    totalLines: number;
    totalBytes: number;
    outputLines: number;
    outputBytes: number;
    maxBytes?: number;
    /** Line range shown (1-indexed, inclusive). Omitted for middle elision. */
    shownRange?: {
        start: number;
        end: number;
    };
    /** Head/tail line ranges shown when direction === "middle". */
    headRange?: {
        start: number;
        end: number;
    };
    tailRange?: {
        start: number;
        end: number;
    };
    /** Bytes elided from the middle. */
    elidedBytes?: number;
    /** Lines elided from the middle. */
    elidedLines?: number;
    /** Artifact ID if full output was saved */
    artifactId?: string;
    /** Next offset for pagination (head truncation only) */
    nextOffset?: number;
}
/**
 * Source resolution info for the output.
 */
export type SourceMeta = {
    type: "path";
    value: string;
} | {
    type: "url";
    value: string;
} | {
    type: "internal";
    value: string;
};
/**
 * LSP diagnostic info (for edit/write tools).
 */
export interface DiagnosticMeta {
    summary: string;
    messages: string[];
}
/**
 * Limit-specific notices.
 */
export interface LimitsMeta {
    matchLimit?: {
        reached: number;
        suggestion: number;
    };
    resultLimit?: {
        reached: number;
        suggestion: number;
    };
    headLimit?: {
        reached: number;
        suggestion: number;
    };
    columnTruncated?: {
        maxColumn: number;
    };
}
/**
 * Structured metadata for tool outputs.
 */
export interface OutputMeta {
    truncation?: TruncationMeta;
    source?: SourceMeta;
    diagnostics?: DiagnosticMeta;
    limits?: LimitsMeta;
}
export interface TruncationOptions {
    direction: "head" | "tail" | "middle";
    startLine?: number;
    totalFileLines?: number;
    artifactId?: string;
}
export interface TruncationSummaryOptions {
    direction: "head" | "tail" | "middle";
    startLine?: number;
    totalFileLines?: number;
}
export interface TruncationTextOptions {
    direction: "head" | "tail" | "middle";
    totalLines?: number;
    totalBytes?: number;
    maxBytes?: number;
}
/**
 * Fluent builder for OutputMeta.
 *
 * @example
 * ```ts
 * details.meta = outputMeta()
 *   .truncation(truncation, { direction: "head" })
 *   .matchLimit(limitReached ? effectiveLimit : 0)
 *   .columnTruncated(linesTruncated ? DEFAULT_MAX_COLUMN : 0)
 *   .get();
 * ```
 */
export declare class OutputMetaBuilder {
    #private;
    /** Add truncation info from TruncationResult. No-op if not truncated. */
    truncation(result: TruncationResult, options: TruncationOptions): this;
    /** Add truncation info from OutputSummary. No-op if not truncated. */
    truncationFromSummary(summary: OutputSummary, options: TruncationSummaryOptions): this;
    /** Add truncation info from truncated output text. No-op if truncation not detected. */
    truncationFromText(text: string, options: TruncationTextOptions): this;
    /** Add match limit notice. No-op if reached <= 0. */
    matchLimit(reached: number, suggestion?: number): this;
    /** Add limit notices in one call. */
    limits(limits: {
        matchLimit?: number;
        resultLimit?: number;
        headLimit?: number;
        columnMax?: number;
    }): this;
    /** Add result limit notice. No-op if reached <= 0. */
    resultLimit(reached: number, suggestion?: number): this;
    /** Add limit notice for head truncation. No-op if reached <= 0. */
    headLimit(reached: number, suggestion?: number): this;
    /** Add column truncation notice. No-op if maxColumn <= 0. */
    columnTruncated(maxColumn: number): this;
    /** Add source path info. */
    sourcePath(value: string): this;
    /** Add source URL info. */
    sourceUrl(value: string): this;
    /** Add internal URL source info (skill://, agent://, artifact://). */
    sourceInternal(value: string): this;
    /** Add LSP diagnostics. No-op if no messages. */
    diagnostics(summary: string, messages: string[]): this;
    /** Get the built OutputMeta, or undefined if empty. */
    get(): OutputMeta | undefined;
}
/** Create a new OutputMetaBuilder. */
export declare function outputMeta(): OutputMetaBuilder;
export declare function formatFullOutputReference(artifactId: string): string;
/** Remove the trailing bash raw-output artifact footer while preserving its artifact id. */
export declare function stripRawOutputArtifactNotice(text: string): {
    text: string;
    artifactId?: string;
};
/** Remove a trailing generated output notice when metadata is unavailable. */
export declare function stripGeneratedOutputNotice(text: string): string;
export declare function formatTruncationMetaNotice(truncation: TruncationMeta): string;
/**
 * Format styled artifact reference with warning color and brackets.
 * For TUI rendering of truncation warnings.
 */
export declare function formatStyledArtifactReference(artifactId: string, theme: Theme): string;
/**
 * Format notices from OutputMeta for LLM consumption.
 * Returns empty string if no notices needed.
 */
export declare function formatOutputNotice(meta: OutputMeta | undefined): string;
/**
 * Format a styled truncation warning message.
 * Returns null if no truncation metadata present.
 */
export declare function formatStyledTruncationWarning(meta: OutputMeta | undefined, theme: Theme): string | null;
/**
 * Strip the trailing notice that {@link appendOutputNotice} bakes into the
 * LLM-facing content body. Renderers should call this before printing
 * `result.content` text in the TUI, because they emit a styled warning line of
 * their own; without this, users see the same `[Showing lines …]` string twice
 * (once verbatim from the body, once as the styled `⟨…⟩` warning).
 *
 * Safe to call eagerly: returns the input unchanged when no notice is present
 * (e.g. during streaming, before {@link wrappedExecute} runs).
 */
export declare function stripOutputNotice(text: string, meta: OutputMeta | undefined): string;
/**
 * Resolve the OutputSink `headBytes` budget from session settings.
 * Exposed so streaming executors (bash/python/ssh/eval) can opt into
 * middle elision with the same per-user configuration.
 */
export declare function resolveOutputSinkHeadBytes(s: Settings | undefined): number;
/**
 * Resolve the `enforceInlineByteCap` budget for streaming tools (bash/ssh)
 * from session settings: the user's spill threshold plus notice slack.
 */
export declare function resolveInlineByteCapBudget(s: Settings | undefined): number;
/**
 * Resolve the per-line column cap from session settings. Shared by streaming
 * executors (bash/python/ssh/eval via OutputSink) and the `read` tool's
 * line-buffer post-processing, so one setting controls both surfaces.
 */
export declare function resolveOutputMaxColumns(s: Settings | undefined): number;
/**
 * Wrap a tool to:
 * 1. Automatically append output notices based on details.meta
 * 2. Handle ToolError rendering
 */
export declare function wrapToolWithMetaNotice<T extends AgentTool<any, any, any>>(tool: T): T;
