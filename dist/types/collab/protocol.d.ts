/**
 * Collab live-session wire protocol.
 *
 * Hub topology: the host is authoritative, guests never peer. All session
 * payloads (`CollabFrame`) travel AES-256-GCM sealed; the relay only sees the
 * plaintext envelope (`[4B uint32 BE peerId][sealed payload]`) plus TEXT JSON
 * control messages that carry no session data.
 */
import type { ImageContent, Model } from "@oh-my-pi/pi-ai";
import type { BusChannel, CollabUiRequest, GuestFrame, ParsedCollabLink, Participant, SessionState, AgentSnapshot as WireAgentSnapshot } from "@oh-my-pi/pi-wire";
import { DEFAULT_RELAY_URL, ENVELOPE_HEADER_LENGTH, ROOM_ID_BYTES } from "@oh-my-pi/pi-wire";
import type { ContextUsage } from "../extensibility/extensions/types.js";
import type { AgentSessionEvent } from "../session/agent-session.js";
import type { SessionEntry, SessionHeader } from "../session/session-entries.js";
export type { CollabPromptDetails, CollabUiRequest, CollabUiRequestDraft, CollabUiResponseValue, CollabUiSelectItem, ParsedCollabLink, RelayControlMessage, RelayControlToGuest, RelayControlToHost, } from "@oh-my-pi/pi-wire";
export { COLLAB_PROMPT_MESSAGE_TYPE, COLLAB_PROTO } from "@oh-my-pi/pi-wire";
export { DEFAULT_RELAY_URL, ENVELOPE_HEADER_LENGTH, ROOM_ID_BYTES };
export type CollabParticipant = Participant;
export type AgentSnapshot = WireAgentSnapshot;
/** Debounced footer snapshot broadcast by the host. */
export type CollabSessionState = SessionState & {
    /**
     * Host model (full catalog object). Guests apply it to their replica
     * agent state so model display and context-window math are native.
     */
    model?: Model;
    /** Host status-line context numbers (guest system prompt/tools differ, so local estimates drift). */
    contextUsage?: ContextUsage;
};
/**
 * Encrypted payload frames (inside AES-GCM, JSON). The wire package pins the
 * JSON skeleton (`WireFrame`); host-side frames carry the rich session types
 * that serialize into those shapes.
 */
export type CollabFrame = Exclude<GuestFrame, {
    t: "prompt";
}> | {
    t: "prompt";
    text: string;
    images?: ImageContent[];
} | {
    t: "welcome";
    proto: number;
    header: SessionHeader;
    state: CollabSessionState;
    agents: AgentSnapshot[];
    /**
     * Total number of `SessionEntry` items the host will deliver in the
     * `snapshot-chunk` frames that follow. The guest stays in the
     * snapshot-loading phase until it has accumulated that many entries
     * (or a chunk arrives with `final: true`).
     */
    entryCount: number;
    /** True when this peer joined through a read-only (view) link. */
    readOnly?: boolean;
}
/**
 * Targeted snapshot fragment delivered after `welcome`. Splits a large
 * transcript across many small frames so the guest's per-chunk progress
 * timeout resets each time the relay delivers another batch; without
 * chunking, a multi-MB session has to fit one giant frame inside the
 * 30 s first-welcome budget. The last chunk carries `final: true` so the
 * guest can finalize the replica session.
 */
 | {
    t: "snapshot-chunk";
    entries: SessionEntry[];
    final: boolean;
} | {
    t: "entry";
    entry: SessionEntry;
} | {
    t: "event";
    event: AgentSessionEvent;
} | {
    t: "state";
    state: CollabSessionState;
}
/** Mirrored EventBus traffic (task subagent lifecycle/progress channels only). */
 | {
    t: "bus";
    channel: BusChannel;
    data: unknown;
}
/** Full agent-registry snapshot (debounced on registry change). */
 | {
    t: "agents";
    agents: AgentSnapshot[];
} | {
    t: "ui-request";
    request: CollabUiRequest;
} | {
    t: "ui-request-end";
    reqId: number;
}
/** Targeted reply to fetch-transcript; `error` marks a terminal read failure that guests must surface without hot retrying. */
 | {
    t: "transcript";
    reqId: number;
    text: string;
    newSize: number;
    error?: string;
} | {
    t: "bye";
    reason: string;
} | {
    t: "error";
    message: string;
};
export declare function packEnvelope(peerId: number, sealed: Uint8Array): Uint8Array;
export declare function unpackEnvelope(data: Uint8Array): {
    peerId: number;
    payload: Uint8Array;
} | null;
/** Rewrite the peerId in place without copying the payload. */
export declare function rewriteEnvelopePeer(data: Uint8Array, peerId: number): void;
export declare function generateRoomId(): string;
/**
 * Render the shareable link. Compact forms: the default relay collapses to
 * `<roomId>.<key>`, other wss relays drop the scheme (`host[:port]/r/…`);
 * only localhost ws:// links keep their full URL so parsing cannot
 * mis-infer wss.
 *
 * The room secret is dot-joined (`<roomId>.<key>`) rather than `#`-joined:
 * RFC 3986 forbids a raw `#` inside a fragment, so strict URL stacks (macOS
 * Foundation behind terminal click-to-open) percent-encode a second `#` to
 * `%23` and break the link. Parsers still accept the legacy `#` form and the
 * mangled `%23` form.
 *
 * Full links append the write token to the key
 * (`base64url(key ∥ writeToken)`); read-only (view) links carry the bare
 * 32-byte key, which is also the pre-token link format.
 */
export declare function formatCollabLink(relayUrl: string, roomId: string, key: Uint8Array, writeToken?: Uint8Array): string;
/**
 * Render the browser deep link. The browser UI may be hosted separately from
 * the relay; the fragment always carries the relay-specific collab link, so
 * room secrets stay out of HTTP path and query bytes.
 */
export declare function formatCollabWebLink(relayUrl: string, roomId: string, key: Uint8Array, writeToken?: Uint8Array, webUrl?: string): string;
export declare function parseCollabLink(link: string): ParsedCollabLink | {
    error: string;
};
