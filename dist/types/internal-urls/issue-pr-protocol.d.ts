import type { InternalResource, InternalUrl, ProtocolHandler, ResolveContext } from "./types.js";
/**
 * Handler for `issue://` URLs.
 */
export declare class IssueProtocolHandler implements ProtocolHandler {
    readonly scheme = "issue";
    readonly immutable = true;
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
}
/**
 * Handler for `pr://` URLs.
 */
export declare class PrProtocolHandler implements ProtocolHandler {
    readonly scheme = "pr";
    readonly immutable = true;
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
}
