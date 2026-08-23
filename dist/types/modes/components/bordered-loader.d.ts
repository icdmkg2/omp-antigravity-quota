import { Container, type TUI } from "@oh-my-pi/pi-tui";
import type { Theme } from "../../modes/theme/theme.js";
/** Loader wrapped with borders for hook UI */
export declare class BorderedLoader extends Container {
    #private;
    constructor(tui: TUI, theme: Theme, message: string);
    get signal(): AbortSignal;
    set onAbort(fn: (() => void) | undefined);
    handleInput(data: string): void;
    dispose(): void;
}
