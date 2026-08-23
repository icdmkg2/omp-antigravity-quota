import type { FetchImpl } from "@oh-my-pi/pi-ai/types";
export interface OAuthEndpoints {
    authorizationUrl: string;
    tokenUrl: string;
    clientId?: string;
    /** Dynamic client registration endpoint advertised by the authorization server. */
    registrationUrl?: string;
    scopes?: string;
    resource?: string;
}
export interface AuthDetectionResult {
    requiresAuth: boolean;
    authType?: "oauth" | "apikey" | "unknown";
    oauth?: OAuthEndpoints;
    authServerUrl?: string;
    resourceMetadataUrl?: string;
    /**
     * OAuth scopes advertised by the challenge (RFC 6750 `scope=` on
     * `WWW-Authenticate`) or by protected-resource metadata. Passed through
     * `discoverOAuthEndpoints` as `protectedScopes` so the eventual
     * authorization request carries them even when the auth-server metadata
     * document itself omits `scopes_supported`.
     */
    scopes?: string;
    message?: string;
}
export declare function extractMcpAuthServerUrl(error: Error, serverUrl?: string): string | undefined;
/**
 * Pull the `scope`/`scopes` parameter out of a `WWW-Authenticate` challenge
 * embedded in the error message. RFC 6750 lets servers advertise the missing
 * scopes when they reject a bearer token with `insufficient_scope`, and RFC
 * 8414-adjacent MCP gateways sometimes list the required scopes there rather
 * than in `scopes_supported`. Returns the raw space-separated value, or
 * `undefined` when the challenge does not carry one.
 */
export declare function extractOAuthChallengeScopes(error: Error): string | undefined;
/**
 * Extract OAuth endpoints from error response.
 * Looks for WWW-Authenticate header format or JSON error bodies.
 */
export declare function extractOAuthEndpoints(error: Error): OAuthEndpoints | null;
/**
 * Analyze an error to determine authentication requirements.
 * Returns structured info about what auth is needed.
 */
export declare function analyzeAuthError(error: Error, serverUrl?: string): AuthDetectionResult;
/**
 * Fetch the RFC 9728 protected-resource metadata document at
 * {@link resourceMetadataUrl} and return any scopes it advertises. Used by
 * `/mcp add` / `/mcp reauth` on the JSON-error-body path, where the caller
 * already holds usable OAuth endpoints but the required scopes live only in
 * the advertised protected-resource metadata — a case `discoverOAuthEndpoints`
 * normally handles but that path is skipped when the body carried endpoints.
 * Returns `undefined` on any error or when no scopes are advertised.
 */
export declare function fetchResourceMetadataScopes(resourceMetadataUrl: string, opts?: {
    fetch?: FetchImpl;
    signal?: AbortSignal;
}): Promise<string | undefined>;
/**
 * Try to discover OAuth endpoints by querying the server's well-known endpoints.
 * This is a fallback when error responses don't include OAuth metadata.
 */
export declare function discoverOAuthEndpoints(serverUrl: string, authServerUrl?: string, resourceMetadataUrl?: string, opts?: {
    fetch?: FetchImpl;
    protectedResource?: string;
    protectedScopes?: string;
    signal?: AbortSignal;
}): Promise<OAuthEndpoints | null>;
