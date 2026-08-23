/**
 * Detect and resolve unresolved git merge conflicts that surface in `read`
 * output.
 *
 * Workflow:
 *   1. `read` collects lines from disk as usual.
 *   2. `scanConflictLines` inspects those lines (no extra I/O) for
 *      well-formed `<<<<<<<` / `=======` / `>>>>>>>` blocks.
 *   3. Each completed block is registered with the session's
 *      `ConflictHistory`, which assigns it a stable id.
 *   4. The read output is returned verbatim with a short footer naming
 *      every conflict id surfaced, and the agent calls
 *      `write({ path: "conflict://<id>", content })` to splice the
 *      recorded region with the chosen content.
 *
 * Marker shape is strict: only column-0 markers of the exact prefix length
 * followed by either EOL or a single space + label count. Lines that
 * merely start with `<` or `=` never match.
 */
import type { ToolSession } from "./index.js";
export interface ConflictBlock {
    /** 1-indexed line of the `<<<<<<<` marker. */
    startLine: number;
    /** 1-indexed line of the `=======` separator. */
    separatorLine: number;
    /** 1-indexed line of the `>>>>>>>` marker. */
    endLine: number;
    /** 1-indexed line of the `|||||||` base marker (diff3 only). */
    baseLine?: number;
    oursLabel?: string;
    baseLabel?: string;
    theirsLabel?: string;
    oursLines: string[];
    baseLines?: string[];
    theirsLines: string[];
}
/**
 * Scan an already-collected array of file lines for completed conflict
 * blocks. `firstLineNumber` is the 1-indexed line number of `lines[0]`
 * (so a windowed read starting at line 200 passes `firstLineNumber: 200`).
 *
 * Only fully-closed blocks (opener + separator + closer all present in
 * the window) are returned. A block whose closer is past the window's
 * tail is dropped — the agent will see the open marker and can widen
 * the read.
 */
export declare function scanConflictLines(lines: readonly string[], firstLineNumber: number): ConflictBlock[];
/**
 * Scan a whole file for unresolved conflict blocks.
 *
 * Reads at most `maxBytes` (default 10 MB) so this stays cheap on
 * pathological files. Files truncated by the cap report
 * `scanTruncated: true`; only complete blocks within the scanned prefix
 * are returned, so trailing partial markers never invent fake blocks.
 */
export declare function scanFileForConflicts(absolutePath: string, options?: {
    maxBytes?: number;
}): Promise<{
    blocks: ConflictBlock[];
    scanTruncated: boolean;
}>;
/**
 * Recorded conflict block keyed by a session-stable id. The history is
 * append-only; ids stay valid even after later writes resolve other
 * blocks in the same file, so retries don't depend on re-reading.
 */
export interface ConflictEntry extends ConflictBlock {
    id: number;
    absolutePath: string;
    displayPath: string;
}
/** Per-session log of conflict regions surfaced by `read`. */
export declare class ConflictHistory {
    #private;
    /**
     * Register a conflict block. Returns the (possibly pre-existing) entry
     * — if the same `absolutePath`+`startLine` was registered before, the
     * earlier id is reused so a re-read does not inflate the counter or
     * orphan the prior id. The recorded region is overwritten on re-read
     * so the splice always reflects the current marker positions on disk.
     */
    register(input: Omit<ConflictEntry, "id">): ConflictEntry;
    get(id: number): ConflictEntry | undefined;
    /** Snapshot every registered entry in insertion (id) order. */
    entries(): ConflictEntry[];
    /** Drop a single entry by id. Used after a successful resolve. */
    invalidate(id: number): void;
    /** Drop every entry referencing `absolutePath`. Used after a successful resolve. */
    invalidatePath(absolutePath: string): void;
}
/** Lazily attach a `ConflictHistory` to the session and return it. */
export declare function getConflictHistory(session: ToolSession): ConflictHistory;
/** A side of a conflict block that the `read` tool can render via `conflict://N/<scope>`. */
export type ConflictScope = "ours" | "theirs" | "base";
/** Parsed `conflict://<N>` / `conflict://<N>/<scope>` / `conflict://*` URI. */
export interface ParsedConflictUri {
    /** `"*"` selects every currently-registered conflict (bulk write only). */
    id: number | "*";
    scope?: ConflictScope;
    /**
     * When `raw` was a malformed `<file-prefix>:conflict://…` path, the
     * stripped prefix is preserved here so callers can surface a gentle
     * "you don't need the file path" note. `undefined` for clean URIs.
     */
    recoveredPrefix?: string;
}
/**
 * Parse a `conflict://<N>`, `conflict://<N>/<scope>`, or `conflict://*` URI.
 *
 * Returns `null` for non-conflict paths; throws `ToolError` for a
 * well-formed scheme with an invalid id or scope so the agent gets a
 * clear actionable message rather than a confusing "not found" later.
 *
 * `*` is the bulk-write wildcard — only valid as `conflict://*` (no
 * scope segment). Use it with `write({ path: "conflict://*", content })`
 * to apply `content` (with optional `@ours` / `@theirs` / `@base` /
 * `@both` shorthand) to every currently-registered conflict in one shot.
 */
