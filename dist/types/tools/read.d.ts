import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolTier } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "../sdk.js";
import { type TruncationResult } from "../session/streaming-output.js";
import { type OutputMeta } from "./output-meta.js";
export { readToolRenderer } from "./read-renderer.js";
declare const readSchema: import("@oh-my-pi/omptype").FluentType<{
    path: string;
}, {
    path: string;
}>;
export type ReadToolInput = typeof readSchema.infer;
export interface ReadToolDetails {
    kind?: "file" | "url";
    truncation?: TruncationResult;
    isDirectory?: boolean;
    resolvedPath?: string;
    suffixResolution?: {
        from: string;
        to: string;
    };
    url?: string;
    finalUrl?: string;
    contentType?: string;
    method?: string;
    notes?: string[];
    meta?: OutputMeta;
    /** Full on-disk byte size recorded before applying a file range. */
    fileSize?: number;
    /** Full source line count when the read reached EOF and the count is exact. */
    totalLines?: number;
    /** Raw text + start line for user-visible TUI rendering, set when content is text-like.
     * Mirrors the same lines the model receives but without hashline/line-number prefixes,
     * so the TUI can render the file content with its own gutter without re-parsing the formatted text. */
    displayContent?: {
        text: string;
        startLine: number;
        lineNumbers?: Array<number | null>;
    };
    summary?: {
        lines: number;
        elidedSpans: number;
        elidedLines: number;
    };
    /** Number of unresolved git conflicts surfaced by this read (TUI uses for inline `⚠ N` badge). */
    conflictCount?: number;
    /** Paths recovered from a delimited read argument; used only by the TUI to render one call as multiple read rows. */
    displayReadTargets?: string[];
}
type ReadParams = ReadToolInput;
/**
 * Read tool implementation.
 *
 * Reads files with support for images, converted documents (via markit), and text.
 * Directories return a formatted listing with modification times.
 */
export declare class ReadTool implements AgentTool<typeof readSchema, ReadToolDetails> {
    #private;
    private readonly session;
    readonly name = "read";
    readonly approval: (args: unknown) => ToolTier;
    readonly label = "Read";
    readonly loadMode = "essential";
    description: string;
    get parameters(): typeof readSchema;
    readonly strict = true;
    constructor(session: ToolSession);
    /**
     * Re-evaluate the effective inspect_image state; it can flip when the model
     * or the `/vision` override changes after this tool was constructed. Keeps
     * the behavior branch and the advertised description in lockstep. Called
     * per image read and by tool reconciliation before prompt rebuilds (which
     * passes the post-change availability as `availableOverride`).
     */
    syncInspectImageState(availableOverride?: boolean): boolean;
    execute(toolCallId: string, params: ReadParams, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<ReadToolDetails>, toolContext?: AgentToolContext): Promise<AgentToolResult<ReadToolDetails>>;
}
