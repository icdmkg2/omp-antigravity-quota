/**
 * Hub tool — the single agent-coordination surface: peer messaging over the
 * IrcBus, lifecycle control for async background jobs, and supervision of
 * project-scoped long-running processes (launch).
 *
 * Op families:
 * - messaging: `send` (with `to`), `inbox`, `list`, `wait` (with `from`);
 * - jobs: `wait` (bare or with `ids`), `cancel`, `jobs`;
 * - processes: `start`, `ps`, `logs`, `stop`, `restart`, `describe`, plus
 *   `send`/`wait` when they carry a process `name`.
 *
 * The unified `wait` blocks until the FIRST of: a matching peer message, a
 * watched job settling, the wait window elapsing, or a steering interrupt.
 * Job results always deliver themselves when they finish — `wait` exists for
 * when the agent has nothing else to do.
 */
import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback, ToolApprovalDecision } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../../extensibility/custom-tools/types.js";
import type { Theme } from "../../modes/theme/theme.js";
import type { ToolSession } from "../index.js";
import type { ToolActivitySummary } from "../renderers.js";
import { type HubDetails, type HubRenderArgs } from "./types.js";
export { isWaitingPollDetails } from "./jobs.js";
export type { LaunchParams, LaunchToolDetails } from "./launch.js";
export { createIrcMessageCard, isIrcEnabled } from "./messaging.js";
export * from "./types.js";
declare const hubSchema: import("@oh-my-pi/omptype").FluentType<{
    application?: string | undefined;
    args?: string[] | undefined;
    await?: boolean | undefined;
    cursor?: number | undefined;
    cwd?: string | undefined;
    detached?: boolean | undefined;
    enter?: boolean | undefined;
    env?: Record<string, string> | undefined;
    follow?: boolean | undefined;
    for?: "exit" | "ready" | undefined;
    from?: string | undefined;
    grep?: string | undefined;
    head?: boolean | undefined;
    ids?: string[] | undefined;
    keys?: string[] | undefined;
    lines?: number | undefined;
    message?: string | undefined;
    name?: string | undefined;
    op: "cancel" | "describe" | "inbox" | "jobs" | "list" | "logs" | "ps" | "restart" | "send" | "start" | "stop" | "wait";
    pattern?: string | undefined;
    peek?: boolean | undefined;
    persist?: boolean | undefined;
    pty?: boolean | undefined;
    ready?: {
        host?: string | undefined;
        log?: string | undefined;
        port?: number | undefined;
        timeout?: number | undefined;
    } | undefined;
    replyTo?: string | undefined;
    restart?: "always" | "no" | "on-failure" | undefined;
    signal?: "SIGHUP" | "SIGINT" | "SIGKILL" | "SIGQUIT" | "SIGTERM" | undefined;
    text?: string | undefined;
    timeout?: number | undefined;
    timeoutMs?: number | undefined;
    to?: string | undefined;
}, {
    application?: string | undefined;
    args?: string[] | undefined;
    await?: boolean | undefined;
    cursor?: number | undefined;
    cwd?: string | undefined;
    detached?: boolean | undefined;
    enter?: boolean | undefined;
    env?: Record<string, string> | undefined;
    follow?: boolean | undefined;
    for?: "exit" | "ready" | undefined;
    from?: string | undefined;
    grep?: string | undefined;
    head?: boolean | undefined;
    ids?: string[] | undefined;
    keys?: string[] | undefined;
    lines?: number | undefined;
    message?: string | undefined;
    name?: string | undefined;
    op: "cancel" | "describe" | "inbox" | "jobs" | "list" | "logs" | "ps" | "restart" | "send" | "start" | "stop" | "wait";
    pattern?: string | undefined;
    peek?: boolean | undefined;
    persist?: boolean | undefined;
    pty?: boolean | undefined;
    ready?: {
        host?: string | undefined;
        log?: string | undefined;
        port?: number | undefined;
        timeout?: number | undefined;
    } | undefined;
    replyTo?: string | undefined;
    restart?: "always" | "no" | "on-failure" | undefined;
    signal?: "SIGHUP" | "SIGINT" | "SIGKILL" | "SIGQUIT" | "SIGTERM" | undefined;
    text?: string | undefined;
    timeout?: number | undefined;
    timeoutMs?: number | undefined;
    to?: string | undefined;
}>;
type HubParams = typeof hubSchema.infer;
/** Mutating process ops require exec approval; messaging, jobs, and inspection are read-only. */
declare function hubApproval(params: unknown): ToolApprovalDecision;
export declare class HubTool implements AgentTool<typeof hubSchema, HubDetails> {
    #private;
    private readonly session;
    readonly name = "hub";
    readonly approval: typeof hubApproval;
    readonly label = "Hub";
    readonly summary = "Message peer agents, control background jobs, and supervise long-running processes";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        application?: string | undefined;
        args?: string[] | undefined;
        await?: boolean | undefined;
        cursor?: number | undefined;
        cwd?: string | undefined;
        detached?: boolean | undefined;
        enter?: boolean | undefined;
        env?: Record<string, string> | undefined;
        follow?: boolean | undefined;
        for?: "exit" | "ready" | undefined;
        from?: string | undefined;
        grep?: string | undefined;
        head?: boolean | undefined;
        ids?: string[] | undefined;
        keys?: string[] | undefined;
        lines?: number | undefined;
        message?: string | undefined;
        name?: string | undefined;
        op: "cancel" | "describe" | "inbox" | "jobs" | "list" | "logs" | "ps" | "restart" | "send" | "start" | "stop" | "wait";
        pattern?: string | undefined;
        peek?: boolean | undefined;
        persist?: boolean | undefined;
        pty?: boolean | undefined;
        ready?: {
            host?: string | undefined;
            log?: string | undefined;
            port?: number | undefined;
            timeout?: number | undefined;
        } | undefined;
        replyTo?: string | undefined;
        restart?: "always" | "no" | "on-failure" | undefined;
        signal?: "SIGHUP" | "SIGINT" | "SIGKILL" | "SIGQUIT" | "SIGTERM" | undefined;
        text?: string | undefined;
        timeout?: number | undefined;
        timeoutMs?: number | undefined;
        to?: string | undefined;
    }, {
        application?: string | undefined;
        args?: string[] | undefined;
        await?: boolean | undefined;
        cursor?: number | undefined;
        cwd?: string | undefined;
        detached?: boolean | undefined;
        enter?: boolean | undefined;
        env?: Record<string, string> | undefined;
        follow?: boolean | undefined;
        for?: "exit" | "ready" | undefined;
        from?: string | undefined;
        grep?: string | undefined;
        head?: boolean | undefined;
        ids?: string[] | undefined;
        keys?: string[] | undefined;
        lines?: number | undefined;
        message?: string | undefined;
        name?: string | undefined;
        op: "cancel" | "describe" | "inbox" | "jobs" | "list" | "logs" | "ps" | "restart" | "send" | "start" | "stop" | "wait";
        pattern?: string | undefined;
        peek?: boolean | undefined;
        persist?: boolean | undefined;
        pty?: boolean | undefined;
        ready?: {
            host?: string | undefined;
            log?: string | undefined;
            port?: number | undefined;
            timeout?: number | undefined;
        } | undefined;
        replyTo?: string | undefined;
        restart?: "always" | "no" | "on-failure" | undefined;
        signal?: "SIGHUP" | "SIGINT" | "SIGKILL" | "SIGQUIT" | "SIGTERM" | undefined;
        text?: string | undefined;
        timeout?: number | undefined;
        timeoutMs?: number | undefined;
        to?: string | undefined;
    }>;
    readonly strict = true;
    readonly interruptible: (params: Partial<HubParams>) => boolean;
    readonly loadMode = "essential";
    readonly examples: readonly ToolExample<typeof hubSchema.infer>[];
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: HubParams, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<HubDetails>, _context?: AgentToolContext): Promise<AgentToolResult<HubDetails>>;
}
export declare const hubToolRenderer: {
    inline: boolean;
    mergeCallAndResult: boolean;
    /** Compact one-line activity: op plus its peer, process, or job target. */
    activitySummary(args: unknown): ToolActivitySummary;
    animatedPendingPreview: (args: unknown) => boolean;
    renderCall(args: HubRenderArgs, options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: HubDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: HubRenderArgs): Component;
};
