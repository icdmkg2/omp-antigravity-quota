/**
 * Fullscreen plan-review overlay. The overlay owns its entire content: the plan
 * is split into sections (preamble + one per heading), each rendered through its
 * own {@link Markdown} and windowed by a {@link ScrollView}, while the approval
 * options (plus the optional model-tier slider) sit beneath inside the same
 * outlined box — one self-contained surface in the spirit of the `/copy` picker.
 *
 * When the terminal is wide enough and the plan has ≥2 headings, a Contents
 * sidebar appears: it tracks the scrolled section with an accent "glow", and —
 * when focused — lets the operator jump between sections, delete a section
 * (with undo), and annotate sections with feedback that feeds the Refine loop.
 *
 * Focus regions (`toc`/`body`/`actions`) cycle with Tab/Shift+Tab; arrows move
 * within the focused region and step left into the sidebar. The default focus is
 * `actions`, so the muscle memory of the old single-target overlay carries over:
 * ↑/↓ select options, Enter confirms, ←/→ drives the slider when there is no
 * sidebar, g/G + PgUp/PgDn scroll, and the external-editor key opens the plan.
 */
import { type Component } from "@oh-my-pi/pi-tui";
import type { HookSelectorSlider } from "./hook-selector.js";
/** Serializable annotations retained by the plan-review owner between overlays. */
export interface PlanReviewAnnotationState {
    annotations: Array<{
        section: {
            index: number;
            title: string;
            /** Heading ancestry from the document root, when emitted by this overlay. */
            path?: string[];
            /** Hash of the section source, used to reject ambiguous moved headings. */
            contentHash?: string;
        };
        target: {
            kind: "section";
        } | {
            kind: "line";
            row: number;
            context: string;
            contextTruncated?: boolean;
        };
        note: string;
    }>;
}
export interface PlanReviewOverlayCallbacks {
    /** Invoked with the chosen option label (never a disabled one). */
    onPick: (label: string) => void;
    /** Invoked on Esc / cancel. */
    onCancel: () => void;
    /** Invoked with the current full plan text when the copy hotkey is pressed. */
    onCopyPlan?: (content: string) => void | Promise<void>;
    /** Invoked when the external-editor key is pressed (overlay stays open). */
    onExternalEditor?: () => void;
    /** Invoked when the external-editor key edits the active annotation draft. */
    onAnnotationExternalEditor?: (draft: string, commit: (text: string | null) => void) => void;
    /** Invoked with the new full plan text after an in-overlay delete/undo. */
    onPlanEdited?: (content: string) => void;
    /** Invoked with the Refine feedback markdown whenever annotations change. */
    onFeedbackChange?: (feedback: string) => void;
    /** Invoked with a serializable annotation snapshot whenever annotations change. */
    onAnnotationStateChange?: (state: PlanReviewAnnotationState) => void;
}
export interface PlanReviewOverlayOptions {
    /** Prompt rendered above the options (e.g. "Plan mode - next step"). */
    promptTitle?: string;
    options: string[];
    /** Indices into `options` that render dimmed and cannot be selected. */
    disabledIndices?: number[];
    /** Trailing footer hint (cancel hint); the overlay prepends dynamic help. */
    helpText?: string;
    /** Initially highlighted option index. */
    initialIndex?: number;
    /** Optional model-tier slider rendered between the plan body and options. */
    slider?: HookSelectorSlider;
    /** Display label for the external-editor key, surfaced in the footer help. */
    externalEditorLabel?: string;
    /** Serializable annotations restored into this overlay instance. */
    annotationState?: PlanReviewAnnotationState;
}
export declare class PlanReviewOverlay implements Component {
    #private;
    private readonly callbacks;
    constructor(planContent: string, options: PlanReviewOverlayOptions, callbacks: PlanReviewOverlayCallbacks);
    invalidate(): void;
    /** Swap the displayed plan (e.g. after an external-editor round-trip) and
     *  reset scroll/focus so the operator starts at the top. Does not emit
     *  `onPlanEdited` (the editor round-trip already persisted the file). */
    setPlanContent(planContent: string): void;
    handleInput(keyData: string): void;
    render(width: number): readonly string[];
}
