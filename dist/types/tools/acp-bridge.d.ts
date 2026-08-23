/**
 * Shared ACP client bridge routing for file-write sites.
 *
 * When an ACP client (e.g. Zed) advertises the `fs.writeTextFile` capability,
 * all write-mode tools must route through it so the editor's open buffer is
 * updated immediately. Internal artifacts ('/Users/theo/.omp/agent/sessions/-Projects-oh-my-pi/2026-06-10T09-11-41-506Z_019eb0cd-3ec2-7000-92aa-1b82aa4d78f0/local' plan files, other scheme
 * URLs) are always written directly to disk — those are OMP-owned and should
 * never be pushed into the editor.
 */
import type { ToolSession } from "./index.js";
/**
 * Return `true` when an ACP client bridge write is appropriate for this path.
 *
 * Returns `false` for internal-URL paths (e.g. `'/Users/theo/.omp/agent/sessions/-Projects-oh-my-pi/2026-06-10T09-11-41-506Z_019eb0cd-3ec2-7000-92aa-1b82aa4d78f0/local/PLAN.md'`) and for the
 * active plan file while plan mode is enabled — both are OMP-internal artifacts
 * that must stay off the editor's buffer.
 */
export declare function shouldRouteWriteThroughBridge(session: ToolSession, requestedPath: string, absolutePath: string): boolean;
/**
 * Result of a bridge-routed write: the content actually verified on disk
 * after the client processed the write, plus whether that content diverges
 * from what the tool asked to persist.
 *
 * ACP's `fs/write_text_file` has no "verbatim, no side effects" guarantee —
 * a client (e.g. Zed with `format_on_save: on`) may reformat the buffer as
 * part of handling the write before it settles on disk. Silently trusting
 * the requested `content` as "what's now on disk" lets that drift poison
 * every snapshot/tag/hash a caller derives from the write, which then reads
 * back as unrelated whole-file corruption on the *next* edit. Reading the
 * file back and reporting what's actually there keeps callers honest.
 */
export interface BridgeWriteResult {
    /** Content actually present on disk immediately after the bridge write. */
    text: string;
    /** `true` when `text` differs from the content the tool asked to write. */
    driftedFromRequest: boolean;
}
/**
 * Try to route a file write through the ACP client bridge.
 *
 * Performs the full guard check, bridge call (wrapped in {@link ToolError}),
 * a post-write read-back to detect client-side transformation (e.g.
 * format-on-save), FS-scan cache invalidation, and session mutation-version
 * bump.
 *
 * Returns `undefined` when the bridge is unavailable or the path should not
 * be routed through it — the caller must fall back to the writethrough path.
 * Returns a {@link BridgeWriteResult} when the bridge was used; callers MUST
 * use `result.text` (not the content they requested) for any snapshot, hash,
 * or tag derived from this write.
 */
export declare function routeWriteThroughBridge(session: ToolSession, requestedPath: string, absolutePath: string, content: string, signal?: AbortSignal): Promise<BridgeWriteResult | undefined>;
