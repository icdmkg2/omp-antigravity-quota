/**
 * Pure heading/section parser for the plan-review overlay. It splits a plan's
 * markdown into a flat list of sections — a leading preamble (text before the
 * first heading) followed by one entry per ATX heading — preserving the exact
 * source bytes of each section so the overlay can render, reorder-free delete,
 * and round-trip the document without a full markdown re-render.
 *
 * No TUI dependencies: this module is unit-tested in isolation.
 */
export interface PlanSection {
    /** `0` = preamble (no heading, no ToC entry); `1..6` = heading depth. */
    level: number;
    /** Plain-text heading label with inline markdown lightly stripped. */
    title: string;
    /** Exact source slice for this section, including its trailing newline(s). */
    raw: string;
}
/**
 * Collapse inline markdown emphasis/link/code syntax to readable text. This is
 * a deliberately light strip (not a full markdown render) just so ToC entries
 * read cleanly — `**Goal** & [docs](x)` becomes `Goal & docs`.
 */
export declare function stripInlineMarkdown(text: string): string;
/**
 * Split `text` into preamble + heading sections. `#` characters inside fenced
 * code blocks are never treated as headings. Concatenating every section's
 * `raw` reproduces the original text exactly.
 */
export declare function parsePlanSections(text: string): PlanSection[];
/**
 * Concatenate every section's `raw` back into a single document and guarantee a
 * single trailing newline. Inverse of {@link parsePlanSections} for any input
 * that already ends with a newline.
 */
export declare function joinPlanSections(sections: readonly PlanSection[]): string;
/**
 * Indices to remove when deleting `sections[index]`: the heading itself plus
 * every following section nested deeper than it (its sub-headings). The
 * preamble (level 0) is never a deletion target and yields an empty span.
 */
export declare function sectionDeletionSpan(sections: readonly PlanSection[], index: number): number[];
