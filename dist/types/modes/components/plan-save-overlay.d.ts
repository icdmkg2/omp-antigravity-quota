import { type Component, type Focusable } from "@oh-my-pi/pi-tui";
/** A confirmed destination chosen from {@link PlanSaveOverlay}. */
export interface PlanSaveOverlayResult {
    path: string;
}
/** Collects a destination path before saving a plan and starting a new session. */
export declare class PlanSaveOverlay implements Component, Focusable {
    #private;
    constructor(suggestedPath: string, done: (result: PlanSaveOverlayResult | undefined) => void);
    get focused(): boolean;
    set focused(value: boolean);
    /** Replaces the dimmed path accepted when the operator submits an empty input. */
    setSuggestedPath(path: string): void;
    handleInput(data: string): void;
    /** Routes enhanced clipboard pastes into the path input. */
    pasteText(text: string): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
