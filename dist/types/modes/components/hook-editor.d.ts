/**
 * Multi-line editor component for hooks and ask custom input.
 * Supports Ctrl+G for external editor.
 *
 * Two modes:
 * - Default (hook): Enter inserts newline, the `app.message.followUp` chord
 *   (Ctrl+Q / Ctrl+Enter) submits, bordered popup
 * - Prompt-style (ask): Enter submits, Shift+Enter inserts newline, legacy ask chrome
 */
import { type Focusable, type TUI } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
export interface HookEditorOptions {
    /** When true, use prompt-style keybindings with the legacy ask prompt chrome. */
    promptStyle?: boolean;
    /**
     * Max rows the inner Editor may occupy. When omitted, the editor is
     * bounded to the current terminal height minus the component's chrome
     * (≈10 rows) so long content scrolls instead of pushing the submit
     * hint out of view.
     */
    maxHeight?: number;
}
/** Interactive multiline dialog used by hooks and the ask tool's Other response. */
export declare class HookEditorComponent extends OverlayPanel implements Focusable {
    #private;
    /** Focus state mirrored to the nested editor during rendering. */
    focused: boolean;
    constructor(tui: TUI, title: string, prefill: string | undefined, onSubmit: (value: string) => void, onCancel: () => void, options?: HookEditorOptions);
    /** Keep the nested editor's software/hardware cursor mode aligned with the dialog focus target. */
    setUseTerminalCursor(useTerminalCursor: boolean): void;
    /** Render the dialog after forwarding its focus state to the nested editor. */
    render(width: number): readonly string[];
    handleInput(keyData: string): void;
    /** Route non-bracketed paste transports (e.g. kitty's OSC 5522 enhanced clipboard)
     *  into the inner editor, mirroring bracketed-paste semantics. Without this hook,
     *  enhanced-paste routing falls back to the main prompt editor hidden behind the
     *  dialog (#2127 routing contract). */
    pasteText(text: string): void;
}
