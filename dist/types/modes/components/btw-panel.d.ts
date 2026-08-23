import { type TUI } from "@oh-my-pi/pi-tui";
import { OverlayPanel } from "./overlay-box.js";
interface BtwPanelComponentOptions {
    question: string;
    tui: TUI;
    canBranch?: () => boolean;
}
export declare class BtwPanelComponent extends OverlayPanel {
    #private;
    constructor(options: BtwPanelComponentOptions);
    appendText(delta: string): void;
    setAnswer(text: string): void;
    markComplete(): void;
    /** Shows that the completed answer is being promoted into the chat session. */
    markBranching(): void;
    markAborted(): void;
    markError(message: string): void;
    isBranchable(): boolean;
    isCopyable(): boolean;
    getCopyText(): string | undefined;
    close(): void;
}
export {};
