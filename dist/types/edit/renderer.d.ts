/**
 * Edit tool renderer and LSP batching helpers.
 */
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { FileDiagnosticsResult } from "../lsp/index.js";
import { type Theme } from "../modes/theme/theme.js";
import type { OutputMeta } from "../tools/output-meta.js";
import { getLspBatchRequest, type LspBatchRequest } from "../tools/render-utils.js";
import type { ToolActivityContext, ToolActivitySummary } from "../tools/renderers.js";
import type { EditMode } from "../utils/edit-mode.js";
import type { DiffError, DiffResult } from "./diff.js";
import type { Operation } from "./modes/patch.js";
import type { PerFileDiffPreview } from "./streaming.js";
export { getLspBatchRequest, type LspBatchRequest };
export interface EditToolPerFileResult {
    path: string;
    diff: string;
    firstChangedLine?: number;
    diagnostics?: FileDiagnosticsResult;
    op?: Operation;
    move?: string;
    isError?: boolean;
    errorText?: string;
    /** TUI-friendly error text. When present, rendered to the user instead of `errorText`.
     * Set when the underlying error carries a `displayMessage` (e.g. {@link HashlineMismatchError}). */
    displayErrorText?: string;
    meta?: OutputMeta;
    /** Source-of-truth content before the edit; `undefined` for create operations. */
    oldText?: string;
    /** Source-of-truth content after the edit; `undefined` for delete operations. */
    newText?: string;
    /** True when {@link pruneOversizedEditSnapshots} dropped `oldText`/`newText` from this entry. Aggregators check this to suppress misleading combined snapshots when at least one entry of a multi-entry single-path edit was pruned. */
    snapshotsPruned?: boolean;
    /** Pre-move source path; set only when the edit moved/renamed the file. The header renders `sourcePath → path`. */
    sourcePath?: string;
}
export interface EditToolDetails {
    /** Unified diff of the changes made */
    diff: string;
    /** Line number of the first change in the new file (for editor navigation) */
    firstChangedLine?: number;
    /** Diagnostic result (if available) */
    diagnostics?: FileDiagnosticsResult;
    /** Operation type (patch mode only) */
    op?: Operation;
    /** New path after move/rename (patch mode only) */
    move?: string;
    /** Structured output metadata */
    meta?: OutputMeta;
    /** Per-file results (multi-file edits) */
    perFileResults?: EditToolPerFileResult[];
    /** Absolute file path for single-file edit results. Required by ACP diff metadata consumers. */
    path?: string;
    /** Source-of-truth content before the edit; `undefined` for create operations. */
    oldText?: string;
    /** Source-of-truth content after the edit; `undefined` for delete operations. */
    newText?: string;
    /** True when {@link pruneOversizedEditSnapshots} dropped `oldText`/`newText` from this entry. Aggregators check this to suppress misleading combined snapshots when at least one entry of a multi-entry single-path edit was pruned. */
    snapshotsPruned?: boolean;
    /** Pre-move source path; set only when the edit moved/renamed the file. The header renders `sourcePath → path`. */
    sourcePath?: string;
}
interface EditRenderArgs {
    path?: unknown;
    file_path?: unknown;
    oldText?: string;
    newText?: string;
    patch?: string;
    input?: string;
    _input?: string;
    replace_all?: boolean;
    op?: Operation;
    rename?: unknown;
    diff?: string;
    /**
     * Computed preview diff (used when tool args don't include a diff, e.g. hashline mode).
     */
    previewDiff?: string;
    __partialJson?: string;
    edits?: EditRenderEntry[];
}
type EditRenderEntry = {
    path?: unknown;
    rename?: unknown;
    move?: unknown;
    op?: Operation;
};
/** Extended context for edit tool rendering */
export interface EditRenderContext {
    /** Edit mode resolved by the caller; lets the renderer dispatch without shape-sniffing */
    editMode?: EditMode;
    /** Pre-computed diff preview (computed before tool executes) */
    editDiffPreview?: DiffResult | DiffError;
    /** Multi-file streaming diff preview (edits spanning several files) */
    perFileDiffPreview?: PerFileDiffPreview[];
    /** Raw in-flight edit text shown while a computed diff preview is unavailable */
    editStreamingFallback?: string;
    /** Function to render diff text with syntax highlighting */
    renderDiff?: (diffText: string, options?: {
        filePath?: string;
    }) => string;
}
export declare const editToolRenderer: {
    mergeCallAndResult: boolean;
    /** Compact one-line activity: operation + target path instead of the payload's first line. */
    activitySummary(args: unknown, context: ToolActivityContext): ToolActivitySummary;
    renderCall(args: EditRenderArgs, options: RenderResultOptions & {
        renderContext?: EditRenderContext;
    }, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: EditToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions & {
        renderContext?: EditRenderContext;
    }, uiTheme: Theme, args?: EditRenderArgs): Component;
};
