/** Maximum UTF-8 size of one newline-delimited RPC frame, including the newline. */
export declare const MAX_RPC_FRAME_BYTES: number;
/** Maximum UTF-8 size of one logical frame reassembled by protocol v2. */
export declare const MAX_RPC_REASSEMBLED_BYTES: number;
export type RpcProtocolVersion = 1 | 2;
/** Reassemble protocol v2 chunk frames after each JSONL line has been parsed. */
export declare class RpcFrameDecoder {
    #private;
    push(value: unknown): object | undefined;
}
/** Serialize a complete JSONL frame while enforcing the transport byte ceiling. */
export declare function encodeRpcFrame(frame: object, streamedMessageCount?: number, streamedMessages?: readonly unknown[]): string;
/** Stateful encoder that tracks which messages a client has already received. */
export declare class RpcFrameEncoder {
    #private;
    setProtocolVersion(version: number): void;
    /**
     * Encode one logical frame into physical JSONL lines. Encoder bookkeeping runs
     * eagerly; only chunk emission is lazy, so a chunked result can be streamed to
     * stdout with backpressure without holding the whole transport in memory. The
     * returned iterable MUST be fully consumed exactly once.
     */
    encodeFrames(frame: object): Iterable<string>;
    encode(frame: object): string;
}
