import { type Theme } from "../../modes/theme/theme.js";
export interface RenderDiffOptions {
    /** File path used to resolve indentation (.editorconfig + defaults) */
    filePath?: string;
    /** Theme used for diff colors and syntax highlighting; defaults to the active TUI theme. */
    theme?: Theme;
}
/**
 * Render a diff string with colored lines and intra-line change highlighting.
 * - Context lines: dim/gray
 * - Removed lines: red, with inverse on changed tokens
 * - Added lines: green, with inverse on changed tokens
 */
export declare function renderDiff(diffText: string, options?: RenderDiffOptions): string;
