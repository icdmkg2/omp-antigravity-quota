/**
 * Render `rows` through a {@link ScrollView} with the shared list theme (muted
 * track / accent thumb) and an "auto" scrollbar, positioned at `scrollOffset`.
 * Returns the rendered lines for the caller to append to its output.
 */
export declare function renderScrollableList(rows: readonly string[], options: {
    width: number;
    totalRows: number;
    scrollOffset: number;
}): readonly string[];
/**
 * Center a viewport window of `maxVisible` rows on `selectedIndex` within a
 * list of `total` rows, clamped to valid bounds. Used by the selection-centered
 * list panes (history search, tree selector).
 */
export declare function centeredWindow(selectedIndex: number, total: number, maxVisible: number): {
    startIndex: number;
    endIndex: number;
};
/**
 * Width available for row content, reserving the rightmost column for the
 * scrollbar when the list overflows its visible window.
 */
export declare function contentRowWidth(width: number, total: number, maxVisible: number): number;
/**
 * Clamp `selectedIndex` into `[0, total)` and nudge `scrollOffset` so the
 * selection stays within the visible window of `maxVisible` rows. Returns the
 * adjusted pair; on an empty list both reset to 0.
 */
export declare function clampSelection(selectedIndex: number, scrollOffset: number, total: number, maxVisible: number): {
    selectedIndex: number;
    scrollOffset: number;
};
/**
 * Classify a key event for search-query text entry. Returns the single
 * printable character to append to the query, or `null` when the key is not a
 * searchable character: non-printable, multi-byte, or a reserved `j`/`k`
 * navigation key.
 */
export declare function searchableChar(data: string): string | null;
/**
 * Handle the shared tab-cycling keys: Tab/Right advance to the next tab,
 * Shift+Tab/Left to the previous. Invokes `switchTab` with the direction and
 * returns true when the key was consumed.
 */
export declare function handleTabSwitchKey(data: string, switchTab: (direction: 1 | -1) => void): boolean;
/**
 * Pad `lines` with blank rows up to `rows` so a full-screen overlay covers the
 * viewport instead of letting the transcript peek through below it. Copies
 * before padding — the source array may be component-owned and must not be
 * mutated.
 */
export declare function padLinesToHeight(lines: readonly string[], rows: number): readonly string[];
