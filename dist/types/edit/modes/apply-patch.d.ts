/**
 * Edit mode wrapper for the Codex `apply_patch` envelope format.
 *
 * The mode accepts a single `input` string containing a full
 * `*** Begin Patch ... *** End Patch` block, parses it, and fans out to
 * the existing `executePatchSingle` — so all the machinery (plan mode,
 * LSP writethrough, fs-cache invalidation, diagnostics) is shared with
 * the `patch` mode.
 */
import type { PatchEditEntry } from "./patch.js";
export declare const applyPatchSchema: import("@oh-my-pi/omptype").FluentType<{
    input: string;
}, {
    input: string;
}>;
export type ApplyPatchParams = typeof applyPatchSchema.infer;
export type ApplyPatchEntry = PatchEditEntry & {
    path: string;
};
/**
 * Parse the envelope and lower each hunk to a `PatchEditEntry` so it can
 * be routed through `executePatchSingle`.
 */
export declare function expandApplyPatchToEntries(params: ApplyPatchParams): ApplyPatchEntry[];
export declare function expandApplyPatchToPreviewEntries(params: ApplyPatchParams): ApplyPatchEntry[];
