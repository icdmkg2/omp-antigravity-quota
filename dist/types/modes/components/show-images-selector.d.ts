import { SelectList, type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
/**
 * Component that renders a show images selector with borders
 */
export declare class ShowImagesSelectorComponent extends OverlayPanel {
    #private;
    constructor(currentValue: boolean, onSelect: (show: boolean) => void, onCancel: () => void);
    getSelectList(): SelectList;
    routeMouse(event: SgrMouseEvent, line: number, col: number): void;
}
