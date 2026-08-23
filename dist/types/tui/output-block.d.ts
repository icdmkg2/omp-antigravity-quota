/**
 * Bordered output container with optional header and sections.
 */
import type { Component } from "@oh-my-pi/pi-tui";
import type { Theme, ThemeColor } from "../modes/theme/theme.js";
import type { State } from "./types.js";
export interface OutputBlockOptions {
    header?: string;
    headerMeta?: string;
    state?: State;
    sections?: Array<{
        label?: string;
        lines: readonly string[];
        separator?: boolean;
    }>;
    width: number;
    applyBg?: boolean;
    contentPaddingLeft?: number;
    contentPaddingRight?: number;
    /** Override the state-derived border color. Used for muted "legacy" tool
     * frames that should not visually compete with framed-output tools. */
    borderColor?: ThemeColor;
}
declare const FRAMED_BLOCK_COMPONENT: unique symbol;
export type FramedBlockComponent = Component & {
    [FRAMED_BLOCK_COMPONENT]?: true;
};
export declare function markFramedBlockComponent<T extends Component>(component: T): T & FramedBlockComponent;
export declare function isFramedBlockComponent(component: Component): boolean;
/**
 * Inner content width that {@link renderOutputBlock} wraps its body to, for a
 * given outer `width`: both vertical borders plus symmetric content padding.
 * An explicit left padding of zero keeps legacy flush blocks flush on both
 * sides unless a right padding is provided separately.
 */
export declare function outputBlockContentWidth(width: number, contentPaddingLeft?: number, contentPaddingRight?: number): number;
export declare function renderOutputBlock(options: OutputBlockOptions, theme: Theme): string[];
/**
 * Cached wrapper around `renderOutputBlock`.
 *
 * Since output blocks are re-rendered on every frame (via `render(width)` closures),
 * but their content rarely changes, this cache avoids redundant `visibleWidth()` and
 * `padding()` computations on ~99% of render calls.
 */
export declare class CachedOutputBlock {
    #private;
    /** Render with caching. Returns the cached (shared, caller-immutable) lines if options haven't changed. */
    render(options: OutputBlockOptions, theme: Theme): readonly string[];
    /** Invalidate the cache, forcing a rebuild on next render. */
    invalidate(): void;
}
/**
 * Build a self-framing tool component backed by a cached output block. The
 * `build` callback returns the block options for a given width; the cache
 * dedupes re-renders. Pass `borderColor: "borderMuted"` for the dim "legacy"
 * look that does not compete with the state-colored framed tools.
 */
export declare function framedBlock(theme: Theme, build: (width: number) => OutputBlockOptions): Component;
export {};
