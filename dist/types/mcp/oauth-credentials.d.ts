import type { OAuthCredentials } from "@oh-my-pi/pi-ai/oauth/types";
import type { AuthStorage } from "../session/auth-storage.js";
import { type MCPStoredOAuthCredential } from "./oauth-flow.js";
import type { MCPAuthConfig, MCPServerConfig } from "./types.js";
export interface MCPOAuthCredentialLookup {
    credentialId: string;
    credential: MCPStoredOAuthCredential;
}
export type MCPOAuthRefreshMaterial = MCPStoredOAuthCredential | MCPAuthConfig | undefined;
export declare function mcpOAuthCredentialIdsForServerUrl(serverUrl: string | undefined): string[];
export declare function hasMcpAuthorizationHeader(config: MCPServerConfig): boolean;
export declare function lookupMcpOAuthCredentialForServer(authStorage: AuthStorage | null | undefined, auth: MCPAuthConfig | undefined, serverUrl: string | undefined, options?: {
    allowUrlKeyedFallback?: boolean;
}): MCPOAuthCredentialLookup | undefined;
export declare function lookupMcpOAuthCredential(authStorage: AuthStorage | null | undefined, config: MCPServerConfig): MCPOAuthCredentialLookup | undefined;
export declare function selectMcpOAuthRefreshMaterial(credential: MCPStoredOAuthCredential, auth: MCPAuthConfig | undefined): MCPOAuthRefreshMaterial;
/**
 * Refresh a stored MCP OAuth credential via the standard `refresh_token` grant.
 *
 * Refresh material is taken from the credential itself (self-contained modern
 * credentials embed `tokenUrl`/`clientId`/`clientSecret`/`resource`) or, for
 * legacy credentials that carry none, the server's `auth` block. Shared by the
 * local MCP manager and the `omp auth-broker serve` refresh path so a broker
 * with no access to the MCP config can still refresh `mcp_oauth:*` credentials
 * from the vault.
 *
 * `serverUrl` supplies the RFC 8707 fallback resource indicator when neither
 * the credential nor the auth block advertised one; the manager passes the
 * configured server URL, the broker recovers it from the credential id via
 * {@link mcpOAuthServerUrlFromCredentialId}.
 *
 * @throws when no usable refresh token or token endpoint is available.
 */
export declare function refreshManagedMcpOAuthCredential(credential: MCPStoredOAuthCredential, opts?: {
    serverUrl?: string;
    auth?: MCPAuthConfig;
    signal?: AbortSignal;
}): Promise<OAuthCredentials>;
export declare function removeManagedMcpOAuthCredential(authStorage: AuthStorage, credentialId: string | undefined): Promise<boolean>;
export declare function removeManagedMcpOAuthCredentials(authStorage: AuthStorage, credentialIds: readonly (string | undefined)[]): Promise<boolean>;
