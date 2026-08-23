import type { AgentSession } from "../session/agent-session.js";
import type { MemoryBackendOperationContext, MemoryRuntimeContext } from "./types.js";
export declare function createMemoryRuntimeContext(context: MemoryBackendOperationContext): MemoryRuntimeContext;
export declare function createSessionMemoryRuntimeContext(session: AgentSession, agentDir: string, cwd: string): MemoryRuntimeContext;
