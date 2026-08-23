import { type Clipboard, type PatchSection, type SnapshotStore } from "@oh-my-pi/hashline";
export interface HashlineDiffOptions {
    /**
     * Use the streaming-tolerant applier ({@link PatchSection.applyPartialTo})
     * so trailing in-flight ops do not throw or emit phantom edits. Streaming
     * preview path only.
     */
    streaming?: boolean;
    /**
     * Skip snapshot-tag validation. Streaming previews use this so transient
     * stale/missing tags do not flash re-read errors while the model is still
     * authoring input; the final apply path still validates through Patcher.
     */
    skipHashValidation?: boolean;
    /**
     * Clipboard register shared across the sections of one patch preview.
     * `CUT` in an earlier section feeds a register-backed `PUT` in a later one,
     * so the preview matches apply. Multi-section previews MUST thread one
     * register through sections in patch order; omitted, each section gets a
     * private register (same-file cut/put still previews correctly).
     */
    clipboard?: Clipboard;
}
export declare function computeHashlineSectionDiff(section: PatchSection, cwd: string, snapshots: SnapshotStore, options?: HashlineDiffOptions): Promise<{
    diff: string;
    firstChangedLine: number | undefined;
} | {
    error: string;
}>;
export declare function computeHashlineDiff(input: {
    input: string;
}, cwd: string, snapshots: SnapshotStore, options?: HashlineDiffOptions): Promise<{
    diff: string;
    firstChangedLine: number | undefined;
} | {
    error: string;
}>;
