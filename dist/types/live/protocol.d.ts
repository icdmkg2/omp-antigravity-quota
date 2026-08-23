/** Frameless Bidi model used by Codex Desktop live calls. */
export declare const LIVE_MODEL: "gpt-live-1-codex";
/** Maximum UTF-8 payload size accepted by each context append. */
export declare const CONTEXT_CHUNK_BYTES = 500;
/** Semantic stream selected for appended Frameless Bidi context. */
export type LiveContextChannel = "speakable" | "commentary";
/** Text content item accepted by Frameless Bidi context appends. */
export type LiveInputTextContent = {
    type: "input_text";
    text: string;
};
/** Session object posted alongside the SDP when opening a live call. */
export type LiveSessionPayload = {
    model: typeof LIVE_MODEL;
    instructions: string;
    audio: {
        output: {
            voice: string;
        };
    };
    delegation: {
        type: "client";
    };
};
/** Messages sent by the client over the Frameless Bidi data channel. */
export type LiveClientMessage = {
    type: "delegation.context.append";
    delegation_item_id: string;
    channel?: LiveContextChannel;
    content: LiveInputTextContent[];
} | {
    type: "session.context.append";
    channel?: LiveContextChannel;
    content: LiveInputTextContent[];
} | {
    type: "session.close";
};
/** Parsed Frameless Bidi server events, including unsupported wire event types. */
export type LiveServerEvent = {
    type: "session.started" | "session.updated";
    session: {
        id: string;
        instructions?: string;
    };
} | {
    type: "output_audio.delta";
    audio: string;
} | {
    type: "input_transcript.added" | "output_transcript.added";
    item: {
        text: string;
    };
} | {
    type: "turn.done";
    turn: {
        role: "user" | "assistant";
        transcript: string;
    };
} | {
    type: "delegation.created";
    item: {
        type: "delegation";
        target: "client";
        id: string;
        content: LiveInputTextContent[];
    };
} | {
    type: "error";
    message: string;
} | {
    type: "unknown";
    wireType: string;
};
/** Parse a JSON string or decoded value from the Frameless Bidi data channel. */
export declare function parseLiveServerEvent(payload: unknown): LiveServerEvent | null;
/** Build the session object posted in the multipart WebRTC call request. */
export declare function buildLiveSessionPayload(instructions: string, voice: string): LiveSessionPayload;
/** Build a context append associated with a server-created delegation. */
export declare function buildDelegationContextAppend(delegationItemId: string, text: string, channel?: LiveContextChannel): LiveClientMessage;
/** Build context appended to the live session outside a delegation. */
export declare function buildSessionContextAppend(text: string, channel?: LiveContextChannel): LiveClientMessage;
/** Build the message that gracefully closes a live session. */
export declare function buildSessionClose(): LiveClientMessage;
/** Split context into character-safe chunks of at most 500 UTF-8 bytes. */
export declare function chunkLiveContext(text: string): string[];
