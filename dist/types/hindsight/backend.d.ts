/**
 * Hindsight memory backend.
 *
 * Wires the per-session lifecycle (recall on first turn, retain every Nth
 * agent_end, etc.) on top of the AgentSession event stream. Hindsight runtime
 * state is owned by the AgentSession so lifetime follows the actual domain
 * owner instead of a parallel session-id registry.
 */
import type { MemoryBackend } from "../memory-backend/types.js";
import type { AgentSession } from "../session/agent-session.js";
/** Reload the active session's mental-model cache and prompt. */
export declare function reloadMentalModelsForSession(session: AgentSession): Promise<boolean>;
export declare const hindsightBackend: MemoryBackend;
