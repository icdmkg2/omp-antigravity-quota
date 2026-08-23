/**
 * Hierarchical tree list rendering helper.
 */
import type { Theme } from "../modes/theme/theme.js";
import type { TreeContext } from "./types.js";
export interface TreeListOptions<T> {
    items: T[];
    expanded?: boolean;
    maxCollapsed?: number;
    /** Strict total-line budget for collapsed mode. When set (and not expanded),
     *  rendered item lines plus the trailing summary line must fit within this budget.
     */
    maxCollapsedLines?: number;
    itemType?: string;
    truncateFrom?: "start" | "end";
    /** Caller-supplied trailing summary line. When set (and not expanded),
     *  `renderTreeList` renders exactly the provided `items` (the caller has
     *  already applied its own selection/cap) and appends this text as the
     *  final `└` row, with the last item using `├`. Empty string renders the
     *  items with no summary. Bypasses the built-in truncation/`maxCollapsed`
     *  path. */
    trailingSummary?: string;
    /** Called once per item with `isLast: false` during budget calculation;
     *  line count MUST NOT vary based on `isLast`. */
    renderItem: (item: T, context: TreeContext) => string | string[];
}
export declare function renderTreeList<T>(options: TreeListOptions<T>, theme: Theme): string[];
