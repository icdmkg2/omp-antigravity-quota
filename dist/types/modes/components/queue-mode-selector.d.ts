import { SelectList, type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
/**
 * Component that renders a queue mode selector with borders
 */
export declare class QueueModeSelectorComponent extends OverlayPanel {
    #private;
    constructor(currentMode: "all" | "one-at-a-time", onSelect: (mode: "all" | "one-at-a-time") => void, onCancel: () => void);
    getSelectList(): SelectList;
    routeMouse(event: SgrMouseEvent, line: number, col: number): void;
}
