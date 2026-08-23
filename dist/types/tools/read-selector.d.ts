import type { LineRange } from "./path-utils.js";
/** Parsed representation of a path-embedded selector. */
export type ParsedSelector = {
    kind: "none";
} | {
    kind: "raw";
} | {
    kind: "conflicts";
} | {
    kind: "lines";
    ranges: [LineRange, ...LineRange[]];
    raw?: boolean;
};
/** Returns true when the selector requested verbatim/raw output (alone or combined with a range). */
export declare function isRawSelector(parsed: ParsedSelector): boolean;
/** Returns true when the selector requested multiple line ranges. */
export declare function isMultiRange(parsed: ParsedSelector): boolean;
export declare function parseSel(sel: string | undefined): ParsedSelector;
/**
 * Convert a single-range selector to the offset/limit pair used by internal pagination.
 * Returns the FIRST range only — multi-range callers MUST branch on `isMultiRange` before
 * calling this helper.
 */
export declare function selToOffsetLimit(parsed: ParsedSelector): {
    offset?: number;
    limit?: number;
};
