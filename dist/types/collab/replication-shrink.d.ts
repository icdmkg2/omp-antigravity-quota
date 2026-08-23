/**
 * Hard-cap helper for host→guest collab frames.
 *
 * The host wraps every {@link CollabFrame} in an AES-GCM envelope and ships it
 * through the relay's WebSocket. WebSocket servers enforce a per-frame
 * `maxPayloadLength` (Bun's default is 16 MB; many proxies cap lower). A
 * single oversized payload — typically a `read`/`bash`/`search` tool result
 * captured as one multi-megabyte string, or a tool result whose `content`
 * array holds thousands of small blocks — would otherwise ship as its own
 * oversized frame and trip that limit, killing the host's WebSocket with
 * `1006 Received too big message`. `CollabSocket` treats 1006 as transient
 * and reconnects, the next guest hello triggers the same oversized send, and
 * the loop never breaks (issue #3739).
 *
 * This helper bounds any JSON-serializable payload below
 * {@link MAX_REPLICATED_PAYLOAD_BYTES}. Already-small payloads pass through
 * untouched; oversized ones are returned as a deep-cloned shadow where long
 * strings are head-truncated AND long arrays are head-clipped, with
 * `[…N chars elided for collab session]` / `[…N items elided for collab
 * session]` markers. Both axes are needed: string truncation alone leaves
 * the cap unenforced for a payload built of many short strings, where no
 * field exceeds the per-string floor.
 */
/**
 * Per-payload ceiling for host→guest frames. Bun's default WebSocket
 * `maxPayloadLength` is 16 MB; we leave a generous margin so the AES-GCM
 * envelope (+ IV + tag), the 4-byte peer header, and the outer wire wrapper
 * fit comfortably under that on every reasonable relay.
 */
export declare const MAX_REPLICATED_PAYLOAD_BYTES: number;
/**
 * Return `value` unchanged when its JSON serialization already fits
 * {@link MAX_REPLICATED_PAYLOAD_BYTES}; otherwise return a deep-cloned
 * shadow shrunk along both string and array axes until the payload fits.
 * The function is generic over `T` because the wire shape is preserved:
 * only string leaves and array tails change; discriminator fields, ids, and
 * other small metadata pass through untouched.
 */
export declare function shrinkForReplication<T>(value: T): T;
