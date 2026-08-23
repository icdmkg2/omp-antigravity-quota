import * as fs from "node:fs";
import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import * as natives from "@oh-my-pi/pi-natives";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import { type TruncationResult } from "../session/streaming-output.js";
import type { ToolSession } from "./index.js";
import { type OutputMeta } from "./output-meta.js";
declare const findSchema: import("@oh-my-pi/omptype").FluentType<{
    gitignore?: boolean | undefined;
    hidden?: boolean | undefined;
    limit?: number | undefined;
    path?: string | undefined;
}, {
    gitignore?: boolean | undefined;
    hidden?: boolean | undefined;
    limit?: number | undefined;
    path?: string | undefined;
}>;
export type GlobToolInput = typeof findSchema.infer;
export interface GlobToolDetails {
    truncation?: TruncationResult;
    resultLimitReached?: number;
    meta?: OutputMeta;
    scopePath?: string;
    fileCount?: number;
    files?: string[];
    truncated?: boolean;
    error?: string;
    /** Working directory at search time. Used by the renderer to resolve relative
     * file paths to absolute paths for OSC 8 hyperlinks. */
    cwd?: string;
    /** User-supplied paths whose base directory was missing on disk. The tool
     * skipped these and continued with the surviving entries; surfaced as a
     * non-fatal warning in the renderer and in the model-facing text. */
    missingPaths?: string[];
}
/**
 * Pluggable operations for the find tool.
 * Override these to delegate file search to remote systems (e.g., SSH).
 */
export interface GlobOperations {
    /** Check if path exists */
    exists: (absolutePath: string) => Promise<boolean> | boolean;
    /** Optional stat for distinguishing files vs directories. */
    stat?: (absolutePath: string) => Promise<{
        isFile(): boolean;
        isDirectory(): boolean;
    }> | {
        isFile(): boolean;
        isDirectory(): boolean;
    };
    /** Find files matching glob pattern. Returns relative paths. */
    glob: (pattern: string, cwd: string, options: {
        ignore: string[];
        limit: number;
    }) => Promise<string[]> | string[];
}
export interface GlobToolOptions {
    /** Custom operations for find. Default: local filesystem + rg */
    operations?: GlobOperations;
    /** Remap slash-only paths to the session cwd before root-search validation. */
    rootPathAlias?: boolean;
    /** Native glob binding. Override only in tests. */
    nativeGlob?: typeof natives.glob;
    /** Filesystem stat used before native scans. Override only in tests. */
    stat?: typeof fs.promises.stat;
    /** Native and user-facing scan timeout. Override only in tests. */
    timeoutMs?: number;
}
export declare class GlobTool implements AgentTool<typeof findSchema, GlobToolDetails> {
    #private;
    private readonly session;
    readonly name = "glob";
    readonly approval: "read";
    readonly loadMode = "essential";
    readonly label = "Glob";
    get description(): string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        gitignore?: boolean | undefined;
        hidden?: boolean | undefined;
        limit?: number | undefined;
        path?: string | undefined;
    }, {
        gitignore?: boolean | undefined;
        hidden?: boolean | undefined;
        limit?: number | undefined;
        path?: string | undefined;
    }>;
    readonly examples: readonly ToolExample<typeof findSchema.infer>[];
    readonly strict = true;
    constructor(session: ToolSession, options?: GlobToolOptions);
    execute(_toolCallId: string, params: typeof findSchema.infer, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<GlobToolDetails>, _context?: AgentToolContext): Promise<AgentToolResult<GlobToolDetails>>;
}
interface GlobRenderArgs {
    path?: string | string[];
    /** Legacy pre-`path` argument name; kept so historical transcripts still render a scope. */
    paths?: string | string[];
    limit?: number;
}
export declare const globToolRenderer: {
    inline: boolean;
    renderCall(args: GlobRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: GlobToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: GlobRenderArgs): Component;
    mergeCallAndResult: boolean;
};
export {};
