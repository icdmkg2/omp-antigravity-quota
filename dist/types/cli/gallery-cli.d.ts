import { type GalleryFixture } from "./gallery-fixtures/index.js";
/** Lifecycle states the gallery renders, in display order. */
export declare const GALLERY_STATES: readonly ["streaming", "progress", "success", "error"];
export type GalleryState = (typeof GALLERY_STATES)[number];
/** User-facing labels printed above each rendered lifecycle state. */
export declare const GALLERY_STATE_LABELS: Record<GalleryState, string>;
/** Accepted `--state` tokens, including legacy lifecycle names and displayed labels. */
export declare const GALLERY_STATE_TOKENS: string[];
/** Normalize user-provided `--state` tokens to the internal gallery lifecycle states. */
export declare function parseGalleryStates(states: readonly string[] | undefined): GalleryState[] | undefined;
export interface GalleryCommandArgs {
    /** Render width in columns (defaults to terminal width, clamped). */
    width?: number;
    /** Restrict to a single tool name. */
    tool?: string;
    /** Restrict to specific lifecycle states. */
    states?: GalleryState[];
    /** Render the expanded variant of each renderer. */
    expanded?: boolean;
    /** Strip ANSI styling from the output (useful when redirecting to a file). */
    plain?: boolean;
    /** Capture the rendered gallery as PNG screenshot(s) via VHS instead of printing ANSI. */
    screenshot?: boolean;
    /** Screenshot output path (single image) or base path (suffixed when split across images). */
    out?: string;
    /** Font family for screenshots (must be installed; Nerd Font recommended for icon glyphs). */
    font?: string;
    /** Font size in points for screenshots. */
    fontSize?: number;
}
/** One tool's rendered lifecycle, as ANSI lines: a leading blank, the section rule, then each state. */
export interface GallerySection {
    heading: string;
    lines: string[];
}
/** The curated fixture for a tool, or a generic one for registry tools lacking sample data. */
export declare function resolveFixture(name: string): GalleryFixture;
/**
 * Render a single tool/state pair to lines. Builds a fresh component, drives it
 * to the requested state, settles any async edit preview, then snapshots the
 * render and stops all animation timers.
 */
export declare function renderGalleryState(name: string, fixture: GalleryFixture, state: GalleryState, width: number, expanded?: boolean): Promise<readonly string[]>;
/**
 * Render the gallery. Iterates the renderer registry (or a single tool),
 * printing each requested lifecycle state under a labeled section — or, with
 * `screenshot`, capturing the rendered output as PNG(s) via VHS.
 */
export declare function runGalleryCommand(args: GalleryCommandArgs): Promise<void>;
