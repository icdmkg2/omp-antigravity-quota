import { type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import type { AuthStorage } from "../../session/auth-storage.js";
import { OverlayPanel } from "./overlay-box.js";
/**
 * Component that renders an OAuth provider selector.
 */
export declare class OAuthSelectorComponent extends OverlayPanel {
    #private;
    constructor(mode: "login" | "logout", authStorage: AuthStorage, onSelect: (providerId: string) => void, onCancel: () => void, options?: {
        validateAuth?: (providerId: string) => Promise<boolean>;
        requestRender?: () => void;
    });
    stopValidation(): void;
    /**
     * Fit the selector into `lines` rendered rows by shrinking the visible list
     * window (the window is centered on the selection, so the selected row is
     * always visible at any height). Prefers keeping the full chrome — borders,
     * spacers, title, search status — but sacrifices the trailing spacer/border
     * (clipped by the host) before dropping below three visible rows.
     */
    setMaxHeight(lines: number): void;
    handleInput(keyData: string): void;
    /** Move the selection one step for a wheel notch (clamped, no wrap). */
    handleWheel(delta: -1 | 1): void;
    /**
     * Route an SGR mouse report at component-local coordinates. Provider rows
     * start LIST_ROW_OFFSET lines into the render; the ScrollView window shows
     * #visibleCount rows from #scrollStart. Wheel moves the selection, motion
     * drives the hover band, and a left click selects and confirms like Enter.
     */
    routeMouse(event: SgrMouseEvent, line: number, _col: number): void;
}
