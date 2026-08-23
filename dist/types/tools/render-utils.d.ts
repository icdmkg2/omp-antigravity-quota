/**
 * Shared utilities and constants for tool renderers.
 *
 * Provides consistent formatting, truncation, and display patterns across all
 * tool renderers to ensure a unified TUI experience.
 */
import type { ToolCallContext } from "@oh-my-pi/pi-agent-core";
import type { Ellipsis } from "@oh-my-pi/pi-natives";
import type { Component } from "@oh-my-pi/pi-tui";
import type { Theme } from "../modes/theme/theme.js";
import { type ResizedImage } from "../utils/image-resize.js";
export { Ellipsis } from "@oh-my-pi/pi-natives";
export { replaceTabs, truncateToWidth, wrapTextWithAnsi } from "@oh-my-pi/pi-tui";
/** Resolve inline image dimension caps from settings and viewport. */
export declare function resolveImageOptions(): {
    maxWidthCells: number;
    maxHeightCells?: number;
};
/** Preview limits for collapsed/expanded views */
export declare const PREVIEW_LIMITS: {
    /** Lines shown in collapsed view */
    readonly COLLAPSED_LINES: 3;
    /** Lines shown in expanded view */
    readonly EXPANDED_LINES: 12;
    /** Items (files, results) shown in collapsed view */
    readonly COLLAPSED_ITEMS: 8;
    /** Output preview lines in collapsed view */
    readonly OUTPUT_COLLAPSED: 3;
    /** Output preview lines in expanded view */
    readonly OUTPUT_EXPANDED: 10;
    /** Computer script lines shown in collapsed view */
    readonly COMPUTER_CODE_COLLAPSED: 10;
    /** Max hunks shown when collapsed (edit tool) */
    readonly DIFF_COLLAPSED_HUNKS: 8;
    /** Max diff lines shown when collapsed (edit tool) */
    readonly DIFF_COLLAPSED_LINES: 40;
};
/** Default number of terminal output rows shown before expansion. */
export declare const DEFAULT_TERMINAL_PREVIEW_LINES = 10;
/** Truncation lengths for different content types */
export declare const TRUNCATE_LENGTHS: {
    /** Short titles, labels */
    readonly TITLE: 60;
    /** Medium-length content (messages, previews) */
    readonly CONTENT: 80;
    /** Longer content (code, explanations) */
    readonly LONG: 100;
    /** Full line content */
    readonly LINE: 110;
    /** Very short (task previews, badges) */
    readonly SHORT: 40;
    /** Idle recap status line (~40-word LLM reply) */
    readonly RECAP: 280;
};
/** Human-readable key currently bound to tool-output expansion, e.g. `Ctrl+O`. */
export declare function expandKeyHint(): string;
/**
 * Get first N lines of text as preview, with each line truncated.
 */
export declare function getPreviewLines(text: string, maxLines: number, maxLineLen: number, ellipsis?: Ellipsis): string[];
/**
 * Collapse a possibly multi-line string into a single line, then truncate it to
 * `maxWidth` display cells. {@link truncateToWidth} alone caps width but
 * newlines are zero-width, so multi-line content (markdown briefs, tool args,
 * provider errors) would otherwise spill a single status row across several
 * visual lines. Whitespace runs collapse to one space, so tabs are handled too.
 */
export declare function previewLine(text: string, maxWidth: number, ellipsis?: Ellipsis): string;
/**
 * Extract domain from URL, stripping www. prefix.
 */
export declare function getDomain(url: string): string;
export { formatAge, formatBytes, formatCount, formatDuration, pluralize } from "@oh-my-pi/pi-utils";
/**
 * Get the appropriate status icon with color for a given state.
 * Standardizes status icon usage across all renderers.
 */
export declare function formatStatusIcon(status: ToolUIStatus, theme: Theme, spinnerFrame?: number): string;
/**
 * Format the expand hint with proper theming.
 * Returns empty string if already expanded or there is nothing more to show.
 */
export declare function formatExpandHint(theme: Theme, expanded?: boolean, hasMore?: boolean): string;
/**
 * Format a badge like [done] or [failed] with brackets and color.
 */
export declare function formatBadge(label: string, color: ToolUIColor, theme: Theme): string;
/**
 * Build a "more items" suffix line for truncated lists.
 * Uses consistent wording pattern.
 */
export declare function formatMoreItems(remaining: number, itemType: string): string;
/** Tail-window height for collapsed command/code previews. */
export declare function previewWindowRows(): number;
/**
 * Cap a pre-rendered command preview to a viewport-sized tail window: the end
 * of the command stays visible (it is the live edge while args stream) behind
 * an "… N earlier lines" marker on top. The same window applies while
 * streaming and after completion so the block never jumps; only `expanded`
 * (ctrl+o) uncaps it.
 *
 * `prefix` (raw, e.g. a dim tree gutter) is prepended to the marker line so
 * nested previews stay aligned. `expandHint: false` drops the "ctrl+o: Expand"
 * suffix for callers that cap even inside the expanded view (task recent
 * output), where the hint would point the wrong way.
 */
