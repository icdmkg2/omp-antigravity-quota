import { type LiveBoardOutput } from "../cli/live-board.js";
import type { AgentProgress } from "../task/types.js";
import type { CleanseCheckerDescriptor } from "./checkers.js";
import type { CleanseAgentOutcome, CleanseAssignment, CleanseCheckResult } from "./types.js";
/** Rendering surface for one `omp cleanse` run. */
export interface CleanseStatusBoard {
    readonly interactive: boolean;
    /** Print a permanent line above the live area (plain write when non-TTY). */
    log(text: string): void;
    /** Show a transient spinner line; `undefined` clears it. Non-TTY prints the text once. */
    phase(text: string | undefined): void;
    checkerStarted(checker: CleanseCheckerDescriptor): void;
    checkerFinished(check: CleanseCheckResult, durationMs: number): void;
    /** End the repair phase and drop its live rows before verification. */
    repairFinished(): void;
    agentStarted(name: string, assignment: CleanseAssignment): void;
    agentProgress(name: string, progress: AgentProgress): void;
    agentFinished(outcome: CleanseAgentOutcome, assignment: CleanseAssignment): void;
    /** Clear the live area and restore the cursor. Idempotent. */
    close(): void;
}
/**
 * Live-view state for one cleanse run, shared by the CLI stdout board and the
 * interactive-mode overlay panel so both surfaces render identical rows.
 *
 * Mutators mirror {@link CleanseStatusBoard}; the finish mutators return the
 * permanent line the surface should log above the live area.
 */
export declare class CleanseBoardModel {
    #private;
    phase(text: string | undefined): void;
    checkerStarted(checker: CleanseCheckerDescriptor): void;
    /** Drop the checker's live row and build its permanent verdict line. */
    checkerFinished(check: CleanseCheckResult, durationMs: number): string;
    repairFinished(): void;
    agentStarted(name: string, assignment: CleanseAssignment): void;
    agentProgress(name: string, progress: AgentProgress): void;
    /** Drop the agent's live row, advance the repair bar, and build its permanent outcome line. */
    agentFinished(outcome: CleanseAgentOutcome, assignment: CleanseAssignment): string;
    /** Render the transient live rows for the current spinner frame. */
    renderLive(spinner: string): string[];
}
/** Create the cleanse status board bound to `output` (default `process.stdout`). */
export declare function createCleanseStatusBoard(output?: LiveBoardOutput, errors?: LiveBoardOutput): CleanseStatusBoard;
