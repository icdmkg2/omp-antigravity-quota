import type { InternalResource, ProtocolHandler, ResolveContext, UrlCompletion, WriteContext } from "./types.js";
export declare class InternalUrlRouter {
    #private;
    constructor();
    /** Process-global router instance. */
    static instance(): InternalUrlRouter;
    /** Reset the global instance in tests. */
    static resetForTests(): void;
    register(handler: ProtocolHandler): void;
    unregister(scheme: string): boolean;
    getHandler(scheme: string): ProtocolHandler | undefined;
    canHandle(input: string): boolean;
    /**
     * Whether read can resolve this URL through either a native handler or the
     * MCP resource fallback. MCP resources may use arbitrary custom schemes and
     * may be opaque (`urn:example:document`) rather than hierarchical.
     */
    canResolve(input: string): boolean;
    /** Schemes whose handler supports host/path autocomplete. */
    completionSchemes(): string[];
    /**
     * Candidate completions for the host/path portion of `scheme://<query>`.
     * Returns `null` when the scheme is unknown or does not support completion.
     */
    complete(scheme: string, query: string, context?: ResolveContext): Promise<UrlCompletion[] | null>;
    /** Resolve an internal URL through its registered protocol handler. */
    resolve(input: string, context?: ResolveContext): Promise<InternalResource>;
    /** Write an internal URL through its registered protocol handler. */
    write(input: string, content: string, context?: WriteContext): Promise<void>;
}
