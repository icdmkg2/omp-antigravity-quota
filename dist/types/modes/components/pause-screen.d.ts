import { type Component, type OverlayFocusOwner, type OverlayHandle, type OverlayOptions } from "@oh-my-pi/pi-tui";
/**
 * Slice of `InteractiveModeContext` the pause screen drives. Narrow so tests
 * can exercise the full engage → hold → release lifecycle without a real TUI.
 */
export interface PauseScreenHost {
    ui: {
        showOverlay(component: Component, options?: OverlayOptions): OverlayHandle;
        setFocus(component: Component): void;
        requestRender(): void;
        readonly terminal: {
            readonly rows: number;
        };
    };
    showStatus(message: string, options?: {
        dim?: boolean;
    }): void;
    readonly sessionName?: string;
}
/**
 * Paint the pause scene as exactly `height` rows, vertically centered.
 * Exported for tests.
 */
export declare function renderPauseScreen(width: number, height: number, elapsedMs: number, sessionName?: string): string[];
/** Fullscreen overlay component; resolves {@link run} when a resume key lands. */
export declare class PauseScreenComponent implements Component, OverlayFocusOwner {
    #private;
    readonly host: PauseScreenHost;
    constructor(host: PauseScreenHost);
    /** Start the clock; resolves once the user asks to resume. */
    run(): Promise<void>;
    dispose(): void;
    ownsOverlayFocusTarget(component: Component): boolean;
    handleInput(data: string): void;
    render(width: number): readonly string[];
}
/**
 * Engage the global pause gate and hold the fullscreen pause screen until the
 * user resumes. No-op when the gate is already engaged. Always releases the
 * gate on the way out (including teardown throws) — a leaked pause would
 * freeze every agent in the process with no UI left to release it.
 */
export declare function runPauseScreen(host: PauseScreenHost): Promise<void>;
