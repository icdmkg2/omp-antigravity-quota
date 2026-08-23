import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "./index.js";
import type { OutputMeta } from "./output-meta.js";
declare const astGrepSchema: import("@oh-my-pi/omptype").FluentType<{
    pat: string;
    path?: string | undefined;
    skip?: number | undefined;
}, {
    pat: string;
    path?: string | undefined;
    skip?: number | undefined;
}>;
export interface AstGrepToolDetails {
    matchCount: number;
    fileCount: number;
    filesSearched: number;
    limitReached: boolean;
    parseErrors?: string[];
    /** Total parse error count before {@link PARSE_ERRORS_LIMIT} capping. Omitted when no errors. */
    parseErrorsTotal?: number;
    scopePath?: string;
    files?: string[];
    fileMatches?: Array<{
        path: string;
        count: number;
    }>;
    meta?: OutputMeta;
    /** Pre-formatted text for the user-visible TUI render. Mirrors `result.text` lines but uses
     * a `│` gutter and `*` to mark match lines. The TUI uses this directly so it never parses model-facing text. */
    displayContent?: string;
    /** Absolute base directory used during search. Used by the renderer to resolve
     * display-relative paths to absolute paths for OSC 8 hyperlinks. */
    searchPath?: string;
    /** Session cwd at search time. Display header/match paths are cwd-relative, so
     * the renderer resolves them against this; `searchPath` is the scope target. */
    cwd?: string;
}
export declare class AstGrepTool implements AgentTool<typeof astGrepSchema, AstGrepToolDetails> {
    private readonly session;
    readonly name = "ast_grep";
    readonly approval: "read";
    readonly label = "AST Grep";
    readonly summary = "Search code with AST patterns (structural grep)";
    get description(): string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        pat: string;
        path?: string | undefined;
        skip?: number | undefined;
    }, {
        pat: string;
        path?: string | undefined;
        skip?: number | undefined;
    }>;
    readonly strict = true;
    readonly examples: readonly ToolExample<typeof astGrepSchema.inferIn>[];
    readonly loadMode = "discoverable";
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: typeof astGrepSchema.infer, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<AstGrepToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<AstGrepToolDetails>>;
}
interface AstGrepRenderArgs {
    pat?: string;
    path?: string | string[];
    /** Legacy pre-`path` argument name; kept so historical transcripts still render a scope. */
    paths?: string[];
    skip?: number;
}
export declare const astGrepToolRenderer: {
    inline: boolean;
    renderCall(args: AstGrepRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: AstGrepToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: AstGrepRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
