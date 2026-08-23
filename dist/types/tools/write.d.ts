import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolApprovalDecision } from "@oh-my-pi/pi-agent-core";
import { type Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type FileDiagnosticsResult } from "../lsp/index.js";
import { type Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "../sdk.js";
import { type OutputMeta } from "./output-meta.js";
import type { ToolActivityContext, ToolActivitySummary } from "./renderers.js";
import { type XdevDispatch } from "./xdev.js";
declare const writeSchema: import("@oh-my-pi/omptype").FluentType<{
    content: string;
    path: string;
}, {
    content: string;
    path: string;
}>;
export type WriteToolInput = typeof writeSchema.infer;
/** Details returned by the write tool for TUI rendering */
export interface WriteToolDetails {
    diagnostics?: FileDiagnosticsResult;
    meta?: OutputMeta;
    /** Set when the file was auto-chmod'd because content begins with a `#!` shebang. */
    madeExecutable?: boolean;
    /** Absolute filesystem path the write resolved to. Used by the renderer to wrap
     * the (possibly cwd-relative) header path in an OSC 8 `file://` hyperlink. */
    resolvedPath?: string;
    /** Set when the write dispatched an `xd://` tool device; drives renderer delegation. */
    xdev?: XdevDispatch;
}
type WriteParams = WriteToolInput;
/**
 * Write tool implementation.
 *
 * Creates or overwrites files with optional LSP formatting and diagnostics.
 */
export declare class WriteTool implements AgentTool<typeof writeSchema, WriteToolDetails> {
    #private;
    private readonly session;
    readonly name = "write";
    readonly approval: (args: unknown) => ToolApprovalDecision;
    readonly formatApprovalDetails: (args: unknown) => string[];
    readonly label = "Write";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        content: string;
        path: string;
    }, {
        content: string;
        path: string;
    }>;
    readonly strict = true;
    readonly concurrency = "exclusive";
    readonly loadMode = "essential";
    /** Stream matchers should see the real file content, not its JSON-escaped argument encoding. */
    matcherDigest(args: unknown): string | undefined;
    constructor(session: ToolSession);
    execute(_toolCallId: string, { path: rawPath, content }: WriteParams, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<WriteToolDetails>, context?: AgentToolContext): Promise<AgentToolResult<WriteToolDetails>>;
}
interface WriteRenderArgs {
    path?: unknown;
    file_path?: unknown;
    content?: unknown;
}
/** Render context for the write tool: resolves an `xd://`-mounted tool so its live renderer drives device dispatch previews. */
export interface WriteRenderContext {
    resolveXdevMounted?: (name: string) => AgentTool | undefined;
}
export declare const writeToolRenderer: {
    /** Compact one-line activity: device writes read as the mounted tool (`LSP · references foo`), file writes as `Write · <path>`. */
    activitySummary(args: unknown, context: ToolActivityContext): ToolActivitySummary;
    renderCall(args: WriteRenderArgs, options: RenderResultOptions & {
        renderContext?: WriteRenderContext;
    }, uiTheme: Theme): Component | undefined;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: WriteToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions & {
        renderContext?: WriteRenderContext;
    }, uiTheme: Theme, args?: WriteRenderArgs): Component;
    mergeCallAndResult: boolean;
    forceFirstResultViewportRepaint: (args: unknown, options: RenderResultOptions) => boolean;
};
export {};
