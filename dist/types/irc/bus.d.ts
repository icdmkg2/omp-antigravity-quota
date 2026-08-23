/**
 * IrcBus - Process-global mailbox bus for agent-to-agent messaging.
 *
 * Replaces the old auto-reply model: a `send` never blocks on the recipient
 * generating anything. Delivery resolves the recipient via the global
 * AgentRegistry — parked agents are revived through the
 * AgentLifecycleManager, idle agents are woken with a real turn, and busy
 * agents receive the message as a non-interrupting aside at the next step
 * boundary (see AgentSession.deliverIrcMessage). Replies are real turns by
 * the recipient, observed via `wait` — with one exception: when the sender
 * awaits a reply and the recipient cannot run a real reply turn in time
 * (mid-turn with async execution disabled — possibly blocked in a
 * synchronous task spawn whose batch includes the sender — or idle in plan
 * mode, where autonomous wake turns are suppressed), the recipient session
 * generates an ephemeral side-channel auto-reply.
 */
import { AgentLifecycleManager } from "../registry/agent-lifecycle.js";
import { AgentRegistry } from "../registry/agent-registry.js";
export interface IrcMessage {
    id: string;
    /** Sender agent id. */
    from: string;
    /** Recipient agent id (resolved; "all" is expanded by the tool, not stored). */
    to: string;
    body: string;
    ts: number;
    /** Message id being answered. */
    replyTo?: string;
}
export interface IrcDeliveryReceipt {
    to: string;
    outcome: "injected" | "woken" | "revived" | "failed";
    error?: string;
}
export declare class IrcBus {
    #private;
    static global(): IrcBus;
    /** Reset the global bus. Test-only. */
    static resetGlobalForTests(): void;
    constructor(registry?: AgentRegistry, lifecycle?: AgentLifecycleManager);
    /**
     * Fire-and-forget delivery. Never blocks on the recipient generating
     * anything: the receipt reports how the message reached the recipient
     * (waiter/aside = "injected", idle wake = "woken", park revival =
     * "revived"), not what they did with it.
     *
     * Mailbox semantics: a successfully delivered message never lingers in
     * the recipient's mailbox — injection/wake puts the full body into their
     * context, so buffering it too would double-deliver via a later
     * `wait`/`inbox` and inflate unread counts. Only a failed live hand-off
     * is buffered for the recipient to drain later.
     *
     * `opts.expectsReply` marks sends whose caller is blocked on an answer
     * (`send await:true`). It is forwarded to the recipient session so a
     * mid-turn recipient that cannot reach a step boundary (async execution
     * disabled — e.g. blocked in a synchronous task spawn awaiting the
     * sender's own batch) can generate an ephemeral side-channel auto-reply
     * instead of stranding the sender until timeout.
     *
     * `opts.suppressRelay` skips the display-only main-UI relay for this leg.
     * Set by broadcast fan-out when the same broadcast also targets the main
     * agent directly: the main agent then already sees the body as its own
     * incoming card, so relaying the sibling legs would duplicate it.
     */
    send(msg: Omit<IrcMessage, "id" | "ts">, opts?: {
        expectsReply?: boolean;
        suppressRelay?: boolean;
    }): Promise<IrcDeliveryReceipt>;
    /**
     * Block until a message for `agentId` (optionally from `filter.from`)
     * arrives; consume + return it. Null on timeout (`timeoutMs <= 0` waits
     * forever). Rejects when `signal` aborts. By default, already-buffered
     * mail satisfies the wait before parking a future waiter; callers that
     * need a strictly future reply can disable that drain.
     */
    wait(agentId: string, filter: {
        from?: string;
    }, timeoutMs: number, signal?: AbortSignal, options?: {
        drainPending?: boolean;
        liveness?: {
            registry: AgentRegistry;
            senderId: string;
        };
    }): Promise<IrcMessage | null>;
    /** Drain (or peek) pending messages for `agentId`. */
    inbox(agentId: string, opts?: {
        peek?: boolean;
    }): IrcMessage[];
    /**
     * Consume the OLDEST pending message for `agentId` (optionally restricted
     * to `from`), leaving the rest of the mailbox intact. This is the exact
     * atomic step `wait` performs on entry, exposed for callers that must not
     * block: peeking with `inbox` and consuming afterwards would open a window
     * for a concurrent consumer of the same mailbox to take the message in
     * between, and a plain `inbox` drain would swallow the whole backlog.
     */
    take(agentId: string, from?: string): IrcMessage | undefined;
    unreadCount(agentId: string): number;
}
