import type { Range, TextEdit, WorkspaceEdit } from "./types.js";
/**
 * Apply text edits to a string in-memory.
 * Edits are applied in reverse order (bottom-to-top) to preserve line/character indices.
 */
export declare function applyTextEditsToString(content: string, edits: TextEdit[]): string;
/** True when two ranges overlap (share any position other than a touching boundary). */
export declare function rangesOverlap(a: Range, b: Range): boolean;
export declare function sortAndValidateTextEdits(edits: TextEdit[]): TextEdit[];
/**
 * Flatten a WorkspaceEdit's text edits into a Map<uri, TextEdit[]>.
 * Resource operations (create/rename/delete) are ignored — callers handle them separately.
 */
export declare function flattenWorkspaceTextEdits(edit: WorkspaceEdit): Map<string, TextEdit[]>;
/**
 * Apply text edits to a file.
 * Edits are applied in reverse order (bottom-to-top) to preserve line/character indices.
 */
export declare function applyTextEdits(filePath: string, edits: TextEdit[]): Promise<void>;
/** A reference file and the text edits a rename computed for it. */
export interface RenameReferenceEdit {
    filePath: string;
    edits: TextEdit[];
}
/**
 * Apply a rename's reference edits and then move `source` → `dest` as one unit.
 *
 * The reference edits (import/usage rewrites in other files) must be written
 * before the move so their positions match the pre-move file contents, but a
 * failed move must not leave those files half-rewritten: each edited file is
 * snapshotted first, and if `mkdir`/`rename` throws, every snapshot is restored
 * before the error propagates. A failed move therefore leaves the source,
 * destination, and every reference file exactly as they were.
 *
 * @throws the original `mkdir`/`rename` error, after rolling back the edits.
 */
export declare function applyEditsThenRename(references: RenameReferenceEdit[], source: string, dest: string): Promise<void>;
/** One filesystem mutation actually performed by {@link applyWorkspaceEdit}. */
export type ExecutedWorkspaceChange = {
    kind: "edit";
    uri: string;
} | {
    kind: "create";
    uri: string;
} | {
    kind: "rename";
    oldUri: string;
    newUri: string;
} | {
    kind: "delete";
    uri: string;
};
/** What {@link applyWorkspaceEdit} did: human-readable summaries plus the ops that really ran. */
export interface WorkspaceEditResult {
    applied: string[];
    /** Ops that mutated the filesystem — skipped `ignoreIfExists`/`ignoreIfNotExists` ops are excluded. */
    executed: ExecutedWorkspaceChange[];
}
/**
 * Apply a workspace edit (collection of file changes).
 * All text-edit batches are overlap-validated before anything is written so a
 * conflict throws without leaving the workspace half-applied.
 *
 * `onExecuted` fires after each filesystem mutation. When a later op throws,
 * the callback has already reported the executed prefix — callers that must
 * reconcile external state (e.g. LSP overlays) rely on this because the
 * returned {@link WorkspaceEditResult} is lost on failure.
 */
export declare function applyWorkspaceEdit(edit: WorkspaceEdit, cwd: string, onExecuted?: (change: ExecutedWorkspaceChange) => void): Promise<WorkspaceEditResult>;
