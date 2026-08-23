/**
 * Text normalization utilities for the edit tool.
 *
 * Whitespace, Unicode, and indentation helpers. Line-ending and BOM
 * primitives live in `@oh-my-pi/hashline` and are re-exported here so
 * existing consumers see one stable surface.
 */
export { type BomResult, detectLineEnding, type LineEnding, normalizeToLF, restoreLineEndings, stripBom, } from "@oh-my-pi/hashline";
/** Count leading whitespace characters in a line */
export declare function countLeadingWhitespace(line: string): number;
/** Get the leading whitespace string from a line */
export declare function getLeadingWhitespace(line: string): string;
/** Compute minimum indentation of non-empty lines */
export declare function minIndent(text: string): number;
/** Detect the indentation character used in text (space or tab) */
export declare function detectIndentChar(text: string): string;
export declare function convertLeadingTabsToSpaces(text: string, spacesPerTab: number): string;
export declare function normalizeUnicode(s: string): string;
/**
 * Normalize a line for fuzzy comparison.
 * Trims, collapses whitespace, and normalizes punctuation.
 */
export declare function normalizeForFuzzy(line: string): string;
/**
 * Adjust newText indentation to match the indentation delta between
 * what was provided (oldText) and what was actually matched (actualText).
 *
 * If oldText has 0 indent but actualText has 12 spaces, we add 12 spaces
 * to each line in newText.
 */
export declare function adjustIndentation(oldText: string, actualText: string, newText: string): string;
