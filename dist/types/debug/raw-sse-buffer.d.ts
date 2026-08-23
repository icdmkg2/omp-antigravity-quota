import type { Model, ProviderResponseMetadata, RawSseEvent } from "@oh-my-pi/pi-ai";
export type RawSseDebugRecord = {
    kind: "response";
    sequence: number;
    timestamp: number;
    provider?: string;
    model?: string;
    api?: string;
    status: number;
    requestId?: string | null;
    transport?: string;
} | {
    kind: "event";
    sequence: number;
    timestamp: number;
    provider?: string;
    model?: string;
    api?: string;
    event: string | null;
    raw: string[];
    truncated: boolean;
    originalChars: number;
};
export interface RawSseDebugSnapshot {
    records: readonly RawSseDebugRecord[];
    droppedRecords: number;
    droppedChars: number;
    totalEvents: number;
    lastUpdatedAt?: number;
}
export declare function formatRawSseIsoTime(timestamp: number): string;
export declare function formatRawSseResponseComment(record: Extract<RawSseDebugRecord, {
    kind: "response";
}>): string;
export declare function rawSseRecordLines(record: RawSseDebugRecord): string[];
export declare class RawSseDebugBuffer {
    #private;
    subscribe(listener: () => void): () => void;
    recordResponse(response: ProviderResponseMetadata, model?: Model): void;
    recordEvent(event: RawSseEvent, model?: Model): void;
    snapshot(): RawSseDebugSnapshot;
    toRawText(): string;
    /**
     * Drop every retained record and reset accounting. Called from
     * {@link AgentSession} teardown so a disposed (e.g. parked subagent) session
     * stops pinning captured wire frames — each trimmed record holds a
     * `slice()` of its parent SSE frame, which under JSC keeps the whole
     * multi-MB frame alive. Notifies subscribers so a live debug viewer redraws
     * empty.
     */
    clear(): void;
}
export declare function resolveRawSseDebugBuffer(owner?: object): RawSseDebugBuffer;
