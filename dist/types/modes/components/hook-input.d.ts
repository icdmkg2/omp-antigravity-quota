/**
 * Simple text input component for hooks.
 */
import { type TUI } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
export interface HookInputOptions {
    tui?: TUI;
    timeout?: number;
    onTimeout?: () => void;
}
export declare class HookInputComponent extends OverlayPanel {
    #private;
    constructor(title: string, _placeholder: string | undefined, onSubmit: (value: string) => void, onCancel: () => void, opts?: HookInputOptions);
    handleInput(keyData: string): void;
    /** Route non-bracketed paste transports (e.g. kitty's OSC 5522 enhanced clipboard)
     *  into the inner input, mirroring bracketed-paste semantics. Pasting counts as
     *  interaction, so the timeout countdown resets like any keystroke. */
    pasteText(text: string): void;
    dispose(): void;
}
