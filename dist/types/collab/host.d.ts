/**
 * Host side of a collab live session.
 *
 * Taps the host session's event stream and SessionManager append chokepoint,
 * broadcasting entries/events/state to guests through the relay. Guests prompt
 * and abort through us; the host machine runs the agent and tools. The host's
 * subagent ecosystem is mirrored too: task EventBus traffic (observer HUD),
 * agent-registry snapshots (Agent Hub table), hub chat/kill/revive commands,
 * and incremental subagent-transcript reads.
 */
import type { CollabUiRequestDraft, CollabUiResponseValue } from "@oh-my-pi/pi-wire";
import type { InteractiveModeContext } from "../modes/types.js";
import { type CollabParticipant } from "./protocol.js";
/** Max bytes served per fetch-transcript reply (guest re-requests from `newSize`). */
export declare const TRANSCRIPT_READ_CAP: number;
/**
 * Outcome of {@link CollabHost.requestGuestUi}. `answered` carries the guest's
 * response (an `undefined` value is a genuine guest cancel); `unavailable`
 * means the collab channel went away (teardown, relay drop) or the request was
 * aborted before any guest answered — callers MUST NOT treat it as a cancel.
 */
export type CollabGuestUiResult = {
    kind: "answered";
    value: CollabUiResponseValue;
} | {
    kind: "unavailable";
};
export declare class CollabHost {
    #private;
    constructor(ctx: InteractiveModeContext);
    get link(): string;
    /** Browser deep link for the configured collab web UI. */
    get webLink(): string;
    /** Read-only variant of {@link link}: bare room key, no write token. */
    get viewLink(): string;
    /** Read-only variant of {@link webLink}. */
    get webViewLink(): string;
    get participants(): CollabParticipant[];
    requestGuestUi(request: CollabUiRequestDraft, signal?: AbortSignal): Promise<CollabGuestUiResult> | null;
    start(relayUrl: string, webUrl?: string): Promise<void>;
    /** Broadcast a goodbye, detach all taps, and close the socket. */
    stop(reason: string): Promise<void>;
}
