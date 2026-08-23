/**
 * Multi-file orchestrator for the Codex `apply_patch` envelope.
 *
 * Decoupled from tool-registration: takes raw patch text + options, parses
 * it, and applies each hunk via the existing single-file `applyPatch` in
 * `../modes/patch.ts`. A future OpenAI freeform/grammar tool variant can
 * call this directly with the raw grammar output.
 *
 * Per spec §6.1, hunks are applied in order and NOT atomically — if hunk
 * N fails, hunks `0..N-1` are already on disk. We surface that by
 * returning the per-file results alongside the error when it happens.
 */
import { type ApplyPatchOptions, type ApplyPatchResult } from "../modes/patch.js";
export * from "./parser.js";
export interface ApplyCodexPatchResult {
    /** Single-file apply results in the order they were attempted. */
    results: ApplyPatchResult[];
    /** Affected file paths grouped by operation, for the §9.1 summary. */
    affected: {
        added: string[];
        modified: string[];
        deleted: string[];
    };
}
/**
 * Apply a full Codex `*** Begin Patch` envelope.
 *
 * Note: renames are reported under `modified` with the original path (spec
 * §9.1), not as a delete + add.
 */
export declare function applyCodexPatch(patchText: string, options: ApplyPatchOptions): Promise<ApplyCodexPatchResult>;
/**
 * Format the A/M/D summary described in spec §9.1.
 */
export declare function formatApplyCodexPatchSummary(affected: ApplyCodexPatchResult["affected"]): string;
