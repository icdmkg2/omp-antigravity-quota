import type { ImageContent } from "@oh-my-pi/pi-ai";
import type { AgentHubRemote } from "../modes/components/agent-hub.js";
import type { InteractiveModeContext } from "../modes/types.js";
import { AgentRegistry } from "../registry/agent-registry.js";
import { type CollabSessionState } from "./protocol.js";
/** Commands a guest may run locally; everything else is host-only. */
export declare const COLLAB_GUEST_ALLOWED_COMMANDS: Record<string, true>;
/** Minimal context surface the idle-state reconciler mutates. */
export interface GuestIdleReconcilerCtx {
    statusLine: {
        markActivityEnd: () => void;
    };
    statusContainer: Pick<InteractiveModeContext["statusContainer"], "disposeChildren">;
    loadingAnimation: {
        stop: () => void;
    } | undefined;
}
/**
 * Close the guest UI state held open by an earlier `agent_start` whose
 * matching `agent_end` never reached us — most often because a reconnect
 * dropped the event mid-stream. Reached via {@link reconcileGuestSnapshotHostState}
 * (the live `state`-frame and welcome/resync reconciler) when the host reports `isStreaming === false`:
 * folds the in-flight active-time window into the per-session meter (so
 * `time_spent` stops ticking) and stops the `Working…` loader if one is
 * still animating. No-op when the host is still streaming.
 *
 * Exported for direct unit testing; mutates the loader field on `ctx` so
 * the same loader is not stopped twice on subsequent reconciliations.
 */
export declare function reconcileGuestIdleHostState(ctx: GuestIdleReconcilerCtx, isStreaming: boolean): void;
/** Reconcile a welcome/resync snapshot's host activity state into the guest meter. */
export interface GuestSnapshotActivityReconcilerCtx extends GuestIdleReconcilerCtx {
    statusLine: GuestIdleReconcilerCtx["statusLine"] & {
        markActivityStart: () => void;
    };
    /**
     * Start (or re-attach) the live "Working…" loader. Mirrors
     * `InteractiveModeContext.ensureLoadingAnimation`, which is what
     * `EventController` calls on `agent_start`. Required so a guest that
     * missed an earlier `agent_start` (a reconnect dropped it mid-stream)
     * starts its spinner when the host later reports it is streaming.
     */
    ensureLoadingAnimation: InteractiveModeContext["ensureLoadingAnimation"];
    autoCompactionLoader: InteractiveModeContext["autoCompactionLoader"];
    retryLoader: InteractiveModeContext["retryLoader"];
}
/** Status-area state which cannot outlive removal of its child components. */
export interface GuestTransientStatusCtx {
    statusContainer: Pick<InteractiveModeContext["statusContainer"], "clear">;
    autoCompactionLoader: InteractiveModeContext["autoCompactionLoader"];
    retryLoader: InteractiveModeContext["retryLoader"];
}
/** Stop and forget status-area loaders before detaching their components. */
export declare function clearGuestTransientStatus(ctx: GuestTransientStatusCtx): void;
export declare function reconcileGuestSnapshotHostState(ctx: GuestSnapshotActivityReconcilerCtx, isStreaming: boolean): void;
export declare class CollabGuestLink {
    #private;
    state: CollabSessionState | null;
    /** Local mirror of the host's agent ecosystem (refs carry `session: null`). */
    readonly agentRegistry: AgentRegistry;
    /** Agent Hub actions routed to the host over the wire. */
    get hubRemote(): AgentHubRemote;
    /** True when this guest joined through a read-only (view) link. */
    get readOnly(): boolean;
    constructor(ctx: InteractiveModeContext);
    join(link: string): Promise<void>;
    /** User-initiated leave (or post-disconnect cleanup): restore the previous session. */
    leave(_reason: string): Promise<void>;
    sendPrompt(text: string, images?: ImageContent[]): void;
    sendAbort(): void;
}
