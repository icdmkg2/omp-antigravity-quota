import { type KeywordHighlighter } from "./gradient-highlight.js";
/** Hidden system notice appended after a user message that mentions "ultrathink". */
export declare const ULTRATHINK_NOTICE: string;
/**
 * Whether `text` contains the standalone keyword "ultrathink" (lowercase,
 * prose-delimited) in prose — never inside a code block, inline code span,
 * or XML/HTML section.
 */
export declare function containsUltrathink(text: string): boolean;
/**
 * Rainbow-highlight every standalone "ultrathink" in `text` for editor display.
 * Sweeps red→violet (hue 0..330), stopping short of the wrap back to red so the
 * gradient resolves smoothly regardless of casing or match length.
 */
export declare const highlightUltrathink: KeywordHighlighter;
