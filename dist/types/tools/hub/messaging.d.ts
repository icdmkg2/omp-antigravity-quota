/**
 * Hub messaging half — agent-to-agent messaging over the process-global IrcBus.
 *
 * `send` is fire-and-forget: the bus routes the message to the recipient
 * (waking idle agents with a real turn, reviving parked ones via the
 * lifecycle manager, injecting a non-interrupting aside into busy ones) and
 * returns delivery receipts immediately. Replies are real turns by the
 * recipient, observed with `wait` (or the `await: true` send sugar). `inbox`
 * drains pending messages; `list` shows every addressable peer.
 */
import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import { type Component } from "@oh-my-pi/pi-tui";
import type { Settings } from "../../config/settings.js";
import type { RenderResultOptions } from "../../extensibility/custom-tools/types.js";
import { type IrcMessage } from "../../irc/bus.js";
import type { Theme } from "../../modes/theme/theme.js";
import { type AgentRegistry } from "../../registry/agent-registry.js";
import { type CoordinationDetails, type HubRenderArgs } from "./types.js";
export declare const DEFAULT_IRC_TIMEOUT_MS = 120000;
/**
 * Messaging availability: there must be someone to chat with. True for every
 * subagent (it always has a parent, and possibly siblings) and for any
 * session that can still spawn subagents through the task tool. Only a
 * top-level session with task spawning unavailable has no peers.
 */
export declare function isIrcEnabled(settings: Settings, taskDepth: number): boolean;
export declare function formatIncoming(msg: IrcMessage): string;
export declare function normalizeIrcTimeoutMs(value: number): number;
/** Effective message-wait timeout: explicit param wins, then `irc.timeoutMs`. */
export declare function resolveMessageTimeoutMs(settings: Settings, explicit?: number): number;
/** Session-buffered inbox drain used before parking a bus waiter. */
export declare function drainPendingInbox(registry: AgentRegistry, senderId: string, from?: string): IrcMessage | undefined;
/** `wait` result carrying a consumed message. */
export declare function messageResult(senderId: string, waited: IrcMessage): AgentToolResult<CoordinationDetails>;
/**
 * List every addressable peer, restoring parked refs from disk when a resumed
 * session has no in-memory roster.
 */
export declare function executeList(registry: AgentRegistry, senderId: string): Promise<AgentToolResult<CoordinationDetails>>;
export interface HubSendParams {
    to?: string;
    message?: string;
    replyTo?: string;
    await?: boolean;
    timeoutMs?: number;
}
export declare function executeSend(deps: {
    registry: AgentRegistry;
    senderId: string;
    settings: Settings;
}, params: HubSendParams, signal?: AbortSignal): Promise<AgentToolResult<CoordinationDetails>>;
/** Pure message wait: no jobs in play, block on the bus with peer liveness. */
export declare function executeMessageWait(deps: {
    registry: AgentRegistry;
    senderId: string;
    settings: Settings;
}, params: {
    from?: string;
    timeoutMs?: number;
}, signal?: AbortSignal): Promise<AgentToolResult<CoordinationDetails>>;
export declare function executeInbox(registry: AgentRegistry, senderId: string, peek?: boolean): AgentToolResult<CoordinationDetails>;
/**
 * Display-only transcript card for live IRC traffic: `irc:incoming` DMs
 * delivered to this session, `irc:autoreply` side-channel replies sent on
 * this session's behalf, and `irc:relay` observations of agent↔agent
 * traffic. Shares the tool renderer's glyph + quote-border conventions so
 * cards and hub messaging output look identical in the transcript.
 */
export declare function createIrcMessageCard(card: {
    kind: "incoming" | "autoreply" | "relay";
    from?: string;
    to?: string;
    body?: string;
    replyTo?: string;
    timestamp?: number;
}, getExpanded: () => boolean, uiTheme: Theme): Component;
/** Pending-call frame for messaging ops (send/wait-from/inbox/list). */
export declare function messagingRenderCall(args: HubRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
/** Result frame for messaging ops and message-carrying `wait` results. */
export declare function messagingRenderResult(result: {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: CoordinationDetails;
    isError?: boolean;
}, options: RenderResultOptions, uiTheme: Theme, args?: HubRenderArgs): Component;
