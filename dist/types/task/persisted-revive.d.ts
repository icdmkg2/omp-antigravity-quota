import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import type { PersistedSubagentReviverFactory } from "../registry/agent-lifecycle.js";
import type { AgentSession } from "../session/agent-session.js";
import type { AuthStorage } from "../session/auth-storage.js";
import type { EventBus } from "../utils/event-bus.js";
/**
 * Ambient context the reviver needs at revive time. The top-level session is
 * kept LIVE (cwd / artifact manager read on demand) so a later `/new` or cwd
 * move is followed rather than snapshotted; auth/models/settings are
 * process-stable and captured by reference.
 */
export interface PersistedSubagentReviveContext {
    session: AgentSession;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
    settings: Settings;
    /** LSP policy of the top-level session; revived subagents inherit it rather than defaulting on. */
    enableLsp: boolean;
    /**
     * Shared event bus feeding RPC/collab subagent subscriptions. Passed through
     * to the wake-turn monitor so an IRC send to a cold-revived subagent emits
     * the same lifecycle/progress frames a live run does.
     */
    eventBus?: EventBus;
}
/**
 * Build the factory the {@link AgentLifecycleManager} uses to cold-revive a
 * `parked` subagent ref restored from disk (Agent Hub scan, collab mirror, or a
 * resumed process). Such a ref carries a sessionFile but no in-memory adoption —
 * the executor's live reviver closure died with the process/turn that spawned
 * it — so `ensureLive` (IRC sends, hub focus) would otherwise refuse it.
 *
 * This rebuilds the subagent the same way `--resume` rebuilds a session: reopen
 * the JSONL and replay it through {@link createAgentSession}. The catch is that
 * resume restores only conversation/model from the file — the runtime contract
 * (tools / system prompt / output schema / kind) is built from options, so a
 * bare reopen would resurrect a wrong (top-level) session. We source that
 * contract from the persisted `session_init` entry instead, and mirror the
 * executor's subagent wiring (MCP proxy tools, depth-derived gating,
 * yield-required, active-tool clamp, registry status sync).
 */
export declare function createPersistedSubagentReviverFactory(ctx: PersistedSubagentReviveContext): PersistedSubagentReviverFactory;
