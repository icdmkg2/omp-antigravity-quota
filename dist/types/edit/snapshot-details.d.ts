/**
 * Bound the size of the `oldText` / `newText` snapshots that edit-tool results
 * carry in `details`. These fields hold the full pre/post file content; for
 * large files they balloon the per-turn JSONL line and the session file
 * (300 KB+ each on the cases reported in #3786) without paying for any LLM
 * context (provider serializers send only `content`, never `details`).
 *
 * Only consumer of the raw snapshots is the ACP event mapper, which builds a
 * `diff` ToolCallContent for ACP clients (Zed). When the snapshots are pruned
 * the mapper returns `undefined` for that file and the text content still
 * flows — diff visualization degrades gracefully for over-threshold edits.
 */
import type { EditToolDetails, EditToolPerFileResult } from "./renderer.js";
/**
 * Combined `oldText` + `newText` character budget for a single edit-tool
 * result. Applies both per-entry (one file at a time) and as an aggregate
 * across `perFileResults` (so a many-small-files batch can't accumulate
 * unbounded snapshot bytes — see #3787 review).
 *
 * Picked so typical code-file edits keep ACP diff visualization while
 * pathological cases (large generated files, full-file rewrites, or
 * many-file batches) drop the raw snapshots before they hit the
 * session JSONL.
 */
export declare const MAX_EDIT_SNAPSHOT_TEXT_CHARS = 32768;
/**
 * Prune oversized `oldText` / `newText` from an edit-tool details payload,
 * recursing into `perFileResults` when present. Per-file overload comes first
 * so the more specific shape (required `path`) wins overload resolution at
 * the per-file call sites.
 */
export declare function pruneOversizedEditSnapshots(details: EditToolPerFileResult): EditToolPerFileResult;
export declare function pruneOversizedEditSnapshots(details: EditToolDetails): EditToolDetails;
