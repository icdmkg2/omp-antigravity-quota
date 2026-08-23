import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolTier } from "@oh-my-pi/pi-agent-core";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import { type TruncationResult } from "../session/streaming-output.js";
import type { ToolSession } from "./index.js";
import type { OutputMeta } from "./output-meta.js";
declare const searchSchema: import("@oh-my-pi/omptype").FluentType<{
    case?: boolean | undefined;
    gitignore?: boolean | undefined;
    path?: string | undefined;
    pattern: string;
    skip?: number | null | undefined;
}, {
    case?: boolean | undefined;
    gitignore?: boolean | undefined;
    path?: string | undefined;
    pattern: string;
    skip?: number | null | undefined;
}>;
export type GrepToolInput = typeof searchSchema.infer;
/** Maximum number of distinct files surfaced in a single response. The
 * agent paginates further pages via `skip`. */
export declare const DEFAULT_FILE_LIMIT = 20;
/** Per-file match cap for multi-file searches — keeps a single hot file
 * from crowding out diverse hits. Applied in JS after grep returns. */
export declare const MULTI_FILE_PER_FILE_MATCHES = 20;
/** Per-file match cap for single-file searches — there's no diversity
 * concern when the scope is one file. */
export declare const SINGLE_FILE_MATCHES = 200;
export interface GrepToolDetails {
    truncation?: TruncationResult;
    fileLimitReached?: number;
    perFileLimitReached?: number;
    linesTruncated?: boolean;
    meta?: OutputMeta;
    scopePath?: string;
    matchCount?: number;
    fileCount?: number;
    files?: string[];
    fileMatches?: Array<{
        path: string;
        count: number;
    }>;
    truncated?: boolean;
    error?: string;
    /** Pre-formatted text for the user-visible TUI render. Mirrors the model-facing
     * `result.text` lines but uses a `│` gutter and `*` to mark match lines (vs space for
     * context). The TUI uses this directly so it never parses model-facing hashline anchors. */
    displayContent?: string;
    /** Absolute base directory used during search. Used by the renderer to resolve
     * display-relative paths to absolute paths for OSC 8 hyperlinks. */
    searchPath?: string;
    /** Session cwd at search time. The renderer resolves the display-relative
     * (cwd-relative) header/match paths against this for OSC 8 hyperlinks;
     * `searchPath` is the scope label target, not the display-path base. */
    cwd?: string;
    /** User-supplied paths whose base directory was missing on disk. The tool
     * skipped these and continued with the surviving entries; surfaced as a
     * non-fatal warning in the renderer and in the model-facing text. */
    missingPaths?: string[];
}
type SearchParams = typeof searchSchema.infer;
/**
 * Construction-time overrides for callers that are not the model.
 *
 * The model-facing schema deliberately does not grow these: they exist for
 * wire bridges (the Cursor `pi_grep` frame) whose protocol carries an explicit
 * context width and total match cap, and which would otherwise have to drop
 * them. Unset means "use the session settings / built-in caps" — the behavior
 * every model-issued call keeps.
 */
export interface GrepToolOptions {
    /** Overrides `grep.contextBefore`/`grep.contextAfter` for every call on this instance. */
    context?: number;
    /** Caps total surfaced matches. Applied on top of the built-in per-file and file-window caps, never above them. */
    totalMatchLimit?: number;
}
export declare class GrepTool implements AgentTool<typeof searchSchema, GrepToolDetails> {
    #private;
    private readonly session;
    readonly name = "grep";
    readonly approval: (args: unknown) => ToolTier;
    readonly label = "Grep";
    readonly loadMode = "discoverable";
    readonly summary = "Grep file contents using ripgrep (fast regex search)";
    get description(): string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        case?: boolean | undefined;
        gitignore?: boolean | undefined;
        path?: string | undefined;
        pattern: string;
        skip?: number | null | undefined;
    }, {
        case?: boolean | undefined;
        gitignore?: boolean | undefined;
        path?: string | undefined;
        pattern: string;
        skip?: number | null | undefined;
    }>;
    readonly strict = true;
    constructor(session: ToolSession, options?: GrepToolOptions);
    execute(_toolCallId: string, params: SearchParams, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<GrepToolDetails>, _toolContext?: AgentToolContext): Promise<AgentToolResult<GrepToolDetails>>;
}
interface GrepRenderArgs {
    pattern: string;
    path?: string | string[];
    /** Legacy pre-`path` argument name; kept so historical transcripts still render a scope. */
    paths?: string | string[];
    case?: boolean;
    gitignore?: boolean;
    skip?: number;
}
export declare const grepToolRenderer: {
    inline: boolean;
    renderCall(args: GrepRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: GrepToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: GrepRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
