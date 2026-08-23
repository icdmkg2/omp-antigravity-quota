import { type BlockContextSource } from "../utils/block-context.js";
export interface DiffResult {
    diff: string;
    firstChangedLine: number | undefined;
}
export interface DiffError {
    error: string;
}
export interface DiffHunk {
    changeContext?: string;
    oldStartLine?: number;
    newStartLine?: number;
    hasContextLines: boolean;
    oldLines: string[];
    newLines: string[];
    isEndOfFile: boolean;
}
export declare class ParseError extends Error {
    readonly lineNumber?: number | undefined;
    constructor(message: string, lineNumber?: number | undefined);
}
export declare class ApplyPatchError extends Error {
    constructor(message: string);
}
/**
 * Generate a unified diff string with line numbers and context.
 * Returns both the diff string and the first changed line number (in the new file).
 */
export declare function generateDiffString(oldContent: string, newContent: string, contextLines?: number, source?: BlockContextSource): DiffResult;
export interface ReplaceOptions {
    /** Allow fuzzy matching */
    fuzzy: boolean;
    /** Replace all occurrences */
    all: boolean;
    /** Similarity threshold for fuzzy matching */
    threshold?: number;
}
export interface ReplaceResult {
    /** The new content after replacements */
    content: string;
    /** Number of replacements made */
    count: number;
}
/**
 * Generate a unified diff string without file headers.
 * Returns both the diff string and the first changed line number (in the new file).
 */
export declare function generateUnifiedDiffString(oldContent: string, newContent: string, contextLines?: number, source?: BlockContextSource): DiffResult;
export declare function normalizeDiff(diff: string): string;
export declare function normalizeCreateContent(content: string): string;
export declare function parseDiffHunks(diff: string): DiffHunk[];
/**
 * Find and replace text in content using fuzzy matching.
 */
export declare function replaceText(content: string, oldText: string, newText: string, options: ReplaceOptions): ReplaceResult;
/**
 * Compute the diff for an edit operation without applying it.
 * Used for preview rendering in the TUI before the tool executes.
 */
export declare function computeEditDiff(path: string, oldText: string, newText: string, cwd: string, fuzzy?: boolean, all?: boolean, threshold?: number): Promise<DiffResult | DiffError>;
