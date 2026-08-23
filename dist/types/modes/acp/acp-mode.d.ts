import { AgentSideConnection, type Stream } from "@oh-my-pi/pi-utils/acp";
import type { ExtensionUIContext } from "../../extensibility/extensions/types.js";
import type { AgentSession } from "../../session/agent-session.js";
import { AcpAgent } from "./acp-agent.js";
/** Session and deferred tool UI hook created for an ACP client workspace. */
export interface AcpSessionHandle {
    session: AgentSession;
    setToolUIContext: (uiContext: ExtensionUIContext, hasUI: boolean) => void;
}
/**
 * Creates sessions requested by an ACP client.
 *
 * Session-only results remain supported for embedders that do not need the
 * deferred interactive-prompt bridge.
 */
export type AcpSessionFactory = (cwd: string, options?: {
    interactivePrompts?: boolean;
}) => Promise<AgentSession | AcpSessionHandle>;
/** Creates an ACP connection and exposes its agent when process-level teardown must own it. */
export declare function createAcpConnection(transport: Stream, createSession: AcpSessionFactory, initialSession?: AgentSession, onAgent?: (agent: AcpAgent) => void): AgentSideConnection;
/** Serves ACP over stdio until the peer disconnects, then awaits session teardown before exit. */
export declare function runAcpMode(createSession: AcpSessionFactory, initialSession?: AgentSession): Promise<void>;
