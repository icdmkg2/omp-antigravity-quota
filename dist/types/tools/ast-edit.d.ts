import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "./index.js";
import type { OutputMeta } from "./output-meta.js";
declare const astEditSchema: import("@oh-my-pi/omptype").FluentType<{
    ops: {
        out: string;
        pat: string;
    }[];
    paths: string[];
}, {
    ops: {
        out: string;
        pat: string;
    }[];
    paths: string[];
}>;
export interface AstEditToolDetails {
    totalReplacements: number;
    filesTouched: number;
    filesSearched: number;
    applied: boolean;
    limitReached: boolean;
    parseErrors?: string[];
    /** Total parse error count before {@link PARSE_ERRORS_LIMIT} capping. Omitted when no errors. */
    parseErrorsTotal?: number;
    scopePath?: string;
    files?: string[];
    fileReplacements?: Array<{
        path: string;
        count: number;
    }>;
    meta?: OutputMeta;
    /** Pre-formatted text for the user-visible TUI render. Mirrors `result.text` lines but uses
     * a `│` gutter (no model-only hashline anchors). The TUI uses this directly so it never parses model-facing text. */
    displayContent?: string;
    /** Absolute base directory used during the edit. Used by the renderer to resolve
     * display-relative paths to absolute paths for OSC 8 hyperlinks. */
    searchPath?: string;
    /** Session cwd at edit time. Display header paths are cwd-relative, so the
     * renderer resolves them against this; `searchPath` is the scope target. */
    cwd?: string;
}
type AstEditSchemaInfer = typeof astEditSchema.infer;
export declare class AstEditTool implements AgentTool<typeof astEditSchema, AstEditToolDetails> {
    private readonly session;
    readonly name = "ast_edit";
    readonly approval: (args: unknown) => "read" | "write";
    readonly formatApprovalDetails: (args: unknown) => string[];
    readonly label = "AST Edit";
    readonly summary = "Perform AST-aware code edits (structural refactoring)";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        ops: {
            out: string;
            pat: string;
        }[];
        paths: string[];
    }, {
        ops: {
            out: string;
            pat: string;
        }[];
        paths: string[];
    }>;
    readonly strict = true;
    readonly examples: readonly ToolExample<AstEditSchemaInfer>[];
    readonly deferrable = true;
    readonly loadMode = "discoverable";
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: AstEditSchemaInfer, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<AstEditToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<AstEditToolDetails>>;
}
interface AstEditRenderArgs {
    ops?: Array<{
        pat?: string;
        out?: string;
    }>;
    paths?: string[];
}
export declare const astEditToolRenderer: {
    inline: boolean;
    renderCall(args: AstEditRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: AstEditToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: AstEditRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
