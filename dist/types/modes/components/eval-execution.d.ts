/**
 * Component for displaying user-initiated eval execution with streaming output.
 * Shares the same kernel session as the agent's eval tool.
 */
import { Container, type TUI } from "@oh-my-pi/pi-tui";
import type { TruncationMeta } from "../../tools/output-meta.js";
export type EvalExecutionLanguage = "python" | "js";
export declare class EvalExecutionComponent extends Container {
    #private;
    private readonly code;
    private readonly excludeFromContext;
    private readonly language;
    constructor(code: string, ui: TUI, excludeFromContext?: boolean, language?: EvalExecutionLanguage);
    /**
     * Transcript finalization contract (see `FinalizableBlock`): the collapsed
     * streaming preview rewrites its tail window every chunk, so the block must
     * stay out of native scrollback until the cell completes.
     */
    isTranscriptBlockFinalized(): boolean;
    getTranscriptBlockVersion(): number;
    setExpanded(expanded: boolean): void;
    invalidate(): void;
    appendOutput(chunk: string): void;
    setComplete(exitCode: number | undefined, cancelled: boolean, options?: {
        output?: string;
        truncation?: TruncationMeta;
    }): void;
    getOutput(): string;
    getCode(): string;
}
