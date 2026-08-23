/**
 * ACP-side `ClientBridge` implementation. Wraps `AgentSideConnection` so the
 * `read`/`write`/`bash`/`edit` tools (and the permission gate in
 * `AgentSession`) can route through the client when it advertises the
 * relevant capabilities at `initialize` time.
 */
import type { AgentSideConnection, ClientCapabilities } from "@oh-my-pi/pi-utils/acp";
import type { ClientBridge } from "../../session/client-bridge.js";
export declare function createAcpClientBridge(connection: AgentSideConnection, sessionId: string, clientCapabilities: ClientCapabilities | undefined): ClientBridge;
