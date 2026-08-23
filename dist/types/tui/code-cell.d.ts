import { type Theme } from "../modes/theme/theme.js";
export interface CodeCellOptions {
    code: string;
    language?: string;
    index?: number;
    total?: number;
    title?: string;
    status?: "pending" | "running" | "warning" | "complete" | "error";
    spinnerFrame?: number;
    duration?: number;
    output?: string;
    outputMaxLines?: number;
    codeMaxLines?: number;
    /**
     * Show the LAST `codeMaxLines` rows (the live streaming edge) instead of the
     * first, with a "… N earlier lines" marker on top. Lets a pending preview
     * follow code as it is written while staying bounded. Ignored when `expanded`.
     */
    codeTail?: boolean;
    expanded?: boolean;
    /**
     * Prefix the header with the cell's language icon (resolved through the
     * active symbol preset: nerd-font devicon, unicode emoji, or ascii
     * shorthand). Opt-in so only the eval kernel renderer labels each cell;
     * read/write/browser code cells stay icon-free.
     */
    showLanguage?: boolean;
    width: number;
    codeStartLine?: number;
    codeLineNumbers?: Array<number | null>;
}
export declare function renderCodeCell(options: CodeCellOptions, theme: Theme): string[];
export interface MarkdownCellOptions {
    content: string;
    index?: number;
    total?: number;
    title?: string;
    status?: "pending" | "running" | "warning" | "complete" | "error";
    spinnerFrame?: number;
    duration?: number;
    output?: string;
    outputMaxLines?: number;
    contentMaxLines?: number;
    expanded?: boolean;
    width: number;
}
export declare function renderMarkdownCell(options: MarkdownCellOptions, theme: Theme): string[];
