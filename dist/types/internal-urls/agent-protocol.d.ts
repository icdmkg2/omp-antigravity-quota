import type { InternalResource, InternalUrl, ProtocolHandler, UrlCompletion } from "./types.js";
/**
 * Handler for agent:// URLs.
 *
 * Resolves output IDs like "reviewer_0" to their artifact files,
 * with optional JSON extraction.
 */
export declare class AgentProtocolHandler implements ProtocolHandler {
    #private;
    readonly scheme = "agent";
    readonly immutable = true;
    resolve(url: InternalUrl): Promise<InternalResource>;
    complete(): Promise<UrlCompletion[]>;
}
