import type { SttModelKey } from "./models.js";
export type SttProgressStatus = "initiate" | "download" | "progress" | "progress_total" | "done" | "ready" | "error";
export interface SttProgressFileState {
    loaded: number;
    total: number;
}
export interface SttProgressEvent {
    modelKey: SttModelKey;
    status: SttProgressStatus;
    name?: string;
    file?: string;
    progress?: number;
    loaded?: number;
    total?: number;
    files?: Record<string, SttProgressFileState>;
    task?: string;
    model?: string;
}
export type SttWorkerInbound = {
    type: "ping";
    id: string;
} | {
    type: "transcribe";
    id: string;
    modelKey: SttModelKey;
    audio: Float32Array;
    language?: string;
} | {
    type: "download";
    id: string;
    modelKey: SttModelKey;
} | {
    type: "stream_start";
    id: string;
    modelKey: SttModelKey;
    language?: string;
} | {
    type: "stream_audio";
    id: string;
    audio: Float32Array;
} | {
    type: "stream_stop";
    id: string;
} | {
    type: "stream_cancel";
    id: string;
};
export type SttWorkerOutbound = {
    type: "pong";
    id: string;
} | {
    type: "transcription";
    id: string;
    text: string;
} | {
    type: "downloaded";
    id: string;
} | {
    type: "error";
    id: string;
    error: string;
} | {
    type: "progress";
    id: string;
    event: SttProgressEvent;
} | {
    type: "log";
    level: "debug" | "warn" | "error";
    msg: string;
    meta?: Record<string, unknown>;
} | {
    type: "partial";
    id: string;
    text: string;
} | {
    type: "segment";
    id: string;
    index: number;
    text: string;
} | {
    type: "stream_done";
    id: string;
    text: string;
};
/**
 * Wire transport between the parent (`SttClient`) and the speech-recognition
 * subprocess. The parent owns the subprocess lifecycle (graceful work, hard
 * SIGKILL on shutdown); the protocol therefore carries no explicit close
 * handshake — once the parent decides to terminate, it signals the OS to reap
 * the child so `onnxruntime-node`'s NAPI finalizer never runs in any shared
 * address space (the destructor segfaults Bun on shutdown; issue #1606). See
 * `asr-client.ts` for the spawn/kill glue.
 */
export interface SttTransport {
    send(message: SttWorkerOutbound): void;
    onMessage(handler: (message: SttWorkerInbound) => void): () => void;
}
