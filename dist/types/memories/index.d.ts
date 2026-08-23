import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import type { MemoryBackendSaveInput, MemoryBackendSaveResult } from "../memory-backend/types.js";
import type { AgentSession } from "../session/agent-session.js";
/**
 * Start the background memory startup pipeline.
 *
 * Skips for ephemeral sessions, subagent sessions, disabled settings, or DB failures.
 */
export declare function startMemoryStartupTask(options: {
    session: AgentSession;
    settings: Settings;
    modelRegistry: ModelRegistry;
    agentDir: string;
    taskDepth: number;
}): void;
interface MemoryInstructionSession {
    sessionManager: Pick<AgentSession["sessionManager"], "getSessionFile">;
}
/**
 * Drop the per-session memory instruction snapshot after explicit memory state
 * changes that must affect the active conversation immediately, such as
 * `/memory clear`.
 */
export declare function clearMemoryToolDeveloperInstructionsCache(session: MemoryInstructionSession | undefined): void;
/**
 * Refresh the active session's consolidated-memory snapshot after startup maintenance.
 *
 * Startup may finish after the first prompt build and write `memory_summary.md`;
 * the active session should see that summary. It must not reread `learned.md`,
 * because a `learn` call racing with startup belongs to the next session's
 * memory prompt, not the active prompt-cache prefix.
 */
export declare function refreshMemoryToolDeveloperInstructionsCacheAfterStartup(session: MemoryInstructionSession, agentDir: string, settings: Settings): Promise<void>;
/**
 * Build memory usage instructions for prompt injection.
 */
export declare function buildMemoryToolDeveloperInstructions(agentDir: string, settings: Settings, session?: MemoryInstructionSession): Promise<string | undefined>;
/**
 * Clear all persisted memory state and generated artifacts.
 */
export declare function clearMemoryData(agentDir: string, cwd: string): Promise<void>;
/**
 * Force-enqueue global consolidation maintenance work.
 */
export declare function enqueueMemoryConsolidation(agentDir: string, cwd: string, sourceUpdatedAt?: number): void;
export declare function getMemoryRoot(agentDir: string, cwd: string): string;
/**
 * Append one lesson to the project's `learned.md` (newest-first, deduped,
 * capped, secret-redacted, injection-neutralized). The file backs the `learn`
 * tool when `memory.backend` is `local`.
 */
export declare function saveLearnedLesson(agentDir: string, cwd: string, input: MemoryBackendSaveInput): Promise<MemoryBackendSaveResult>;
export {};
