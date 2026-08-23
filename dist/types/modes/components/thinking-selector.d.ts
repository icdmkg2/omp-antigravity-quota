import type { Effort } from "@oh-my-pi/pi-ai";
import { SelectList, type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
/**
 * Component that renders a thinking level selector with borders
 */
export declare class ThinkingSelectorComponent extends OverlayPanel {
    #private;
    constructor(currentLevel: Effort, availableLevels: Effort[], onSelect: (level: Effort) => void, onCancel: () => void);
    getSelectList(): SelectList;
    routeMouse(event: SgrMouseEvent, line: number, col: number): void;
}
