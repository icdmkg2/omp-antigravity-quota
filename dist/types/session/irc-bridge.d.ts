import type { Agent } from "@oh-my-pi/pi-agent-core";
import type { Settings } from "../config/settings.js";
import { type IrcMessage } from "../irc/bus.js";
import type { AgentSessionEvent } from "./agent-session-events.js";
import type { CustomMessage } from "./messages.js";
import type { SessionManager } from "./session-manager.js";
/** Capabilities the IRC bridge borrows from its owning session. */
export interface IrcBridgeHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    isDisposed(): boolean;
    isStreaming(): boolean;
    planModeEnabled(): boolean;
    emitSessionEvent(event: AgentSessionEvent): Promise<void>;
    wakeForIrc(records: CustomMessage[]): void;
    runEphemeralTurn(args: {
        promptText: string;
    }): Promise<{
        replyText: string;
    }>;
}
/** Owns incoming IRC queues, injection, and side-channel auto-replies. */
export declare class IrcBridge {
    #private;
    constructor(host: IrcBridgeHost);
    /** Whether an incoming peer message can interrupt a wait. */
    hasInterrupts(): boolean;
    /** Whether any undelivered IRC record remains queued. */
    hasPending(): boolean;
    /** Takes every queued IRC record in interrupt-before-aside order. */
    drainPending(): CustomMessage[];
    /** Queues records whose idle wake must wait for a session transition to finish. */
    deferWake(records: CustomMessage[]): void;
    /** Surfaces and consumes queued incoming records before automatic injection. */
    drainInboxMessages(agentId: string, opts?: {
        from?: string;
        limit?: number;
    }): IrcMessage[];
    /** Delivers an IRC message into the recipient session without awaiting any wake turn. */
    deliver(msg: IrcMessage, opts?: {
        expectsReply?: boolean;
    }): Promise<"injected" | "woken">;
    /** Emits an IRC relay observation for rendering without persisting it. */
    emitRelayObservation(record: CustomMessage): void;
    /** Persists queued IRC records that missed their step-boundary injection. */
    flushPending(): void;
}
