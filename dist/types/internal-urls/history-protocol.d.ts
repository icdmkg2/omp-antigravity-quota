import type { InternalResource, InternalUrl, ProtocolHandler, UrlCompletion } from "./types.js";
/**
 * Handler for history:// URLs.
 *
 * Resolves agent ids against the global AgentRegistry, then falls back to
 * on-disk `.jsonl` transcripts, serving read-only history for live, parked,
 * and unregistered agents alike.
 */
export declare class HistoryProtocolHandler implements ProtocolHandler {
    #private;
    readonly scheme = "history";
    readonly immutable = false;
    resolve(url: InternalUrl): Promise<InternalResource>;
    complete(): Promise<UrlCompletion[]>;
}
