import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolApprovalDecision } from "@oh-my-pi/pi-agent-core";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "./index.js";
import { type OutputMeta } from "./output-meta.js";
export declare const BASH_DEFAULT_PREVIEW_LINES = 10;
/**
 * Shape a shell command line for an ACP-conformant `terminal/create` request.
 *
 * ACP's `command` field is documented as the executable and `args` as its
 * argv tail (see https://agentclientprotocol.com/protocol/v1/terminals), so a
 * spec-conformant client `spawn(command, args)`s them directly — no implicit
 * shell. A raw `bash` tool line ("git status && echo x | head") therefore has
 * to be wrapped in an explicit shell invocation, otherwise the client tries
 * to spawn the whole line as argv[0] and fails with `ENOENT` for anything
 * containing a space, pipe, `&&`, redirect, or `$(...)`.
 *
 * The wrap reuses the same shell binary + args the local `bash-executor` would
 * pick via `settings.getShellConfig()` — Git Bash / `bash.exe` on Windows
 * (`cmd.exe /c` as the last-resort fallback when no bash exists on the host),
 * `$SHELL` (bash/zsh) with the `sh` fallback on POSIX — so the ACP path
 * preserves `bash` tool semantics (`$VAR`, `$(...)`, `source`, POSIX quoting,
 * `-l`) wherever a POSIX shell is available. The agent host's shell path is
 * used as a proxy for the client's, matching the near-universal ACP
 * deployment shape of an editor spawning omp as a co-hosted subprocess.
 */
export declare function wrapShellLineForClientTerminal(line: string, shellConfig: {
    shell: string;
    args: string[];
    prefix?: string | undefined;
}): {
    command: string;
    args: string[];
};
/**
 * Bash patterns flagged as safety critical for approval policy.
 *
 * Kept intentionally tight — the cost of a false negative is data loss or a compromised host,
 * while false positives remain actionable through user policy control.
 * New patterns should target shapes that are virtually never legitimate in automation.
 */
export declare const CRITICAL_BASH_PATTERNS: readonly [RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp];
declare const bashSchemaBase: import("@oh-my-pi/omptype").FluentType<{
    command: string;
    cwd?: string | undefined;
    env?: Record<string, string> | undefined;
    pty?: boolean | undefined;
    timeout?: number | undefined;
}, {
    command: string;
    cwd?: string | undefined;
    env?: Record<string, string> | undefined;
    pty?: boolean | undefined;
    timeout?: number | undefined;
}>;
declare const bashSchemaWithAsync: import("@oh-my-pi/omptype").FluentType<{
    async?: boolean | undefined;
    command: string;
    cwd?: string | undefined;
    env?: Record<string, string> | undefined;
    pty?: boolean | undefined;
    timeout?: number | undefined;
}, {
    async?: boolean | undefined;
    command: string;
    cwd?: string | undefined;
    env?: Record<string, string> | undefined;
    pty?: boolean | undefined;
    timeout?: number | undefined;
}>;
type BashToolSchema = typeof bashSchemaBase | typeof bashSchemaWithAsync;
export interface BashToolInput {
    command: string;
    env?: Record<string, string>;
    timeout?: number;
    cwd?: string;
    async?: boolean;
    pty?: boolean;
}
export interface BashToolDetails {
    meta?: OutputMeta;
    timeoutSeconds?: number;
    requestedTimeoutSeconds?: number;
    timeoutDisabled?: boolean;
    wallTimeMs?: number;
    /** Exit code of a command that ran to completion but failed (non-zero). */
    exitCode?: number;
    /** True when the command was killed by its timeout deadline (not a failure). */
    timedOut?: boolean;
    terminalId?: string;
    async?: {
        state: "running" | "completed" | "failed";
        jobId: string;
        type: "bash";
    };
}
export interface BashToolOptions {
}
/**
 * Bash tool implementation.
 *
 * Executes bash commands with optional timeout and working directory.
 */
export declare class BashTool implements AgentTool<typeof bashSchemaBase | typeof bashSchemaWithAsync, BashToolDetails> {
    #private;
    private readonly session;
    readonly name = "bash";
    readonly approval: (args: unknown) => ToolApprovalDecision;
    readonly formatApprovalDetails: (args: unknown) => string[];
    readonly label = "Bash";
    readonly loadMode = "essential";
    get description(): string;
    readonly parameters: BashToolSchema;
    readonly concurrency: (args: Partial<BashToolInput>) => "shared" | "exclusive";
    readonly strict = true;
    constructor(session: ToolSession);
    execute(_toolCallId: string, { command: rawCommand, env: rawEnv, timeout: rawTimeout, cwd, async: asyncRequested, pty, }: BashToolInput, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<BashToolDetails>, ctx?: AgentToolContext): Promise<AgentToolResult<BashToolDetails>>;
}
export interface BashRenderArgs {
    command?: string;
    env?: Record<string, unknown>;
    timeout?: number;
    cwd?: string;
    __partialJson?: string;
    [key: string]: unknown;
}
export interface BashRenderContext {
    /** Raw output text */
    output?: string;
    /** Whether output came from artifact storage */
    isFullOutput?: boolean;
    /** Whether output is expanded */
    expanded?: boolean;
    /** Number of preview lines when collapsed */
    previewLines?: number;
    /** Timeout in seconds */
    timeout?: number;
}
export interface ShellRendererConfig<TArgs> {
    resolveTitle: (args: TArgs | undefined, options: RenderResultOptions) => string;
    resolveCommand?: (args: TArgs | undefined) => string | undefined;
    resolveCwd?: (args: TArgs | undefined) => string | undefined;
    resolveEnv?: (args: TArgs | undefined) => Record<string, unknown> | undefined;
    showHeader?: boolean;
}
export declare function getBashEnvForDisplay(args: BashRenderArgs): Record<string, unknown> | undefined;
/**
 * Returns the bash command formatted for the result body: the dim `$ cd … &&`
 * prefix joined with syntax-highlighted command lines. The prefix is applied
 * only to the first line so multi-line commands display cleanly — terminals
 * reset SGR state at line boundaries, which made the previous single-string
 * `theme.fg("dim", ...)` form render only the first line as dim.
 */
export declare function formatBashCommandLines(args: BashRenderArgs, uiTheme: Theme): string[];
export declare function createShellRenderer<TArgs>(config: ShellRendererConfig<TArgs>): {
    renderCall(args: TArgs, options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: BashToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions & {
        renderContext?: BashRenderContext;
    }, uiTheme: Theme, args?: TArgs): Component;
    mergeCallAndResult: boolean;
    inline: boolean;
};
export declare const bashToolRenderer: {
    renderCall(args: BashRenderArgs, options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: {
            type: string;
            text?: string;
        }[];
        details?: BashToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions & {
        renderContext?: BashRenderContext;
    }, uiTheme: Theme, args?: BashRenderArgs | undefined): Component;
    mergeCallAndResult: boolean;
    inline: boolean;
};
export {};
