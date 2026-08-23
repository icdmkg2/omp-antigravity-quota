import type { OAuthAccountIdentity, StoredAuthCredential } from "../../session/auth-storage.js";
export interface LogoutAccount {
    credentialId: number;
    provider: string;
    label: string;
    detail: string;
    type: "api_key" | "oauth";
    active: boolean;
}
interface LogoutAccountOptions {
    activeIdentity?: OAuthAccountIdentity;
    activeApiKey?: boolean;
}
export declare function toLogoutAccounts(provider: string, credentials: StoredAuthCredential[], options?: LogoutAccountOptions): LogoutAccount[];
export {};
