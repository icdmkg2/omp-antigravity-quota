import type { Component, TUI } from "@oh-my-pi/pi-tui";
import { KeybindingsManager } from "../../config/keybindings.js";
import type { ExtensionAskDialogQuestion, ExtensionAskDialogResult, ExtensionCustomOptions, ExtensionUIContext, ExtensionUIDialogOptions, ExtensionUISelectItem, ExtensionWidgetContent, ExtensionWidgetOptions, TerminalInputHandler } from "../../extensibility/extensions/index.js";
import { type HookSelectorSlider } from "../../modes/components/hook-selector.js";
import { type Theme } from "../../modes/theme/theme.js";
import type { InteractiveModeContext, InteractiveSelectorDialogOptions } from "../../modes/types.js";
export declare class ExtensionUiController {
    #private;
    private ctx;
    constructor(ctx: InteractiveModeContext);
    /** Remove extension-owned composer styles from the process registries. */
    disposeComposerShapes(): void;
    /**
     * Initialize the hook system with TUI-based UI context.
     */
    initHooksAndCustomTools(): Promise<void>;
    /**
     * The `ExtensionUIContext` built in `initHooksAndCustomTools()` — the same
     * picker/dialog primitives passed as `context.ui` for every live tool
     * call. `/tree` `ask` re-answer (issue #5642) reuses this to drive a
     * standalone `AskTool.execute()` call outside a normal agent turn.
     * `undefined` before hooks have initialized.
     */
    getToolUIContext(): ExtensionUIContext | undefined;
    setHookWidget(key: string, content: ExtensionWidgetContent, options?: ExtensionWidgetOptions): void;
    initializeHookRunner(uiContext: ExtensionUIContext, _hasUI: boolean): void;
    /**
     * Emit session event to all extension tools.
     */
    emitCustomToolSessionEvent(reason: "start" | "switch" | "branch" | "tree" | "shutdown", previousSessionFile?: string): Promise<void>;
    /**
     * Show a tool error in the chat.
     */
    showToolError(toolName: string, error: string): void;
    /**
     * Set hook status text in the footer.
     */
    setHookStatus(key: string, text: string | undefined): void;
    showCollabAwareSelector(title: string, options: ExtensionUISelectItem[], dialogOptions?: InteractiveSelectorDialogOptions, extra?: {
        slider?: HookSelectorSlider;
    }): Promise<string | undefined>;
    showCollabAwareEditor(title: string, prefill?: string, dialogOptions?: ExtensionUIDialogOptions, editorOptions?: {
        promptStyle?: boolean;
    }): Promise<string | undefined>;
    showAskDialog(questions: ExtensionAskDialogQuestion[], dialogOptions?: ExtensionUIDialogOptions): Promise<ExtensionAskDialogResult | undefined>;
    /**
     * Show a selector for hooks.
     */
    showHookSelector(title: string, options: ExtensionUISelectItem[], dialogOptions?: InteractiveSelectorDialogOptions, extra?: {
        slider?: HookSelectorSlider;
    }): Promise<string | undefined>;
    /**
     * Hide the hook selector.
     */
    hideHookSelector(): void;
    /**
     * Show a confirmation dialog for hooks.
     */
    showHookConfirm(title: string, message: string, dialogOptions?: ExtensionUIDialogOptions): Promise<boolean>;
    /**
     * Show a text input for hooks.
     */
    showHookInput(title: string, placeholder?: string, dialogOptions?: ExtensionUIDialogOptions): Promise<string | undefined>;
    /**
     * Hide the hook input.
     */
    hideHookInput(): void;
    /**
     * Show a multi-line editor for hooks (with Ctrl+G support).
     */
    showHookEditor(title: string, prefill?: string, dialogOptions?: ExtensionUIDialogOptions, editorOptions?: {
        promptStyle?: boolean;
    }): Promise<string | undefined>;
    /**
     * Hide the hook editor.
     */
    hideHookEditor(): void;
    /**
     * Show a notification for hooks.
     */
    showHookNotify(message: string, type?: "info" | "warning" | "error"): void;
    /**
     * Show a custom component with keyboard focus.
     */
    showHookCustom<T>(factory: (tui: TUI, theme: Theme, keybindings: KeybindingsManager, done: (result: T) => void) => (Component & {
        dispose?(): void;
    }) | Promise<Component & {
        dispose?(): void;
    }>, options?: ExtensionCustomOptions): Promise<T>;
    /**
     * Show an extension error in the UI.
     */
    addExtensionTerminalInputListener(handler: TerminalInputHandler): () => void;
    clearHookWidgets(): void;
    clearExtensionTerminalInputListeners(): void;
    showExtensionError(extensionPath: string, error: string): void;
}
