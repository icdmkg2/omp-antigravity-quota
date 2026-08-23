export interface LineSpan {
    startLine: number;
    endLine: number;
}
/** Where the source came from, so tree-sitter can pick a grammar. */
export interface BlockContextSource {
    path?: string;
    lang?: string;
    /**
     * The whole source `fullLines` was split from, when the caller still holds it.
     * Supplying it skips re-joining every line into a fresh whole-file string on
     * the way to the parser. It MUST be the same content as `fullLines`; a
     * differing trailing newline is the only tolerated variation, since it moves
     * no node's line number.
     *
     * Every current supplier derives both from one buffer in the same breath, so
     * the two cannot drift. Do NOT set it on a source object that is reused
     * across two different line arrays — a before/after diff pair, say — because
     * the boundary lines tree-sitter reports would then be indexed into the wrong
     * array and surface off-by-N context rows.
     */
    text?: string;
}
export type LineEntry = {
    kind: "line";
    lineNumber: number;
    text: string;
    context: boolean;
} | {
    kind: "ellipsis";
};
/**
 * Resolve the off-window boundary lines for a visible window: tree-sitter
 * syntactic spans first (covers brace and indentation languages), falling back
 * to a lexical bracket scan when the grammar is unavailable. Returns a map of
 * `lineNumber → source text` for the lines to surface, never including a line
 * already visible.
 */
export declare function findBlockContextLines(fullLines: readonly string[], visibleInput: ReadonlySet<number> | readonly number[], source?: BlockContextSource): Map<number, string>;
/**
 * Build display entries for `visibleSpans` plus any off-window block-boundary
 * lines, in source order, with `{ kind: "ellipsis" }` markers inserted across
 * non-contiguous gaps. `options.lineText` lets callers substitute display text
 * (e.g. column-truncated lines) for a given line number.
 */
export declare function buildLineEntriesWithBlockContext(fullLines: readonly string[], visibleSpans: readonly LineSpan[], source?: BlockContextSource, options?: {
    lineText?: (lineNumber: number, sourceText: string, context: boolean) => string;
}): LineEntry[];
export declare function lineEntriesToPlainText(entries: readonly LineEntry[], ellipsis?: string): string;
