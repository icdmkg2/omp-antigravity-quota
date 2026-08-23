import { SelectList, type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
/**
 * Component that renders a theme selector.
 * Themes must be pre-loaded and passed to the constructor.
 */
export declare class ThemeSelectorComponent extends OverlayPanel {
    #private;
    constructor(currentTheme: string, themes: string[], onSelect: (themeName: string) => void, onCancel: () => void, onPreview: (themeName: string) => void);
    getSelectList(): SelectList;
    routeMouse(event: SgrMouseEvent, line: number, col: number): void;
}
