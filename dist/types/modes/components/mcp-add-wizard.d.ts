import type { MCPServerConfig } from "../../mcp/types.js";
import { OverlayPanel } from "./overlay-box.js";
type Scope = "user" | "project";
/**
 * Result of the wizard's OAuth callback. `credentialId` is mandatory;
 * `clientId` is populated when the OAuth provider performed dynamic client
 * registration (or when the caller pre-supplied it) so the wizard can fold it
 * into the final `mcp.json` entry. Refresh material (including any DCR client
 * secret) is embedded in the stored credential, never written to config files.
 */
export interface MCPAddWizardOAuthResult {
    credentialId: string;
    clientId?: string;
    resource?: string;
}
interface MCPAddWizardOAuthOptions {
    serverUrl?: string;
    resource?: string;
    registrationUrl?: string;
    /**
     * External cancellation source. Aborting it tears down the in-flight OAuth
     * flow and surfaces a neutral cancellation error. The wizard wires its own
     * controller here so Esc cancels the OAuth wait instead of stepping back
     * through the form (the wizard is focused, so the editor's Esc hook does
     * not fire).
     */
    abortSignal?: AbortSignal;
}
export declare class MCPAddWizard extends OverlayPanel {
    #private;
    constructor(onComplete: (name: string, config: MCPServerConfig, scope: Scope) => void, onCancel: () => void, onOAuth?: (authUrl: string, tokenUrl: string, clientId: string, clientSecret: string, scopes: string, options?: MCPAddWizardOAuthOptions) => Promise<MCPAddWizardOAuthResult>, onTestConnection?: (config: MCPServerConfig) => Promise<void>, onRender?: () => void, initialName?: string);
    handleInput(keyData: string): void;
}
export {};
