/**
 * Claims Bun's singleton stdin reader immediately and exposes a separately readable stream.
 * RPC startup uses this before extension discovery so in-process modules cannot steal protocol input.
 */
export declare function claimRpcInput(): ReadableStream<Uint8Array>;
/**
 * Parses newline-delimited RPC input without letting one malformed line stop
 * subsequent protocol frames.
 */
export declare function readRpcInputFrames(input: ReadableStream<Uint8Array>, onFrame: (frame: unknown) => void, onParseError: (message: string) => void): Promise<void>;
