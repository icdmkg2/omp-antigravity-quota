import { type Api, type Model } from "@oh-my-pi/pi-ai";
export type AuthGatewayAction = "serve" | "token" | "status" | "check";
export interface AuthGatewayCommandArgs {
    action: AuthGatewayAction;
    flags: {
        json?: boolean;
        bind?: string;
        regenerate?: boolean;
        /**
         * Disable bearer-token auth on inbound requests. Useful when the gateway
         * is bound to loopback (the default `127.0.0.1:4000`) and you don't want
         * to wire token-paste plumbing into every local client.
         */
        noAuth?: boolean;
        /**
         * Strict mode for `check` — additionally exercise every credential
         * against its provider's chat-completion endpoint. The usage probe (run
         * unconditionally) can pass while the chat endpoint still 401s the same
         * bearer, so strict mode is the definitive "is this credential
         * actually usable" signal. Slower and consumes a tiny amount of quota.
         */
        strict?: boolean;
    };
}
declare const ACTIONS: readonly AuthGatewayAction[];
/**
 * Index resolvable models by the request ids clients may send: the
 * provider-qualified `provider/id` (always) and the bare `id` (first-write-wins
 * fallback for legacy clients). Scoped to providers the gateway holds broker
 * credentials for, since only those are routable.
 */
export declare function indexModelsByRequestId(models: readonly Model<Api>[], providersWithCreds: ReadonlySet<string>): Map<string, Model<Api>>;
export declare function runAuthGatewayCommand(cmd: AuthGatewayCommandArgs): Promise<void>;
export { ACTIONS as AUTH_GATEWAY_ACTIONS };
