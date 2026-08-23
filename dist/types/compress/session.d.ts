import type { AgentSession } from "../session/agent-session.js";
import type { CompressProtocol } from "./protocol.js";
/** A live compress session plus the resolved model label used in reporting. */
export interface CompressSession {
    session: AgentSession;
    model: string;
}
/** Resolve the requested model and open a session restricted to the two protocol tools. */
export declare function createCompressSession(options: {
    cwd?: string;
    model?: string;
    protocol: CompressProtocol;
    /** Distinct per concurrent session; agent ids must be unique within a process. */
    agentId?: string;
}): Promise<CompressSession>;
