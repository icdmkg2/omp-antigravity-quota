import type { CollabFrame, RelayControlMessage } from "./protocol.js";
export interface CollabSocketOptions {
    /** wss://host[:port]/r/<roomId> — no query string. */
    wsUrl: string;
    role: "host" | "guest";
    key: CryptoKey;
}
export declare class CollabSocket {
    #private;
    /** Fires after every successful (re)connect. */
    onOpen?: () => void;
    onFrame?: (frame: CollabFrame, fromPeer: number) => void;
    onControl?: (msg: RelayControlMessage) => void;
    /** Fires once per terminal close (intentional, fatal code, or bad key). willReconnect=true for transient drops that will retry. */
    onClose?: (reason: string, willReconnect: boolean) => void;
    constructor(opts: CollabSocketOptions);
    get isOpen(): boolean;
    connect(): void;
    send(frame: CollabFrame, targetPeer?: number): void;
    /** Intentional close: clears any retry timer, suppresses reconnect. A later connect() starts fresh. */
    close(): void;
}
