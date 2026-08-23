import type { CollabFrame } from "./protocol.js";
export declare function generateRoomKey(): Uint8Array;
export declare function generateWriteToken(): Uint8Array;
export declare function importRoomKey(raw: Uint8Array): Promise<CryptoKey>;
export declare function seal(key: CryptoKey, frame: CollabFrame): Promise<Uint8Array>;
/** Inverse of {@link seal}. Throws on auth failure or malformed input. */
export declare function open(key: CryptoKey, data: Uint8Array): Promise<CollabFrame>;
