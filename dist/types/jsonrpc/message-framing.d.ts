/**
 * Shared Content-Length message framing for the JSON byte streams spoken by the
 * LSP and DAP stdio clients. Both protocols use the same base-protocol framing:
 * each message is a `Content-Length: <n>\r\n\r\n` header block followed by `<n>`
 * bytes of UTF-8 JSON. This module owns the incremental decode so the two
 * clients don't each reimplement chunk accumulation, header scanning, and the
 * mid-message remainder handoff.
 */
/**
 * Incremental Content-Length frame decoder for a JSON message byte stream.
 *
 * Incoming bytes are buffered as a list of chunks and only joined when a full
 * message is framed — concatenating the accumulator on every read is O(n^2) for
 * messages that span many reads (e.g. a large initial diagnostics burst). Feed
 * raw chunks with {@link push}, pull every complete message with {@link drain},
 * and persist {@link remainder} when the reader stops so a restarted reader
 * resumes mid-message.
 */
export declare class MessageFramer {
    #private;
    /** Seed the buffer with any unparsed remainder left by a previous reader. */
    constructor(seed: Buffer);
    /** Append a freshly read chunk to the pending buffer. */
    push(chunk: Buffer): void;
    /**
     * Yield the JSON text of every complete message currently buffered. A header
     * block without a `Content-Length` is non-protocol noise (e.g. a server
     * printing to stdout); `onResync` is invoked with the offending header text
     * and the framer drops past the bogus terminator to recover instead of
     * stalling on the same junk header forever.
     */
    drain(onResync: (headerText: string) => void): Generator<string>;
    /** The unparsed remainder, to persist when the reader stops. */
    remainder(): Buffer;
}
