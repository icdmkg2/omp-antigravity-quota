/**
 * Generic OAuth flow for MCP servers.
 *
 * Allows users to authenticate with any OAuth-compatible MCP server
 * by providing authorization URL, token URL, and client credentials.
 */
import { OAuthCallbackFlow } from "@oh-my-pi/pi-ai/oauth/callback-server";
import type { OAuthController, OAuthCredentials } from "@oh-my-pi/pi-ai/oauth/types";
import type { FetchImpl } from "@oh-my-pi/pi-ai/types";
import type { OAuthCredential } from "../session/auth-storage.js";
/**
 * Deterministic credential id for an MCP server URL scoped to an OMP profile.
 *
 * Local profile stores are already separate, but auth-broker storage shares one
 * provider namespace across profiles. Including the profile in the provider key
 * keeps a shared project `mcp.json` definition from making profile B overwrite
 * or read profile A's OAuth row for the same server URL. The URL is used
 * verbatim (query string included) because it can carry tenant selectors such
 * as `?project_ref=`.
 */
export declare function mcpOAuthCredentialId(serverUrl: string, profile?: string | undefined): string;
/** Whether a credential id was minted by OMP's MCP OAuth flows (either era). */
export declare function isManagedMCPOAuthCredentialId(credentialId: string | undefined): credentialId is string;
/**
 * Profile segment of a profile-scoped `mcp_oauth:profile:<profile>:<serverUrl>`
 * credential id, or `undefined` for legacy non-profile-scoped managed ids
 * (`mcp_oauth:<url>`, `mcp_oauth_<rand>`). The server URL itself contains `:`
 * and `/`, so only the segment between the prefix and the FIRST subsequent `:`
 * is the profile; everything after it is the URL.
 */
export declare function mcpOAuthCredentialProfile(credentialId: string): string | undefined;
/**
 * Server URL embedded in a managed MCP OAuth credential id, or `undefined`
 * for legacy random ids (`mcp_oauth_<rand>`) minted before URL-keyed ids.
 *
 * Inverse of {@link mcpOAuthCredentialId}. Mirrors {@link mcpOAuthCredentialProfile}:
 * the URL contains `:` and `/`, so for profile-scoped ids the URL is everything
 * after the profile segment; for legacy url-keyed ids (`mcp_oauth:<url>`) it is
 * everything after the prefix. Lets the auth-broker — which never sees the MCP
 * config — recover the server URL for the RFC 8707 fallback resource on refresh.
 */
export declare function mcpOAuthServerUrlFromCredentialId(credentialId: string): string | undefined;
/**
 * Stored MCP OAuth credential. Refresh material is embedded so token refresh
 * works without any `auth` block persisted in (possibly shared) config files.
 */
export interface MCPStoredOAuthCredential extends OAuthCredential {
    tokenUrl?: string;
    clientId?: string;
    clientSecret?: string;
    resource?: string;
    /**
     * Authorization-server URL (the issuer the grant was minted against). Used
     * to filter same-origin resource indicators on refresh: RFC 8414 lets the
     * authorize and token endpoints sit on different origins, so refresh
     * cannot infer the original auth-server origin from `tokenUrl` alone.
     * Unset on legacy credentials minted before issue #3502's fix.
     */
    authorizationUrl?: string;
}
export interface MCPOAuthConfig {
    /** Authorization endpoint URL */
    authorizationUrl: string;
    /** Token endpoint URL */
    tokenUrl: string;
    /** Dynamic client registration endpoint advertised by the authorization server. */
    registrationUrl?: string;
    /** Client ID (optional when already embedded in authorization URL) */
    clientId?: string;
    /** Client secret (optional for PKCE flows) */
    clientSecret?: string;
    /** OAuth scopes (space-separated) */
    scopes?: string;
    /**
     * `prompt` parameter for the authorization request. By default the parameter
     * is omitted, matching the reference MCP SDK, except for `offline_access`
     * requests where OIDC Core requires `prompt=consent` to issue refresh-token
     * access. Set to `""` to omit the parameter entirely.
     */
    prompt?: string;
    /** Exact redirect URI to advertise to the provider */
    redirectUri?: string;
    /** Custom callback port (default: 3000) */
    callbackPort?: number;
    /** Custom callback path (default: /callback or redirectUri pathname) */
    callbackPath?: string;
    /** MCP resource URI for RFC 8707 resource indicators */
    resource?: string;
    /**
     * True when `resource` was synthesized from the server URL fallback rather
     * than advertised by OAuth/protected-resource metadata. Fallback resources
     * are stripped when same-origin with the authorization server; advertised
     * path-scoped resources are preserved.
     */
    stripSameOriginResource?: boolean;
    /** Fetch implementation for token exchange and discovery requests. */
    fetch?: FetchImpl;
}
/**
 * Generic OAuth flow for MCP servers.
 * Supports standard OAuth 2.0 authorization code flow with PKCE.
 */
export declare class MCPOAuthFlow extends OAuthCallbackFlow {
    #private;
    private config;
    constructor(config: MCPOAuthConfig, ctrl: OAuthController);
    /**
     * Client id used during the authorization request. Returns the value supplied
     * via {@link MCPOAuthConfig.clientId} or, when the server required dynamic
     * client registration, the id issued during registration. `undefined` until
     * {@link generateAuthUrl} (or {@link login}) has run for a server that needs
     * a client id.
     */
    get resolvedClientId(): string | undefined;
    /**
     * Client secret issued by dynamic client registration, if any. Always
     * `undefined` for PKCE-only/public clients and when the caller supplies the
     * client id via config.
     */
    get registeredClientSecret(): string | undefined;
    get resource(): string | undefined;
    /**
     * Authorization-server URL the flow used. Persist alongside the credential
     * so refresh can filter same-origin resource indicators against the issuer's
     * origin even when `tokenUrl` lives on a different origin (RFC 8414 permits
     * the split).
     */
    get authorizationUrl(): string;
    generateAuthUrl(state: string, redirectUri: string): Promise<{
        url: string;
        instructions?: string;
    }>;
    exchangeToken(code: string, _state: string, redirectUri: string): Promise<OAuthCredentials>;
}
/**
 * Options for {@link refreshMCPOAuthToken}. Carried via the trailing object
 * so positional callers keep working.
 */
export interface RefreshMCPOAuthTokenOptions {
    fetch?: FetchImpl;
    signal?: AbortSignal;
    /**
     * Authorization-server URL the original grant was minted against. Used to
     * filter same-origin resource indicators on refresh. Defaults to `tokenUrl`'s
     * origin when omitted for legacy credentials.
     */
    authorizationUrl?: string;
    /**
     * True when the refresh `resource` was synthesized from the server URL
     * fallback because the credential/auth material carried no resource.
     * Preserved advertised resources leave this false/undefined.
     */
    stripSameOriginResource?: boolean;
}
/**
 * Refresh an MCP OAuth token using the standard refresh_token grant.
 * Returns updated credentials; preserves the old refresh token if the server doesn't rotate it.
 */
export declare function refreshMCPOAuthToken(tokenUrl: string, refreshToken: string, clientId?: string, clientSecret?: string, resourceOrOpts?: string | RefreshMCPOAuthTokenOptions, opts?: RefreshMCPOAuthTokenOptions): Promise<OAuthCredentials>;
