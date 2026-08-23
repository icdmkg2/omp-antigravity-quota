import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { WritethroughCallback, WritethroughDeferredHandle } from "../lsp/index.js";
import type { ToolSession } from "../tools/index.js";
import type { AppliedEditObserver } from "./blackbox.js";
import { type DiffError, type DiffResult } from "./diff.js";
import type { EditToolDetails, LspBatchRequest } from "./renderer.js";
/** Context handed to a {@link SloppyVariant} apply call. */
export interface SloppyApplyContext {
    /** Workspace-relative display path of the file being edited — for error messages. */
    readonly path: string;
    /** Sink for post-apply advisories (e.g. deletion callouts) shown with the success text. */
    readonly notes?: string[];
}
/**
 * The sloppy-format implementation contract: a pure text transformer — no
 * file I/O, no tool state.
 */
export interface SloppyVariant {
    /** Stable format identifier. */
    readonly id: string;
    /** Tool-description markdown teaching the model the payload grammar. */
    readonly description: string;
    /** Apply the payload to full file content and return the new full content. */
    apply(content: string, input: string, context: SloppyApplyContext): string;
}
export declare const sloppyEditSchema: import("@oh-my-pi/omptype").FluentType<{
    input: string;
}, {
    input: string;
}>;
export type SloppyParams = typeof sloppyEditSchema.infer;
/** One `[path]` section of a sloppy payload: a file plus its operations. */
export interface SloppySection {
    path: string;
    body: string;
}
/**
 * Split a sloppy payload into `[path]` sections, hashline-style. The first
 * line MUST be a header; a later whole-line `[path]` opens a new section only
 * when the next non-blank line starts an operation («), so content lines
 * that merely look like headers stay in their operation. Same-path sections
 * merge in order. Returns an empty list when the payload has no leading header.
 */
export declare function splitSloppySections(input: string): SloppySection[];
/**
 * Preview one payload section against the file on disk: apply in memory and
 * diff. Used by the streaming edit preview; never writes.
 */
export declare function computeSloppySectionDiff(section: SloppySection, cwd: string): Promise<DiffResult | DiffError>;
export declare const SLOPPY_MARKERS: {
    readonly open: "«";
    readonly put: "»";
    readonly selectOpen: "⟪";
    readonly selectClose: "⟫";
    readonly gap: "…";
    readonly selectDivider: "│";
    readonly add: "＋";
};
/** Apply a sloppy payload; errors re-voice into the taught `§` vocabulary. */
export declare function applySloppy(content: string, input: string, context: SloppyApplyContext): string;
/** The official sloppy implementation; docs re-skinned to the active marker alphabet. */
export declare const sloppyVariant: SloppyVariant;
/** Lark grammar for constrained decoding, in the active marker alphabet. */
export declare const sloppyGrammar: string;
export interface ExecuteSloppyOptions {
    session: ToolSession;
    /** Payload sections with display paths already workspace-resolved. */
    sections: SloppySection[];
    signal?: AbortSignal;
    batchRequest?: LspBatchRequest;
    writethrough: WritethroughCallback;
    beginDeferredDiagnosticsForPath: (path: string) => WritethroughDeferredHandle;
    /** Observes a committed content transition before result snapshots are pruned. */
    onApplied?: AppliedEditObserver;
}
/**
 * Execute a sloppy payload against its `[path]` sections. Hashline-style
 * all-or-nothing: every section is applied in memory first; a failure in any
 * section means no file is written. Mirrors `executeReplace`'s per-file
 * lifecycle (plan-mode guard, BOM/EOL preservation, LSP writethrough, diff
 * details); {@link sloppyVariant} owns payload parsing and matching.
 */
export declare function executeSloppy(options: ExecuteSloppyOptions): Promise<AgentToolResult<EditToolDetails, SloppyParams>>;
