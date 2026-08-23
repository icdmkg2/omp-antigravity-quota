import type { ToolSession } from "../tools/index.js";
import type { EditMode } from "../utils/edit-mode.js";
/** Full source transition committed by one edit operation. */
export interface AppliedEditSnapshot {
    /** Path used to select the tree-sitter language. */
    path: string;
    /** File content immediately before the operation. */
    prev: string;
    /** File content immediately after the operation. */
    next: string;
}
/** Observes a committed edit before its full-file snapshots are pruned. */
export type AppliedEditObserver = (snapshot: AppliedEditSnapshot) => Promise<void>;
/** True when tree-sitter parses `code` (selected by `filePath`) without errors. */
export declare function sourceParses(code: string, filePath: string): boolean;
/**
 * True when the edit turned a source file that parsed into one that no longer
 * parses. Never true for languages the summarizer cannot parse at all, since
 * the pre-image must have parsed.
 */
export declare function introducedParseFailure({ path: filePath, prev, next }: AppliedEditSnapshot): boolean;
/**
 * Create the enabled per-tool-call recorder that appends parse-regression
 * snapshots to the blackbox log. Callers gate invocations on
 * {@link introducedParseFailure}.
 */
export declare function createEditBlackboxRecorder(session: ToolSession, variant: EditMode, arg: unknown): AppliedEditObserver | undefined;
