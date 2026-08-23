import type { Component } from "@oh-my-pi/pi-tui";
/**
 * Dynamic border component that adjusts to viewport width.
 *
 * Note: the module-level `theme` may be `undefined` — when loaded through jiti
 * (separate module cache) or from a second `src` module graph in npm-package
 * installs, where the host bundle assigns `theme` but this copy never sees it
 * (issue #5366). Both the default color and `render()` degrade to plain,
 * unstyled output instead of crashing the TUI.
 */
export declare class DynamicBorder implements Component {
    #private;
    constructor(color?: (str: string) => string);
    invalidate(): void;
    render(width: number): readonly string[];
}
