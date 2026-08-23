import { InMemorySnapshotStore } from "@oh-my-pi/hashline";
/**
 * Upper bound on the file size we snapshot. A section tag is a content hash of
 * the *whole* file, so minting one means holding the full normalized text in
 * the store. Files above this cap emit no `[path#tag]` header — line-anchored
 * editing of multi-megabyte files is out of scope under the full-content model.
 */
export declare const SNAPSHOT_MAX_BYTES: number;
interface FileSnapshotStoreOwner {
    fileSnapshotStore?: InMemorySnapshotStore;
}
/**
 * Look up (or lazily create) the file snapshot store attached to a session.
 * Storage lives on `session.fileSnapshotStore` so it ages out exactly with
 * the session itself.
 */
export declare function getFileSnapshotStore(session: FileSnapshotStoreOwner): InMemorySnapshotStore;
/**
 * Canonicalize an absolute path into the stable key the snapshot store uses.
 *
 * Different code paths reach the snapshot store via different path forms:
 * `read local://foo.md` records under the file's `fs.realpath` (the local
 * protocol handler resolves symlinks); a subsequent `edit` may address the
 * same artifact via `local://foo.md`, whose resolver does NOT realpath, or
 * via the absolute path returned in the `[path#tag]` header. macOS adds the
 * same hazard at the working-tree level (`/tmp/...` vs `/private/tmp/...`).
 * Collapsing every key through `realpath` makes those forms fuse onto one
 * snapshot entry, so a freshly-minted tag is never rejected as stale just
 * because the lookup spelled the same file differently.
 *
 * Non-existent paths (new-file writes) fall back to a realpath of the parent
 * directory + basename, then to the input. This keeps creates and updates on
 * the same canonical key.
 */
export declare function canonicalSnapshotKey(absolutePath: string): string;
/**
 * Read the full text of `absolutePath` (within {@link SNAPSHOT_MAX_BYTES}),
 * record it as a version snapshot, and return its content-hash tag. Returns
 * `undefined` when the file exceeds the cap or cannot be read — callers then
 * omit the section header so the model never sees a tag it can't anchor against.
 *
 * Producers that only displayed a slice of the file (range reads, search hits)
 * use this to mint a whole-file tag: the displayed lines stay partial, but the
 * tag fingerprints the entire file so a follow-up edit anchored at any line
 * validates whenever the live file is byte-identical to what was read. Raw
 * reads pass `seenLines` even though they do not emit a header, letting a prior
 * or later same-content hashline tag inherit the raw range's provenance.
 */
export declare function recordFileSnapshot(session: FileSnapshotStoreOwner, absolutePath: string, seenLines?: Iterable<number>): Promise<string | undefined>;
/**
 * The 1-indexed file lines a hashline-formatted body actually displayed.
 * Single `NN:` rows contribute that line; a collapsed summary `NN-MM:` row
 * (a `{ … }` brace pair) contributes only its boundary lines `NN` and `MM` —
 * the elided interior was never shown, so editing inside it must be rejected.
 */
export declare function parseSeenLinesFromHashlineBody(body: string): number[];
/** Merge explicit 1-indexed displayed lines into a recorded hashline snapshot. */
export declare function recordSeenLines(session: FileSnapshotStoreOwner, absolutePath: string, tag: string, lines: readonly number[]): void;
/**
 * Attach the lines a read displayed to the snapshot it minted, so the patcher's
 * (opt-in) seen-line guard can reject edits anchored on lines the model never
 * saw. Best-effort: a no-op when the body has no numbered rows or the snapshot
 * already aged out. `tag` must be the tag returned when this exact content was
 * recorded. Every displayed `NN:` row counts as seen, including column-clipped
 * rows — the guard no longer distinguishes full-width from truncated display.
 */
export declare function recordSeenLinesFromBody(session: FileSnapshotStoreOwner, absolutePath: string, tag: string, body: string): void;
export {};
