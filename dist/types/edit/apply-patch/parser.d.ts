/**
 * Parser for the Codex `apply_patch` envelope format.
 *
 *     *** Begin Patch
 *     *** Add File: <path>
 *     +<line>
 *     *** Delete File: <path>
 *     *** Update File: <path>
 *     *** Move to: <newpath>
 *     @@ <optional context>
 *     -old
 *     +new
 *      context
 *     *** End of File
 *     *** End Patch
 *
 * Input is the full envelope text (optionally heredoc-wrapped). Output is a
 * list of `PatchInput` records, each ready to hand to the existing
 * single-file `applyPatch()` in `../modes/patch.ts`.
 *
 * Per spec §4.3 Lenient mode: a `<<EOF` / `<<'EOF'` / `<<"EOF"` heredoc
 * wrapper around the whole envelope is stripped before parsing.
 */
import type { PatchInput } from "../modes/patch.js";
/**
 * Parse a Codex `*** Begin Patch` envelope into a list of single-file
 * patch inputs.
 */
export declare function parseApplyPatch(patchText: string): PatchInput[];
/**
 * Best-effort parser for in-progress TUI previews. It tolerates missing
 * envelope markers and incomplete trailing hunks; do not use it to apply edits.
 */
export declare function parseApplyPatchStreaming(patchText: string): PatchInput[];
