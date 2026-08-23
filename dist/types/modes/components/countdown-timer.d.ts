/**
 * Reusable countdown timer for dialog components.
 */
import type { TUI } from "@oh-my-pi/pi-tui";
export declare class CountdownTimer {
    #private;
    private tui;
    private onTick;
    private onExpire;
    constructor(timeoutMs: number, tui: TUI | undefined, onTick: (seconds: number) => void, onExpire: () => void);
    /** Reset the countdown to its initial value */
    reset(): void;
    dispose(): void;
}
