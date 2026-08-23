import { InternalUrlRouter } from "../../internal-urls/index.js";
import type { InternalResource, InternalUrl, ResolveContext, WriteContext } from "../../internal-urls/types.js";
import type { RpcHostUriCancelRequest, RpcHostUriRequest, RpcHostUriResult, RpcHostUriSchemeDefinition } from "./rpc-types.js";
type RpcHostUriOutput = (frame: RpcHostUriRequest | RpcHostUriCancelRequest) => void;
/** Type guard for inbound `host_uri_result` frames coming from the host. */
export declare function isRpcHostUriResult(value: unknown): value is RpcHostUriResult;
/**
 * Bidirectional bridge that lets the RPC host own a set of URI schemes.
 *
 * The host registers schemes via `set_host_uri_schemes`; the bridge installs
 * a `RpcHostUriProtocolHandler` per scheme into the process-global
 * {@link InternalUrlRouter}. Reads land on the read tool through the existing
 * router; writes are intercepted by the write tool and dispatched through
 * `requestWrite`.
 */
export declare class RpcHostUriBridge {
    #private;
    constructor(output: RpcHostUriOutput, router?: InternalUrlRouter);
    getSchemes(): string[];
    /**
     * Replace the registered set of host URI schemes. Previously registered
     * schemes that no longer appear in the new set are unregistered from the
     * router; surviving and new schemes get fresh handler instances.
     */
    setSchemes(schemes: RpcHostUriSchemeDefinition[]): string[];
    /**
     * Unregister every host scheme from the router and reject any in-flight
     * requests. Called on RPC shutdown to keep the global router clean for
     * subsequent sessions in the same process (used by tests).
     */
    clear(message?: string): void;
    /** Resolve a pending request by id; called by `rpc-mode` on inbound results. */
    handleResult(frame: RpcHostUriResult): boolean;
    rejectAllPending(message: string): void;
    requestRead(scheme: string, url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
    requestWrite(_scheme: string, url: InternalUrl, content: string, context?: WriteContext): Promise<void>;
}
export {};
