import type { InternalResource, InternalUrl, ProtocolHandler, ResolveContext, WriteContext } from "./types.js";
/** Canonical prefix for virtual tool-device URLs. */
export declare const XD_URL_PREFIX = "xd://";
/**
 * Parse an `xd://` URL into its device target.
 * Returns `null` for other or malformed URLs and `name: null` for the root.
 */
export declare function parseXdUrl(input: string): {
    name: string | null;
} | null;
/** Whether a streaming path prefix could still become an `xd://` URL. */
export declare function couldBecomeXdUrl(partialPath: string): boolean;
/** Routes session-bound virtual tool devices through `xd://` URLs. */
export declare class XdProtocolHandler implements ProtocolHandler {
    readonly scheme = "xd";
    readonly immutable = true;
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
    write(url: InternalUrl, content: string, context?: WriteContext): Promise<void>;
}