export declare function parseConflictUri(raw: string): ParsedConflictUri | null;
/** Result of {@link spliceConflict}: the new file text plus any boundary-echo repair applied. */
export interface ConflictSplice {
    text: string;
    /** Replacement lines dropped because they duplicated the context directly above the region. */
    trimmedLeading: number;
    /** Replacement lines dropped because they duplicated the context directly below the region. */
    trimmedTrailing: number;
}
/**
 * Splice the conflict region recorded in `entry` out of `originalText`
 * and replace it with `replacement` (markers and all sides included).
 *
 * Works like the edit tool's patch infra: locates the recorded marker
 * block by content (anchored to `entry.startLine` as the preferred
 * match), so out-of-band edits earlier in the file that shift line
 * numbers don't break resolution. Throws clearly when the marker block
 * has actually been altered or removed.
 *
 * Boundary-echo repair (same philosophy as the edit tool's hashline
 * keeper repair): models frequently paste the "whole resolved function"
 * including the lines that live directly before/after the marker block,
 * which the verbatim splice would duplicate. Replacement lines that
 * exactly echo the adjacent context are dropped when the echo is
 * unambiguous — two or more consecutive lines, or a single line whose
 * removal fixes a delimiter-balance mismatch against the recorded sides.
 */
export declare function spliceConflict(originalText: string, entry: ConflictEntry, replacement: string): ConflictSplice;
/**
 * True when two registered blocks record the same marker-block content
 * (labels and all sides). Out-of-band edits can shift a block's line
 * numbers between reads, registering a fresh id while the stale one
 * persists; callers use content identity to treat a locate-miss for the
 * stale twin as "already resolved" instead of a hard failure.
 */
export declare function conflictRegionsEqual(a: ConflictBlock, b: ConflictBlock): boolean;
/**
 * True when the entry's recorded marker block still occurs in `content`
 * (LF-normalized — recorded sections are stored LF). Distinguishes a stale
 * re-registration of a just-resolved region (no longer present) from a
 * DISTINCT conflict block that happens to be byte-identical (still present
 * elsewhere in the file and must stay addressable).
 */
export declare function conflictRegionPresent(content: string, entry: ConflictBlock): boolean;
/**
 * Expand `@ours` / `@theirs` / `@base` / `@both` line tokens against the
 * recorded sections of `entry`. A token only triggers when it is the
 * entire content of a line (after CRLF normalisation), so `@ours` inside
 * actual code is left alone. Other lines pass through verbatim.
 *
 * - `@ours`    → expands to the recorded `oursLines` (in order).
 * - `@theirs`  → expands to the recorded `theirsLines` (in order).
 * - `@base`    → expands to `baseLines`; throws if no base section was
 *               recorded (i.e. the conflict was 2-way, not diff3).
 * - `@both`    → expands to `oursLines` then `theirsLines`.
 */
export declare function expandContentTokens(content: string, entry: ConflictEntry): string;
/**
 * Materialise a conflict block for `conflict://<N>` reads (and their
 * `/ours` / `/theirs` / `/base` scopes).
 *
 * Returns:
 * - `lines`: the lines to render, ordered top-to-bottom.
 * - `startLine`: the 1-indexed file line number `lines[0]` corresponds
 *   to, so the read formatter can label hashline anchors with the
 *   original file positions.
 *
 * Bare (no scope) returns the full block including marker lines. A
 * scoped view returns only that side's body — `base` throws when the
 * recorded conflict is a 2-way merge with no base section.
 */
export declare function renderConflictRegion(entry: ConflictEntry, scope: ConflictScope | undefined): {
    lines: string[];
    startLine: number;
};
/**
 * Build a compact diff-style footer describing the conflicts registered
 * during a read. Designed to be appended after the file content.
 *
 * Format:
 *
 *     ⚠ N unresolved conflicts detected
 *     - ours = HEAD
 *     - theirs = feature/x
 *     NOTICE: …
 *
 *     ──── #1  L42-48 ────
 *     <<< ours
 *     …ours body…
 *     === base ≡ ours
 *     >>> theirs
 *     …theirs body…
 *
 * Labels are aggregated once at the top from the first entry that has
 * them; when a section body equals another section's body the redundant
 * body is collapsed to `≡ <other>`.
 */
export interface FormatConflictWarningOptions {
    /**
     * Total number of conflicts in the underlying file. If greater than
     * `entries.length` the header notes how many are visible vs the total
     * and points at `:conflicts` for the compact list.
     */
    totalInFile?: number;
    /** Display path used inside the `:conflicts` hint. */
    displayPath?: string;
    /** Whether the underlying file scan hit its byte cap. */
    scanTruncated?: boolean;
}
export declare function formatConflictWarning(entries: readonly ConflictEntry[], options?: FormatConflictWarningOptions): string;
/**
 * Render a single-line-per-block index of every conflict in a file.
 * Used by the `<path>:conflicts` read selector to give the agent a cheap overview
 * of a heavily-conflicted file without dumping every body.
 */
export declare function formatConflictSummary(entries: readonly ConflictEntry[], options?: {
    displayPath: string;
    scanTruncated?: boolean;
}): string;
