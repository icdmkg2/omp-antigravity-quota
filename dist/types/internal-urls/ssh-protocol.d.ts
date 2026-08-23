import type { InternalResource, InternalUrl, ProtocolHandler, ResolveContext, UrlCompletion, WriteContext } from "./types.js";
export declare class SshProtocolHandler implements ProtocolHandler {
    #private;
    readonly scheme = "ssh";
    readonly immutable = false;
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
    /** Autocomplete the host segment of `ssh://` with the configured SSH hosts. */
    complete(_query?: string, context?: ResolveContext): Promise<UrlCompletion[]>;
    write(url: InternalUrl, content: string, context?: WriteContext): Promise<void>;
}
