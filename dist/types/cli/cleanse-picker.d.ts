import type { CleanseCheckerDescriptor } from "../cleanse/checkers.js";
import type { CleanseTargetChoice } from "../cleanse/types.js";
/** Pick between running every discovered checker, one specific checker, or a free-form request. */
export declare function pickCleanseTarget(checkers: readonly CleanseCheckerDescriptor[]): Promise<CleanseTargetChoice>;
/** One-shot text prompt for a free-form cleanse request; `null` when cancelled or left empty. */
export declare function promptCleanseRequest(): Promise<string | null>;
