/**
 * Fuzzy matching utilities for the edit tool.
 *
 * Provides both character-level and line-level fuzzy matching with progressive
 * fallback strategies for finding text in files.
 */
import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { WritethroughCallback, WritethroughDeferredHandle } from "../../lsp/index.js";
import type { ToolSession } from "../../tools/index.js";
import type { AppliedEditObserver } from "../blackbox.js";
import type { EditToolDetails, LspBatchRequest } from "../renderer.js";
export interface FuzzyMatch {
    actualText: string;
    startIndex: number;
    startLine: number;
    confidence: number;
}
export interface MatchOutcome {
    match?: FuzzyMatch;
    closest?: FuzzyMatch;
    occurrences?: number;
    occurrenceLines?: number[];
    occurrencePreviews?: string[];
    fuzzyMatches?: number;
    dominantFuzzy?: boolean;
}
export type SequenceMatchStrategy = "exact" | "trim-trailing" | "trim" | "comment-prefix" | "unicode" | "prefix" | "substring" | "fuzzy" | "fuzzy-dominant" | "character";
export interface SequenceSearchResult {
    index: number | undefined;
    confidence: number;
    matchCount?: number;
    matchIndices?: number[];
    strategy?: SequenceMatchStrategy;
}
export type ContextMatchStrategy = "exact" | "trim" | "unicode" | "prefix" | "substring" | "fuzzy";
export interface ContextLineResult {
    index: number | undefined;
    confidence: number;
    matchCount?: number;
    matchIndices?: number[];
    strategy?: ContextMatchStrategy;
}
export declare class EditMatchError extends Error {
    readonly path: string;
    readonly searchText: string;
    readonly closest: FuzzyMatch | undefined;
    readonly options: {
        allowFuzzy: boolean;
        threshold: number;
        fuzzyMatches?: number;
    };
    constructor(path: string, searchText: string, closest: FuzzyMatch | undefined, options: {
        allowFuzzy: boolean;
        threshold: number;
        fuzzyMatches?: number;
    });
    static formatMessage(path: string, searchText: string, closest: FuzzyMatch | undefined, options: {
        allowFuzzy: boolean;
        threshold: number;
        fuzzyMatches?: number;
    }): string;
}
/** Default similarity threshold for fuzzy matching */
export declare const DEFAULT_FUZZY_THRESHOLD = 0.95;
/** Compute Levenshtein distance between two strings */
export declare function levenshteinDistance(a: string, b: string): number;
/** Compute similarity score between two strings (0 to 1) */
export declare function similarity(a: string, b: string): number;
/**
 * Find a match for target text within content.
 * Used primarily for replace-mode edits; excluded ranges remain invisible to exact and fuzzy matching.
 */
export declare function findMatch(content: string, target: string, options: {
    allowFuzzy: boolean;
    threshold?: number;
    excludedRanges?: readonly {
        startIndex: number;
        endIndex: number;
    }[];
}): MatchOutcome;
/**
 * Find a sequence of pattern lines within content lines.
 *
 * Attempts matches with decreasing strictness:
 * 1. Exact match
 * 2. Trailing whitespace ignored
 * 3. All whitespace trimmed
 * 4. Unicode punctuation normalized
 * 5. Prefix match (pattern is prefix of line)
 * 6. Substring match (pattern is substring of line)
 * 7. Fuzzy similarity match
 *
 * @param lines - The lines of the file content
 * @param pattern - The lines to search for
 * @param start - Starting index for the search
 * @param eof - If true, prefer matching at end of file first
 */
export declare function seekSequence(lines: string[], pattern: string[], start: number, eof: boolean, options?: {
    allowFuzzy?: boolean;
}): SequenceSearchResult;
export declare function findClosestSequenceMatch(lines: string[], pattern: string[], options?: {
    start?: number;
    eof?: boolean;
}): {
    index: number | undefined;
    confidence: number;
    strategy: SequenceMatchStrategy;
};
/**
 * Find a context line in the file using progressive matching strategies.
 *
 * @param lines - The lines of the file content
 * @param context - The context line to search for
 * @param startFrom - Starting index for the search
 */
export declare function findContextLine(lines: string[], context: string, startFrom: number, options?: {
    allowFuzzy?: boolean;
    skipFunctionFallback?: boolean;
}): ContextLineResult;
export declare const replaceEditSchema: import("@oh-my-pi/omptype").FluentType<{
    new_string: string;
    old_string: string;
    path: string;
    replace_all?: boolean | undefined;
}, {
    new_string: string;
    old_string: string;
    path: string;
    replace_all?: boolean | undefined;
}>;
export type ReplaceParams = typeof replaceEditSchema.infer;
/**
 * Internal batch form of {@link ReplaceParams}, produced only by the Cursor
 * exec bridge: a `pi_edit` frame carries several replacements against one
 * path but must run as a single tool lifecycle with one aggregate result.
 * Never advertised to the model — the agent loop validates model calls
 * against {@link replaceEditSchema}, which has no `edits` field.
 */
export interface ReplaceBatchParams {
    path: string;
    edits: Omit<ReplaceParams, "path">[];
}
export interface ExecuteReplaceOptions {
    session: ToolSession;
    path: string;
    params: Omit<ReplaceParams, "path">;
    signal?: AbortSignal;
    batchRequest?: LspBatchRequest;
    allowFuzzy: boolean;
    fuzzyThreshold: number;
    writethrough: WritethroughCallback;
    beginDeferredDiagnosticsForPath: (path: string) => WritethroughDeferredHandle;
    /** Observes a committed content transition before result snapshots are pruned. */
    onApplied?: AppliedEditObserver;
}
export declare function executeReplace(options: ExecuteReplaceOptions): Promise<AgentToolResult<EditToolDetails, ReplaceParams>>;
