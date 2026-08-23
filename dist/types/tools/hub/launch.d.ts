/**
 * Hub launch half — supervision of project-scoped long-running processes
 * (dev servers, watchers, debuggers, REPLs) through the shared daemon broker.
 * Hub ops map 1:1 onto broker operations; the hub's `ps` op is the broker's
 * `list`, and `send`/`wait` route here when they carry a process `name`.
 */
import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../../extensibility/custom-tools/types.js";
import type { DaemonRpcResult, DaemonSnapshot, DaemonSpec, DaemonState } from "../../launch/protocol.js";
import type { Theme } from "../../modes/theme/theme.js";
import type { ToolSession } from "../index.js";
/** Broker-facing launch parameters; the hub adapts its `ps` op to `list` before calling in. */
export interface LaunchParams {
    op: "start" | "list" | "logs" | "wait" | "send" | "stop" | "restart" | "describe";
    name?: string;
    application?: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
    pty?: boolean;
    ready?: {
        log?: string;
        port?: number;
        host?: string;
        timeout?: number;
    };
    restart?: "no" | "on-failure" | "always";
    persist?: boolean;
    detached?: boolean;
    lines?: number;
    head?: boolean;
    grep?: string;
    follow?: boolean;
    cursor?: number;
    for?: "ready" | "exit";
    pattern?: string;
    text?: string;
    enter?: boolean;
    keys?: string[];
    signal?: "SIGINT" | "SIGTERM" | "SIGHUP" | "SIGQUIT" | "SIGKILL";
    timeout?: number;
}
/** Structured launch state retained for compact TUI rendering. */
export interface LaunchToolDetails {
    op: LaunchParams["op"];
    daemon?: DaemonSnapshot;
    daemons?: DaemonSnapshot[];
    cursor?: number;
    timedOut?: boolean;
    /** logs: daemon lifecycle state at read time. */
    state?: DaemonState;
    /** logs: virtual terminal rows for display; model-facing content remains sanitized text. */
    terminalRows?: string[];
    /** wait: output line that satisfied the pattern. */
    matched?: string;
    /** describe: immutable launch spec backing the command/cwd detail lines. */
    spec?: DaemonSpec;
}
/** Resolve display rows while keeping legacy raw replay outside the client process. */
export declare function renderLaunchLogTerminalRows(result: Extract<DaemonRpcResult, {
    op: "logs";
}>, params: Pick<LaunchParams, "head" | "lines">): Promise<string[] | undefined>;
/** Run one broker operation for the calling session's project. */
export declare function executeLaunch(session: ToolSession, params: LaunchParams, signal?: AbortSignal): Promise<AgentToolResult<LaunchToolDetails>>;
/** Args shape visible to the renderer, possibly mid-stream (every field optional). */
export type LaunchRenderArgs = Partial<Omit<LaunchParams, "op">> & {
    op?: string;
};
/** Pending-call frame for launch ops; consumes the spinner while the broker call is live. */
export declare function launchRenderCall(args: LaunchRenderArgs, options: RenderResultOptions, theme: Theme): Component;
/** Result frame: one status header per op, meta from structured details, capped body lines. */
export declare function launchRenderResult(result: {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: LaunchToolDetails;
    isError?: boolean;
}, options: RenderResultOptions, theme: Theme, args?: LaunchRenderArgs): Component;
