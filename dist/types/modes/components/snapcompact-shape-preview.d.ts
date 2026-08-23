/**
 * Live preview for the `snapcompact.shape` setting: renders a sample session
 * transcript through the real snapcompact rasterizer as a miniature page and
 * shows it zoomed, so cell size, ink hues, highlight bands, and dim tool-result
 * spans are legible at terminal scale.
 *
 * The mini-frame (a {@link SRC_FRAME_PX}px page) is upscaled with
 * nearest-neighbor so the glyph pixels stay crisp when the terminal scales the
 * placement box. Graphics display requires the Kitty unicode-placeholder path —
 * `renderImage` returning `lines` is the gate — because the bordered settings
 * frame re-fits every row, which direct cursor-positioned placements (iTerm2,
 * Sixel, Kitty `a=p`) do not survive. Everything else falls back to the stats
 * line plus a dim notice.
 */
import { type Component, type ImageBudget } from "@oh-my-pi/pi-tui";
import { type ShapeTarget } from "@oh-my-pi/snapcompact";
export interface SnapcompactShapePreviewOptions {
    /** Active model (api + id); resolves what `auto` maps to for this reader. */
    model?: ShapeTarget;
    /** Shared TUI image budget: stable graphics ids, transmit-once, exit cleanup. */
    imageBudget?: ImageBudget;
    /** Schedules a re-render once an async sample render completes. */
    requestRender?: () => void;
}
export declare class SnapcompactShapePreview implements Component {
    #private;
    constructor(currentValue: string, options?: SnapcompactShapePreviewOptions);
    /** Track the highlighted option; the next render reflects it. */
    setValue(value: string): void;
    render(width: number): readonly string[];
}
