/**
 * Anchored overlay panel for `/cleanse`, mounted above the editor like the
 * `/omfg` panel. Implements {@link CleanseStatusBoard}, so the shared cleanse
 * core renders the exact live view `omp cleanse` shows on stdout: transient
 * checker/repair/agent rows from {@link CleanseBoardModel} animate in place while
 * permanent log lines accumulate above them.
 */
import { type TUI } from "@oh-my-pi/pi-tui";
import { type CleanseStatusBoard } from "../../cleanse/board.js";
import type { CleanseCheckerDescriptor } from "../../cleanse/checkers.js";
import type { CleanseAgentOutcome, CleanseAssignment, CleanseCheckResult, CleanseRunStatus } from "../../cleanse/types.js";
import type { AgentProgress } from "../../task/types.js";
import { OverlayPanel } from "./overlay-box.js";
interface CleansePanelComponentOptions {
    /** Free-form request shown in the header; omitted for checker-discovery runs. */
    request?: string;
    tui: TUI;
}
export declare class CleansePanelComponent extends OverlayPanel implements CleanseStatusBoard {
    #private;
    readonly interactive = true;
    constructor(options: CleansePanelComponentOptions);
    log(text: string): void;
    /** Permanent line styled as a failure (the core's stderr-equivalent). */
    logError(text: string): void;
    phase(text: string | undefined): void;
    checkerStarted(checker: CleanseCheckerDescriptor): void;
    checkerFinished(check: CleanseCheckResult, durationMs: number): void;
    repairFinished(): void;
    agentStarted(name: string, assignment: CleanseAssignment): void;
    agentProgress(name: string, progress: AgentProgress): void;
    agentFinished(outcome: CleanseAgentOutcome, assignment: CleanseAssignment): void;
    /** Stop the live area; the panel stays mounted until the user dismisses it. */
    close(): void;
    /** Record the settled run result and switch the footer to its dismiss hint. */
    finish(status: CleanseRunStatus): void;
    /** Record an unexpected failure and switch the footer to its dismiss hint. */
    markError(message: string): void;
    /** Release the repaint timer during teardown. */
    dispose(): void;
}
export {};
