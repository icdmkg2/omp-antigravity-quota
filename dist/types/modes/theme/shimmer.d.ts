import type { Theme, ThemeColor } from "./theme.js";
type ShimmerTheme = Pick<Theme, "bold" | "fg" | "getFgAnsi">;
type ShimmerPaletteTier = ThemeColor | {
    ansi: string;
};
/** Three-tier color stack a shimmer character cycles through as the band sweeps. */
export interface ShimmerPalette {
    /** Color for chars outside / at the edge of the band (intensity < ~0.22). */
    low: ShimmerPaletteTier;
    /** Color for chars approaching the crest (~0.22 ≤ intensity < ~0.65). */
    mid: ShimmerPaletteTier;
    /** Color at the band's crest (intensity ≥ ~0.65). */
    high: ShimmerPaletteTier;
    /** Whether to bold the crest tier. Default `false`. */
    bold?: boolean;
}
/** One run of text that shares a palette inside a larger shimmer sweep. */
export interface ShimmerSegment {
    text: string;
    palette?: ShimmerPalette;
}
export declare const DEFAULT_SHIMMER_PALETTE: ShimmerPalette;
/** Whether shimmer animations are active (any mode other than `disabled`). */
export declare function shimmerEnabled(): boolean;
/**
 * Apply a shimmer sweep across one or more segments, treating them as a
 * single continuous string for band positioning. Each segment can supply
 * its own palette so the gradient stays in lockstep while the colors
 * differ.
 *
 * Performance shape (per call, dominant cost):
 *   - One `Date.now()` read.
 *   - One `compile()` lookup per segment (Symbol-keyed cache slot, hot path
 *     skipped after first frame).
 *   - One ANSI open/close pair per **run of same-tier chars**, not per char.
 *   - No per-char allocations beyond the run buffer.
 */
export declare function shimmerSegments(segments: readonly ShimmerSegment[], theme: ShimmerTheme): string;
export declare function shimmerText(text: string, theme: ShimmerTheme, palette?: ShimmerPalette): string;
export {};
