import { type KeywordHighlighter } from "./gradient-highlight.js";
/** WORKFLOW_NOTICE is the default hidden notice for sessions with batched task calls enabled. */
export declare const WORKFLOW_NOTICE: string;
/** renderWorkflowNotice renders the workflow notice for the active task schema. */
export declare function renderWorkflowNotice({ taskBatch, scoutAvailable, }: {
    taskBatch: boolean;
    scoutAvailable?: boolean;
}): string;
/**
 * Whether `text` contains the standalone keyword "workflowz"
 * (lowercase, prose-delimited) in prose — never inside a code block, inline
 * code span, or XML/HTML section.
 */
export declare function containsWorkflow(text: string): boolean;
/**
 * Highlight every standalone "workflowz" in `text` for editor display
 * with a warm amber→green gradient (hue 30..150), visually distinct from
 * ultrathink's rainbow and orchestrate's teal→violet.
 */
export declare const highlightWorkflow: KeywordHighlighter;
