/**
 * Shared renderer for a horizontal row of colored "segments" styled after the
 * status line: each segment is colored by its track position from the theme's
 * own palette, the active one is filled as a powerline chip (its color as the
 * background, a luminance-matched label, flanked by triangle caps) and the
 * rest are plain colored labels joined by a thin separator.
 *
 * Used by the plan-mode model-tier slider ({@link HookSelectorComponent}) and
 * the ctrl+p role-cycle status so both surfaces read identically.
 */
import { type ThemeColor } from "../theme/theme.js";
export interface TrackSegment {
    label: string;
}
/**
 * Resolve up to `count` theme colors that render distinctly under the active
 * theme, in candidate preference order. May return fewer than `count` when the
 * theme has fewer distinct hues (e.g. monochrome themes) — callers wrap with
 * modulo. Never returns an empty array: `accent` always resolves.
 */
export declare function resolveSegmentPalette(count: number): ThemeColor[];
/**
 * Render `segments` as a colored chip track with `activeIndex` filled. Returns
 * a single line of styled text with no surrounding caption or arrows — callers
 * frame it as they need.
 */
export declare function renderSegmentTrack(segments: TrackSegment[], activeIndex: number): string;
