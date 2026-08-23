/**
 * Vibe mode tools — the director's entire non-read surface.
 *
 * Five thin tools over {@link VibeSessionRegistry}: spawn/send/wait/kill/list
 * persistent worker sessions ("fast"/"good" CLIs). Spawns and sends return
 * immediately; turn results self-deliver through the async job manager.
 *
 * The TUI renderers lean into the "you are driving little CLIs" fiction:
 * spawn/send draw a mini composer (a message typed into a tiny Claude-Code-like
 * terminal), and wait/list draw the "TV wall" — one live screen per worker,
 * stacked, each showing its tool calls and streamed text as it works.
 */
import type { AgentTool, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import { type VibeCli, type VibeKillOutcome, type VibeScreenSnapshot, type VibeSendOutcome } from "../vibe/runtime.js";
import type { Tool, ToolSession } from "./index.js";
export declare const VIBE_TOOL_NAMES: readonly ["vibe_spawn", "vibe_send", "vibe_wait", "vibe_kill", "vibe_list"];
declare const vibeSpawnSchema: import("@oh-my-pi/omptype").FluentType<{
    cli: "fast" | "good";
    name?: string | undefined;
    prompt: string;
}, {
    cli: "fast" | "good";
    name?: string | undefined;
    prompt: string;
}>;
declare const vibeSendSchema: import("@oh-my-pi/omptype").FluentType<{
    message: string;
    session: string;
}, {
    message: string;
    session: string;
}>;
declare const vibeWaitSchema: import("@oh-my-pi/omptype").FluentType<{
    sessions?: string[] | undefined;
    timeout?: number | undefined;
}, {
    sessions?: string[] | undefined;
    timeout?: number | undefined;
}>;
declare const vibeKillSchema: import("@oh-my-pi/omptype").FluentType<{
    session: string;
}, {
    session: string;
}>;
declare const vibeListSchema: import("@oh-my-pi/omptype").FluentType<{}, {}>;
type VibeOp = "spawn" | "send" | "wait" | "kill" | "list";
/** Details payload shared by every vibe tool for TUI rendering. */
export interface VibeToolDetails {
    op: VibeOp;
    /** Live TV-wall snapshot of the owner's worker sessions at (or during) the call. */
    screens: VibeScreenSnapshot[];
    spawned?: {
        id: string;
        cli: VibeCli;
        jobId: string;
    };
    send?: VibeSendOutcome;
    wait?: {
        settled: Array<{
            id: string;
            jobId: string;
            status: "completed" | "failed" | "cancelled";
        }>;
        stillRunning: string[];
        timedOut: boolean;
        /** True on interim progress emissions while the wait is still blocking. */
        waiting?: boolean;
    };
    killed?: VibeKillOutcome;
}
export declare class VibeSpawnTool implements AgentTool<typeof vibeSpawnSchema, VibeToolDetails> {
    private readonly session;
    readonly name = "vibe_spawn";
    readonly approval: "exec";
    readonly label = "Vibe Spawn";
    readonly summary = "Start a persistent fast/good worker session";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        cli: "fast" | "good";
        name?: string | undefined;
        prompt: string;
    }, {
        cli: "fast" | "good";
        name?: string | undefined;
        prompt: string;
    }>;
    readonly strict = true;
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: typeof vibeSpawnSchema.infer): Promise<AgentToolResult<VibeToolDetails>>;
}
export declare class VibeSendTool implements AgentTool<typeof vibeSendSchema, VibeToolDetails> {
    private readonly session;
    readonly name = "vibe_send";
    readonly approval: "exec";
    readonly label = "Vibe Send";
    readonly summary = "Message a worker session (steer or next turn)";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        message: string;
        session: string;
    }, {
        message: string;
        session: string;
    }>;
    readonly strict = true;
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: typeof vibeSendSchema.infer): Promise<AgentToolResult<VibeToolDetails>>;
}
export declare class VibeWaitTool implements AgentTool<typeof vibeWaitSchema, VibeToolDetails> {
    private readonly session;
    readonly name = "vibe_wait";
    readonly approval: "read";
    readonly label = "Vibe Wait";
    readonly summary = "Block until a worker session finishes its turn";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        sessions?: string[] | undefined;
        timeout?: number | undefined;
    }, {
        sessions?: string[] | undefined;
        timeout?: number | undefined;
    }>;
    readonly strict = true;
    readonly interruptible = true;
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: typeof vibeWaitSchema.infer, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<VibeToolDetails>): Promise<AgentToolResult<VibeToolDetails>>;
}
export declare class VibeKillTool implements AgentTool<typeof vibeKillSchema, VibeToolDetails> {
    private readonly session;
    readonly name = "vibe_kill";
    readonly approval: "read";
    readonly label = "Vibe Kill";
    readonly summary = "Terminate a worker session";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        session: string;
    }, {
        session: string;
    }>;
    readonly strict = true;
    constructor(session: ToolSession);
    execute(_toolCallId: string, params: typeof vibeKillSchema.infer): Promise<AgentToolResult<VibeToolDetails>>;
}
export declare class VibeListTool implements AgentTool<typeof vibeListSchema, VibeToolDetails> {
    private readonly session;
    readonly name = "vibe_list";
    readonly approval: "read";
    readonly label = "Vibe List";
    readonly summary = "List worker sessions and their states";
    readonly description: string;
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{}, {}>;
    readonly strict = true;
    constructor(session: ToolSession);
    execute(): Promise<AgentToolResult<VibeToolDetails>>;
}
/** Creates the ephemeral tools installed while `/vibe` mode is active. */
export declare function createVibeTools(session: ToolSession): Tool[];
interface VibeRenderArgs {
    cli?: VibeCli;
    prompt?: string;
    name?: string;
    session?: string;
    message?: string;
    sessions?: string[];
}
/** Build the shared vibe renderer for one tool name. */
export declare function createVibeToolRenderer(op: VibeOp): {
    inline: boolean;
    mergeCallAndResult: boolean;
    animatedPendingPreview: boolean;
    animatedPartialResult: boolean;
    renderCall(args: VibeRenderArgs, options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: VibeToolDetails;
        isError?: boolean;
    }, options: RenderResultOptions, uiTheme: Theme, args?: VibeRenderArgs): Component;
};
export {};
