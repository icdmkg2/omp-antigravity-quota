/** A gradient keyword highlighter.
 *
 * - `resetTo` is the SGR foreground sequence re-emitted after each painted
 *   keyword so surrounding text keeps its color; it defaults to a plain
 *   foreground reset (editor / default-colored text).
 * - `phase` ∈ [0, 1) rotates the gradient stops cyclically; pass `Date.now()`-
 *   derived values to animate a shimmer. Defaults to `0` (the static
 *   sent-bubble palette). */
export type KeywordHighlighter = (text: string, resetTo?: string, phase?: number) => string;
/** Declarative spec for {@link createGradientHighlighter}. */
export interface GradientHighlightSpec {
    /** Cheap, stateless presence probe used to skip the boundary regex on most lines. Must be non-global. */
    probe: RegExp;
    /** Global, word-bounded match regex walked by `.replace`. */
    highlight: RegExp;
    /** Number of color stops swept across the gradient. */
    stops: number;
    /** Maps a normalized position `t` in [0, 1) to an HSL hue in degrees. */
    hue: (t: number) => number;
    /** HSL saturation percentage. Default 90. */
    saturation?: number;
    /** HSL lightness percentage. Default 62. */
    lightness?: number;
}
/**
 * Build a stateless highlighter that paints each standalone match of `highlight`
 * with a smooth HSL gradient for editor display. The returned function adds only
 * zero-width SGR escapes — the visible width is unchanged — and returns the input
 * untouched when `probe` does not match. The palette is compiled lazily and
 * memoized per active color mode.
 */
export declare function createGradientHighlighter(spec: GradientHighlightSpec): KeywordHighlighter;
