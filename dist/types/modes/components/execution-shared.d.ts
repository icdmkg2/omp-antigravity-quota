/**
 * Shared rendering primitives for bash/eval execution components.
 *
 * Each helper isolates a piece of structure both components share verbatim
 * (frame layout, collapsed preview, post-run status line). Differences in
 * how each component prepares its header, output lines, or sixel masking
 * stay in their respective files.
 */
import { type Component, Container, Loader, Text, type TUI } from "@oh-my-pi/pi-tui";
import { type TruncationMeta } from "../../tools/output-meta.js";
export type ExecutionStatus = "running" | "complete" | "cancelled" | "error";
/** Theme color keys valid for an execution frame. */
export type ExecutionColorKey = "dim" | "bashMode" | "pythonMode";
/**
 * Build the spacer + top border + content container + bottom border scaffold
 * that bash and eval execution components share. The caller appends the
 * header (command vs `>>>` prompt) and the returned loader to
 * `contentContainer` so per-mode order is preserved.
 */
export declare function buildExecutionFrame(parent: Container, ui: TUI, colorKey: ExecutionColorKey): {
    contentContainer: Container;
    loader: Loader;
};
/**
 * Wrap a styled preview block in a render-time visual-line truncator.
 * Recomputed per render width so wrapping stays in sync with terminal size.
 */
export declare function createCollapsedPreview(previewText: string, previewLines: number): Component;
/**
 * Build the post-run status block (hidden-line hint, exit/cancel marker,
 * truncation notice). Returns undefined when there is nothing to display so
 * callers can skip appending a stray Text child.
 */
export declare function buildStatusFooter(opts: {
    status: ExecutionStatus;
    exitCode: number | undefined;
    truncation: TruncationMeta | undefined;
    hiddenLineCount: number;
    /** Suppress the "… N more lines" hint (used when sixel passthrough renders the full output). */
    suppressHiddenCount?: boolean;
}): Text | undefined;
/**
 * Derive the post-run status from an exit code + cancellation flag using the
 * same precedence both execution components apply.
 */
export declare function resolveExecutionStatus(exitCode: number | undefined, cancelled: boolean): ExecutionStatus;
