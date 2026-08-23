import { type Component } from "@oh-my-pi/pi-tui";
/**
 * Text whose content is (re)formatted against the actual render width.
 *
 * A plain `Text` receives an already-formatted string and only wraps it at
 * render time, so width-dependent layout (per-line truncation, inline previews)
 * has to be decided before the width is known. Renderers used to cope by
 * hard-capping output lines at a fixed column count (e.g. 80), which truncated
 * to roughly a third of a wide terminal. This defers formatting to
 * `render(width)`: it computes the same content width the inner `Text` uses
 * (mirroring its tight-layout flag so the budget can't desync), hands that to
 * the formatter, and delegates margins/background/vertical padding to the inner
 * `Text`. Lines the formatter caps at `contentWidth` fit exactly and so never
 * wrap.
 */
export declare class WidthAwareText implements Component {
    #private;
    constructor(format: (contentWidth: number) => string, paddingX?: number, paddingY?: number);
    setCustomBgFn(customBgFn?: (text: string) => string): void;
    setIgnoreTight(ignore: boolean): this;
    invalidate(): void;
    render(width: number): readonly string[];
}
