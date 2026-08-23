/**
 * Generic selector component for hooks.
 * Displays a list of string options with keyboard navigation.
 */
import { type TUI } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
/** One segment of a {@link HookSelectorSlider} — a label and an optional
 *  detail line (e.g. the resolved model name) shown beneath the track while
 *  the segment is active. Segment colors come from the track's theme palette,
 *  assigned by position. */
export interface HookSelectorSliderSegment {
    label: string;
    /** Secondary line rendered under the track when this segment is selected. */
    detail?: string;
}
/**
 * A horizontal left/right selector rendered above the option list. Unlike the
 * up/down option cursor, the slider is moved with the left/right arrows from
 * any list position, letting the caller capture an orthogonal choice (e.g. the
 * model tier to continue execution with) alongside the selected option.
 */
export interface HookSelectorSlider {
    /** Dim caption rendered before the slider track (e.g. "continue with"). */
    caption?: string;
    segments: HookSelectorSliderSegment[];
    /** Initially highlighted segment index. */
    index: number;
    /** Invoked with the new index whenever the slider moves. */
    onChange?: (index: number) => void;
}
export interface HookSelectorOptions {
    tui?: TUI;
    timeout?: number;
    onTimeout?: () => void;
    onTimeoutStart?: () => void;
    onTimeoutReset?: () => void;
    initialIndex?: number;
    outline?: boolean;
    maxVisible?: number;
    onLeft?: () => void;
    onRight?: () => void;
    onExternalEditor?: () => void;
    helpText?: string;
    slider?: HookSelectorSlider;
    /** Indices into the original options that cannot be selected: they render
     *  dimmed, are skipped during navigation, and reject enter/timeout. */
    disabledIndices?: readonly number[];
    /** Render a leading radio/checkbox marker before each markable option,
     *  matching the ask transcript. "radio" fills the marker on the cursor row
     *  (single-choice); "checkbox" reflects {@link checkedIndices} per row
     *  (multi-select). Options at or beyond {@link markableCount} keep the plain
     *  cursor prefix — used for trailing control rows like "Other"/"Done". */
    selectionMarker?: "radio" | "checkbox";
    /** For `selectionMarker: "checkbox"`: original-indices currently checked. */
    checkedIndices?: readonly number[];
    /** Number of leading options (original order) that receive a selection
     *  marker. Defaults to every option when {@link selectionMarker} is set. */
    markableCount?: number;
}
export interface HookSelectorOption {
    label: string;
    description?: string;
}
export type HookSelectorOptionInput = string | HookSelectorOption;
export declare class HookSelectorComponent extends OverlayPanel {
    #private;
    constructor(title: string, options: HookSelectorOptionInput[], onSelect: (option: string) => void, onCancel: () => void, opts?: HookSelectorOptions);
    handleInput(keyData: string): void;
    render(width: number): readonly string[];
    dispose(): void;
}
