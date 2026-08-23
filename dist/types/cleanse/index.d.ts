import { type CleanseStatusBoard } from "./board.js";
import { type CleanseCheckerDescriptor } from "./checkers.js";
import type { CleanseCommandResult, CleanseTargetChoice } from "./types.js";
/** User-facing options for `omp cleanse`. */
export interface CleanseCommandOptions {
    maxAgents?: number;
    model?: string;
    includeTests?: boolean;
    /** Free-form description handed to a discovery agent instead of built-in checker discovery. */
    request?: string;
    /** Run every discovered checker without the interactive picker. */
    all?: boolean;
}
/** Rendering and prompting seam for one cleanse run; satisfied by the CLI streams and the TUI overlay. */
export interface CleanseRunUi {
    board: CleanseStatusBoard;
    /** Permanent user-facing summary line. */
    print(text: string): void;
    /** Permanent failure/cancellation line. */
    printError(text: string): void;
    /** Choose between discovered checkers; omit to run every checker without prompting. */
    pickTarget?(checkers: readonly CleanseCheckerDescriptor[]): Promise<CleanseTargetChoice>;
    /** Free-form request prompt when no runnable checker was discovered; `null` cancels. */
    promptRequest?(): Promise<string | null>;
}
/**
 * Detect project diagnostics, dispatch one bounded repair batch, and verify it.
 *
 * Cancellation flows exclusively through `signal`; the caller owns signal
 * sources (SIGINT for the CLI, Esc for the interactive overlay).
 */
export declare function runCleanse(options: CleanseCommandOptions, ui: CleanseRunUi, signal: AbortSignal): Promise<CleanseCommandResult>;
/** CLI adapter for {@link runCleanse}: stdout board, one-shot pickers, SIGINT/SIGTERM cancellation. */
export declare function runCleanseCommand(options?: CleanseCommandOptions): Promise<CleanseCommandResult>;
