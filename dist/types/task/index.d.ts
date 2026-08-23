import type { AgentTool, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "../index.js";
import type { Theme } from "../modes/theme/theme.js";
import { type SingleResult, type TaskItem, type TaskToolDetails, type TaskToolSchemaInstance } from "./types.js";
import "../tools/review.js";
import { renderResult, renderCall as renderTaskCall } from "./render.js";
export { loadBundledAgents as BUNDLED_AGENTS } from "./agents.js";
export { discoverCommands, expandCommand, getCommand } from "./commands.js";
export { discoverAgents, getAgent } from "./discovery.js";
export { AgentOutputManager } from "./output-manager.js";
export * from "./read-only-policy.js";
export type { AgentDefinition, AgentProgress, SingleResult, SubagentEventPayload, SubagentLifecyclePayload, SubagentProgressPayload, TaskParams, TaskToolDetails, } from "./types.js";
export { TASK_SUBAGENT_EVENT_CHANNEL, TASK_SUBAGENT_LIFECYCLE_CHANNEL, TASK_SUBAGENT_PROGRESS_CHANNEL, taskSchema, } from "./types.js";
/**
 * Preview text for a child result. Falls back to "(no output)" — annotated
 * with the request count when the child actually did work, so the parent can
 * tell a no-op child from one that burned requests before being cancelled.
 */
export declare function formatResultOutputFallback(result: Pick<SingleResult, "output" | "stderr" | "requests">): string;
/**
 * Advisory — never a rejection — nudging the spawner toward tailored
 * specific agent types when one call resolves ≥2 items to a generic
 * `task`/`sonic` worker and the spawner still holds spawn capacity
 * (DepthCapacity: it currently has the `task` tool). `agentNames` are the
 * per-item resolved agent types. Returns undefined when no nudge applies.
 */
export declare function buildSpecializationAdvisory(agentNames: string[], depthCapacity: boolean, scoutAvailable?: boolean): string | undefined;
/**
 * Suggestion — never a rejection — nudging the spawner to coordinate via the
 * hub when one call creates ≥2 live siblings and it still holds spawn
 * capacity. Returns undefined when there is nothing to coordinate or peer
 * messaging is unavailable.
 */
export declare function buildCoordinationAdvisory(items: TaskItem[], depthCapacity: boolean, ircEnabled: boolean): string | undefined;
/**
 * Compose the non-blocking advisory appended to a `task` result: the
 * specialization nudge (from the per-item resolved agent types), plus — only
 * when some spawns keep running after this call (`willRunAsync`) — the
 * coordination suggestion over those still-live spawns (`items`). Coordination
 * is gated on async because a sync spawn has already finished by the time the
 * call returns, so a "coordinate while they run" hint would misfire. Returns
 * undefined when neither applies.
 */
export declare function composeSpawnAdvisory(args: {
    agents: string[];
    items: TaskItem[];
    depthCapacity: boolean;
    ircEnabled: boolean;
    willRunAsync: boolean;
    scoutAvailable?: boolean;
}): string | undefined;
/** Rescan one cwd and publish its definitions to existing and future task tools. */
export declare function refreshAgentDiscovery(cwd: string): Promise<void>;
/**
 * Task tool - Delegate tasks to specialized agents.
 *
 * Each call spawns one subagent — or, with `task.batch`, one per `tasks[]`
 * item. When `async.enabled` is on, spawns run as AsyncJobManager jobs; when
 * disabled, the tool blocks until every spawn finishes.
 */
export declare class TaskTool implements AgentTool<TaskToolSchemaInstance, TaskToolDetails, Theme> {
    #private;
    private readonly session;
    readonly name = "task";
    readonly approval: "exec";
    readonly formatApprovalDetails: (args: unknown) => string[];
    readonly label = "Task";
    readonly summary = "Spawn subagents to complete delegated tasks";
    readonly strict = false;
    readonly loadMode = "essential";
    readonly lenientArgValidation = true;
    readonly renderResult: typeof renderResult;
    readonly mergeCallAndResult = true;
    get parameters(): TaskToolSchemaInstance;
    renderCall(args: unknown, options: Parameters<typeof renderTaskCall>[1], theme: Theme): import("@oh-my-pi/pi-tui").Component;
    /** Dynamic description that reflects current task settings. */
    get description(): string;
    private constructor();
    /**
     * Create a TaskTool instance with async agent discovery.
     */
    static create(session: ToolSession): Promise<TaskTool>;
    execute(toolCallId: string, rawParams: unknown, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<TaskToolDetails>): Promise<AgentToolResult<TaskToolDetails>>;
}
