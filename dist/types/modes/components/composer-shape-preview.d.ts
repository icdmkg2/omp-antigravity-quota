/**
 * Live preview for the `composer.shape` setting and the setup-wizard composer
 * scene. Chrome is rendered through the same {@link ComposerStyle} objects the
 * real editor uses, and status rows come from the live
 * {@link ComposerPreviewStatusSource} (the session's StatusLineComponent) —
 * nothing about the preview is a re-implementation. Prompt text is a preview
 * stand-in, and the `session_name` segment falls back to a stand-in title
 * (passed via `previewTitle`) when the session is unnamed.
 */
import { type Component } from "@oh-my-pi/pi-tui";
import type { ComposerShape } from "../../config/settings-schema.js";
/**
 * Real status renderer the preview borrows rows from — structurally satisfied
 * by {@link StatusLineComponent}. Layout is parameterized so a preview can
 * render a candidate shape's placement instead of the active one.
 */
export interface ComposerPreviewStatusSource {
    /** Powerline bar with the context gauge (box top border content). */
    getTopBorder(width: number, previewTitle?: string): {
        content: string;
        width: number;
    };
    /** Plain right-group chip (claude top rule content). */
    getStandaloneTopBorder(width: number, previewTitle?: string): {
        content: string;
        width: number;
    };
    /** Plain standalone bottom bar carrying the given segment groups. */
    renderBottomBar(width: number, groups: "left" | "full", previewTitle?: string): string;
}
export interface ComposerShapePreviewOptions {
    requestRender?: () => void;
    /** Live status renderer; omitted (tests), the chrome renders without status rows. */
    status?: ComposerPreviewStatusSource;
}
export declare function renderComposerShapePreview(shape: ComposerShape, width: number, status?: ComposerPreviewStatusSource): readonly string[];
export declare class ComposerShapePreview implements Component {
    #private;
    constructor(initialValue?: ComposerShape, options?: ComposerShapePreviewOptions);
    setValue(shape: ComposerShape): void;
    render(width: number): readonly string[];
}
