import { SecurityStore } from "../security/store.js";
import type { InternalResource, InternalUrl, ProtocolHandler, ResolveContext, UrlCompletion } from "./types.js";
export type SecurityStoreResolver = (cwd: string, signal?: AbortSignal) => Promise<SecurityStore>;
export declare function isSecurityEnabled(): boolean;
export declare class SecurityDisabledError extends Error {
    constructor();
}
export declare class SecurityProtocolHandler implements ProtocolHandler {
    #private;
    readonly scheme = "security";
    readonly immutable = true;
    constructor(resolveStore?: SecurityStoreResolver, enabled?: () => boolean);
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
    complete(query?: string, context?: ResolveContext): Promise<UrlCompletion[]>;
}
