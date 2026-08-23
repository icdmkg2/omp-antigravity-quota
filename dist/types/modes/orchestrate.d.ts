import { type KeywordHighlighter } from "./gradient-highlight.js";
/** Hidden system notice appended after a user message that mentions "orchestrate". */
export declare function renderOrchestrateNotice(options: {
    tools: readonly string[];
}): string;
/**
 * Whether `text` contains the standalone keyword "orchestrate" (lowercase,
 * prose-delimited) in prose — never inside a code block, inline code span,
 * or XML/HTML section.
 */
export declare function containsOrchestrate(text: string): boolean;
/**
 * Highlight every standalone "orchestrate" in `text` for editor display with a
 * cool teal→violet gradient (hue 150..280), visually distinct from ultrathink's
 * full-spectrum rainbow.
 */
export declare const highlightOrchestrate: KeywordHighlighter;
