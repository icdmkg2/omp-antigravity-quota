import { type OAuthCredential } from "@oh-my-pi/pi-ai";
import type { OAuthCredentials } from "@oh-my-pi/pi-ai/oauth/types";
export type AuthBrokerAction = "serve" | "token" | "login" | "logout" | "status" | "import" | "migrate" | "list";
export interface AuthBrokerCommandArgs {
    action: AuthBrokerAction;
    flags: {
        json?: boolean;
        bind?: string;
        regenerate?: boolean;
        via?: string;
        provider?: string;
        dryRun?: boolean;
        /** `login`/`logout`: provider id. `import`: filesystem path. */
        source?: string;
        /** `import`: keep credentials whose JSON had `disabled: true`. */
        includeDisabled?: boolean;
        /** `migrate`: also upload local OAuth (default: api_key only, since OAuth is via cliproxy import). */
        includeOauth?: boolean;
        /** `migrate`: also capture env-var API keys for providers not yet on broker. */
        includeEnv?: boolean;
        /** `migrate`: required `--from-local` source. Reserved for future sources. */
        fromLocal?: boolean;
    };
}
declare const ACTIONS: readonly AuthBrokerAction[];
/**
 * OAuth refresh handler for `omp auth-broker serve`'s {@link AuthStorage}.
 *
 * The vault holds provider OAuth rows AND OMP-managed `mcp_oauth:*` rows.
 * Provider rows refresh through the per-provider registry. MCP rows are
 * self-describing — the embedded token endpoint and client credentials are the
 * only refresh material — so they refresh with a generic `refresh_token` grant.
 * The serve process never loads the MCP manager, so this is the only place that
 * teaches the broker to refresh MCP tokens; without it
 * `POST /v1/credential/:id/refresh` fails with "Unknown OAuth provider" and the
 * background refresher lets MCP access tokens expire (issue #8933).
 */
export declare function refreshBrokerOAuthCredential(provider: string, credential: OAuthCredential, signal?: AbortSignal): Promise<OAuthCredentials>;
export declare function runAuthBrokerCommand(cmd: AuthBrokerCommandArgs): Promise<void>;
export { ACTIONS as AUTH_BROKER_ACTIONS };
