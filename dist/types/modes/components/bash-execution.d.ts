/**
 * Component for displaying bash command execution with streaming output.
 */
import { Container, type TUI } from "@oh-my-pi/pi-tui";
import type { TruncationMeta } from "../../tools/output-meta.js";
export declare class BashExecutionComponent extends Container {
    #private;
    private readonly command;
    constructor(command: string, ui: TUI, excludeFromContext?: boolean);
    /**
     * Transcript finalization contract (see `FinalizableBlock`): the collapsed
     * streaming preview rewrites its tail window every chunk, so the block must
     * stay out of native scrollback until the command completes.
     */
    isTranscriptBlockFinalized(): boolean;
    getTranscriptBlockVersion(): number;
    /**
     * Set whether the output is expanded (shows full output) or collapsed (preview only).
     */
    setExpanded(expanded: boolean): void;
    invalidate(): void;
    appendOutput(chunk: string): void;
    setComplete(exitCode: number | undefined, cancelled: boolean, options?: {
        output?: string;
        truncation?: TruncationMeta;
    }): void;
    render(width: number): readonly string[];
    /**
     * Get the raw output for creating BashExecutionMessage.
     */
    getOutput(): string;
    /**
     * Get the command that was executed.
     */
    getCommand(): string;
}
