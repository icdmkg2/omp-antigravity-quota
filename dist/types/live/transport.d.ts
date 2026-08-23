import { type AuthStorage } from "@oh-my-pi/pi-ai";
import { type LiveClientMessage, type LiveServerEvent } from "./protocol.js";
/** Callbacks emitted by the live WebRTC transport. */
export interface LiveTransportCallbacks {
    onEvent(event: LiveServerEvent): void;
    onOutputLevel(level: number): void;
}
/** Configuration required to establish a Codex live call. */
export interface LiveTransportOptions {
    authStorage: AuthStorage;
    sessionId: string;
    instructions: string;
    voice: string;
    callbacks: LiveTransportCallbacks;
    signal?: AbortSignal;
}
/** Extracts the server-assigned `rtc_*` call ID from a signaling Location header. */
export declare function parseLiveCallId(location: string | null): string | undefined;
/** Builds the Frameless Bidi sideband WebSocket URL for an accepted Codex call. */
export declare function buildLiveSidebandUrl(callId: string): string;
/** Native WebRTC transport for a Codex Frameless Bidi live session. */
export declare class CodexLiveTransport {
    #private;
    constructor(options: LiveTransportOptions);
    /** Establish the native peer, perform Codex signaling, and wait for the data channel. */
    connect(): Promise<void>;
    /** Serialize one Frameless Bidi control message onto the call's sideband WebSocket. */
    send(message: LiveClientMessage): Promise<void>;
    /** Queue 16 kHz mono Float32 PCM for native Opus transmission. */
    pushAudio(samples: Float32Array): void;
    /** Enable or disable the native audio source and discard partial input when muted. */
    setMuted(muted: boolean): Promise<void>;
    /** Stop sideband signaling and the native WebRTC media peer. Safe to call repeatedly. */
    close(): Promise<void>;
}
