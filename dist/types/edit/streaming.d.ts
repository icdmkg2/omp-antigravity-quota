/**
 * Streaming edit preview strategies.
 *
 * Each edit mode owns a strategy that knows how to:
 * - collapse partial-JSON args to the subset safe to preview
 *   (`extractCompleteEdits`),
 * - compute unified diff previews for the in-flight args
 *   (`computeDiffPreview`), and
 * - render a text placeholder while no diff exists yet
 *   (`renderStreamingFallback`).
 *
 * The shared renderer / `ToolExecutionComponent` consult the strategy via
 * the injected `editMode` rather than probing argument shape.
 */
import { type Clipboard, type SnapshotStore } from "@oh-my-pi/hashline";
import type { Theme } from "../modes/theme/theme.js";
import { type EditMode, resolveEditMode } from "../utils/edit-mode.js";
export interface PerFileDiffPreview {
    path: string;
    diff?: string;
    firstChangedLine?: number;
    error?: string;
}
export interface StreamingDiffContext {
    cwd: string;
    signal: AbortSignal;
    snapshots: SnapshotStore;
    fuzzyThreshold?: number;
    allowFuzzy?: boolean;
    /**
     * True while the tool's arguments are still streaming in. Strategies that
     * accept free-form text input (apply_patch, hashline) trim the trailing
     * partial line so per-character growth of an in-flight `+added` line does
     * not flicker in the preview.
     */
    isStreaming?: boolean;
    /**
     * Session-persistent clipboard register (`CUT`/`PASTE`). Previews
     * fork it per frame — never mutating it — so a `PASTE` of content cut in
     * an earlier edit call (or an earlier section of this patch) renders the
     * real rows.
     */
    clipboard?: Clipboard;
}
/**
 * Per-file projection of a streamed edit payload. Pairs one target file path
 * with the digest of only the lines added to that file, so path-scoped stream
 * matchers (TTSR) evaluate each file in isolation — a `tool:edit(*.ts)` rule
 * never fires on text that actually belongs to a sibling `README.md` hunk.
 */
export interface EditMatcherEntry {
    readonly path: string;
    readonly digest: string;
}
export interface EditStreamingStrategy<Args = unknown> {
    /**
     * Return the args restricted to edits that are "complete enough" to
     * compute a diff against. Strategies drop the trailing incomplete entry
     * when `partialJson` indicates its closing `}` hasn't arrived yet.
     */
    extractCompleteEdits(args: Args, partialJson: string | undefined, isStreaming: boolean): Args;
    /**
     * Compute diff(s) for the given partial args. Returns `null` when args
     * do not yet carry enough structure to compute anything.
     */
    computeDiffPreview(args: Args, ctx: StreamingDiffContext): Promise<PerFileDiffPreview[] | null>;
    /**
     * Rendered inline while the diff hasn't been computed yet (or when the
     * compute returned `null` because args are still too partial).
     */
    renderStreamingFallback(args: Args, uiTheme: Theme): string;
    /**
     * Project the (potentially partial) args onto the plain text the edit
     * introduces into files — added lines without patch grammar — so stream
     * matchers (TTSR rules) can run source-level patterns against real content
     * instead of the mode-specific wire format. Returns `undefined` when the
     * args don't yet carry any content.
     */
    matcherDigest(args: Args): string | undefined;
    /**
     * Surface the target file paths a (potentially partial) call would touch,
     * so path-scoped stream matchers (e.g. TTSR `tool:edit(*.ts)` globs) match
     * even when the path is not a top-level argument but lives inside the wire
     * payload — `hashline` section headers, `apply_patch` envelope markers.
     * Returns `undefined` (or an empty list) when no paths are recoverable.
     */
    matcherPaths(args: Args): readonly string[] | undefined;
    /**
     * Per-file projection of the (potentially partial) args: one entry per
     * touched file pairing the path with the digest of only the lines added to
     * that file. Multi-file payloads (multi-section hashline / multi-hunk
     * apply_patch) MUST split here so callers can evaluate each file under its
     * own path scope instead of leaking added lines from one file into the
     * other's match context. Same-path sections / hunks are merged into one
     * entry. Returns `undefined` (or empty) when no per-file split is
     * recoverable yet — the caller falls back to {@link matcherDigest} +
     * {@link matcherPaths}.
     */
    matcherEntries(args: Args): readonly EditMatcherEntry[] | undefined;
}
/**
 * Given an edits array parsed from partial JSON, drop the last entry when the
 * corresponding object in `partialJson` has not yet closed with `}`.
 *
 * The streaming parser materializes a trailing edit object from the fields seen
 * so far before its closing `}` arrives, so an unfinished last entry can render
 * as a (partial) edit mid-stream. Dropping it until the object closes keeps the
 * preview from showing an incomplete edit.
 */
export declare function dropIncompleteLastEdit<T>(edits: readonly T[], partialJson: string | undefined, listKey: string): T[];
export declare const EDIT_MODE_STRATEGIES: Record<EditMode, EditStreamingStrategy<unknown>>;
export { resolveEditMode };