export declare function capPreviewLines(lines: string[], theme: Theme, options?: {
    max?: number;
    expanded?: boolean;
    prefix?: string;
    expandHint?: boolean;
}): string[];
export declare function formatMeta(meta: string[], theme: Theme): string;
export declare function formatErrorMessage(message: string | undefined, theme: Theme): string;
/**
 * Error message rendered as a subordinate detail line beneath a status header
 * that already carries the error icon (e.g. `✘ Write: <path>`). The header's
 * icon already signals failure, so this omits the redundant error symbol and
 * "Error:" prefix that `formatErrorMessage` adds for standalone single-line
 * errors, indenting two columns to sit under the header title instead.
 */
export declare function formatErrorDetail(message: string | undefined, theme: Theme): string;
export declare function formatEmptyMessage(message: string, theme: Theme): string;
export type CodeFrameMarker = "" | " " | "*" | "+" | "-" | ">";
export declare function formatCodeFrameLine(marker: CodeFrameMarker, lineNumber: string | number, content: string, lineNumberWidth: number): string;
export type ToolUIStatus = "success" | "done" | "error" | "warning" | "info" | "pending" | "running" | "aborted";
export type ToolUIColor = "success" | "error" | "warning" | "accent" | "muted";
export interface ToolUITitleOptions {
    bold?: boolean;
}
export declare function formatTitle(label: string, theme: Theme, options?: ToolUITitleOptions): string;
export declare function formatDiagnostics(diag: {
    errored: boolean;
    summary: string;
    messages: string[];
}, expanded: boolean, theme: Theme, getLangIcon: (filePath: string) => string, options?: {
    title?: string;
}): string;
export interface DiffStats {
    added: number;
    removed: number;
    hunks: number;
    lines: number;
}
export declare function getDiffStats(diffText: string): DiffStats;
export declare function formatDiffStats(added: number, removed: number, hunks: number, theme: Theme): string;
export declare function truncateDiffByHunk(diffText: string, maxHunks: number, maxLines: number, options?: {
    fromTail?: boolean;
}): {
    text: string;
    hiddenHunks: number;
    hiddenLines: number;
};
export declare function shortenPath(filePath: unknown, homeDir?: string): string;
export declare function formatToolWorkingDirectory(workdir: string | undefined, projectDir: string): string | undefined;
export declare function formatScreenshot(opts: {
    saveFullRes: boolean;
    savedMimeType: string;
    savedByteLength: number;
    dest: string;
    resized: ResizedImage;
}): string[];
export declare function wrapBrackets(text: string, theme: Theme): string;
export declare const PARSE_ERRORS_LIMIT = 20;
export declare function dedupeParseErrors(errors: string[] | undefined): string[];
export declare function formatParseErrors(errors: string[], total?: number): string[];
/**
 * Cap an upstream parse-error list to {@link PARSE_ERRORS_LIMIT} unique entries,
 * preserving the original deduplicated total. Use this at the source so tool
 * details never carry thousands of per-file parse errors into traces or
 * renderers.
 */
export declare function capParseErrors(errors: string[] | undefined, limit?: number): {
    errors: string[];
    total: number;
};
/**
 * Standard width+expand keyed render cache used by every search-style tool
 * renderer. `compute` re-runs only when the cache key changes; the returned
 * Component is the canonical `{ render, invalidate }` pair.
 */
export declare function createCachedComponent(getExpanded: () => boolean, compute: (width: number, expanded: boolean) => string[], options?: {
    paddingX?: number;
}): Component;
/**
 * Single-slot memo for an expensive rendered string (syntax highlighting, diff
 * coloring) keyed by the exact inputs that shape the bytes: theme instance,
 * expanded state, a caller-chosen salt (path/language), and the source content.
 * Field-wise comparison instead of a concatenated key string: a cache hit costs
 * one string value-compare (engines short-circuit on length) and a miss never
 * allocates a key. Comparing the {@link Theme} by reference is sound because
 * theme switches replace the instance wholesale (`setTheme`/`previewTheme`/
 * `setSymbolPreset` in modes/theme/theme.ts) — themes are never mutated in
 * place.
 */
export interface RenderedStringCache {
    theme: Theme | null;
    expanded: boolean;
    salt: string;
    content: string;
    value: string;
}
export declare function createRenderedStringCache(): RenderedStringCache;
/** Drop the memo so the next lookup re-renders (e.g. the render function identity changed). */
export declare function invalidateRenderedStringCache(cache: RenderedStringCache): void;
export declare function cachedRenderedString(cache: RenderedStringCache | undefined, theme: Theme, expanded: boolean, salt: string, content: string, render: () => string): string;
/**
 * Append the indented bullet list of parse errors (capped at
 * {@link PARSE_ERRORS_LIMIT}) to `lines`, with an overflow summary line if the
 * total exceeds the cap. No-op when `parseErrors` is empty.
 */
export declare function appendParseErrorsBulletList(lines: string[], parseErrors: readonly string[] | undefined, theme: Theme, total?: number): void;
/**
 * Human-readable summary string for the parse-issues count, capped by
 * {@link PARSE_ERRORS_LIMIT}.
 */
export declare function formatParseErrorsCountLabel(parseErrors: readonly string[], total?: number): string;
export interface LspBatchRequest {
    id: string;
    flush: boolean;
}
export declare function getLspBatchRequest(toolCall: ToolCallContext | undefined): LspBatchRequest | undefined;
