import { type Component, type TUI } from "@oh-my-pi/pi-tui";
import type { ExtensionAskDialogQuestion, ExtensionAskDialogSubmitResult } from "../../extensibility/extensions/index.js";
/** Bound a prompt editor title to a fixed row/width budget so long or
 *  multi-line questions stay usable inside the small prompt overlay. */
export declare function boundPromptTitle(prefix: string, question: string): string;
interface AskDialogCallbacks {
    onSubmit(result: ExtensionAskDialogSubmitResult): void;
    onCancel(): void;
    onPrompt(title: string, prefill?: string): Promise<string | undefined>;
}
interface AskDialogInputGuard {
    isBlocked(): boolean;
    handleInput(keyData: string): void;
    hint: string;
    /** Mirror the guard's blocked state onto the proxied draft surface each
     *  render, so a draft that owns input shows a visible insertion cursor even
     *  though this dialog holds TUI focus. */
    syncPresentation?(): void;
}
interface AskDialogOptions {
    timeout?: number;
    onTimeout?: () => void;
    tui?: TUI;
    inputGuard?: AskDialogInputGuard;
}
export declare class AskDialogComponent implements Component {
    #private;
    private readonly callbacks;
    private readonly options;
    constructor(questions: ExtensionAskDialogQuestion[], callbacks: AskDialogCallbacks, options?: AskDialogOptions);
    invalidate(): void;
    dispose(): void;
    handleInput(keyData: string): void;
    render(width: number): readonly string[];
}
export {};
