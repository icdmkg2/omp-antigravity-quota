/**
 * In-process execution for subagents.
 *
 * Runs each subagent on the main thread and forwards AgentEvents for progress tracking.
 */
import type { AgentTelemetryConfig } from "@oh-my-pi/pi-agent-core";
import type { ServiceTierByFamily } from "@oh-my-pi/pi-ai";
import type { Rule } from "../capability/rule.js";
import { ModelRegistry } from "../config/model-registry.js";
import type { PromptTemplate } from "../config/prompt-templates.js";
import { Settings } from "../config/settings.js";
import { type SettingPath } from "../config/settings-schema.js";
import type { ToolPathWithSource } from "../extensibility/custom-tools/index.js";
import type { CustomTool } from "../extensibility/custom-tools/types.js";
import { type Skill } from "../extensibility/skills.js";
import type { HindsightSessionState } from "../hindsight/state.js";
import type { LocalProtocolOptions } from "../internal-urls/index.js";
import type { MCPManager } from "../mcp/manager.js";
import type { MnemopiSessionState } from "../mnemopi/state.js";
import { type AgentReviver } from "../registry/agent-lifecycle.js";
import { type CreateAgentSessionOptions } from "../sdk.js";
import type { AgentSession } from "../session/agent-session.js";
import type { ArtifactManager } from "../session/artifacts.js";
import type { AuthStorage } from "../session/auth-storage.js";
import { type ConfiguredThinkingLevel, type TaskEffort } from "../thinking.js";
import type { ContextFileEntry } from "../tools/index.js";
import type { EventBus } from "../utils/event-bus.js";
import type { WorkspaceTree } from "../workspace-tree.js";
import { type AgentDefinition, type AgentProgress, type SingleResult, type StructuredSubagentOutput, type StructuredSubagentSchemaMode, type StructuredSubagentSchemaSource, type YieldItem } from "./types.js";
export type { YieldItem } from "./types.js";
/**
 * Soft per-agent request budgets (assistant requests per run). Crossing the
 * budget injects a wrap-up steering notice (`task.softRequestBudgetNotice`,
 * on by default). At 1.5x the budget the free-running turn is stopped and the
 * agent is driven to one forced final `yield` so partial findings come back
 * as a real report; only if it still refuses to yield within
 * {@link BUDGET_STOP_GRACE_REQUESTS} more requests is the run hard-aborted.
 * Entries are ceilings, not fixed values: the `default` key applies to agents
 * without an explicit entry, and the `task.softRequestBudget` setting can only
 * lower an agent's budget, never raise it above its bundled entry (0 disables
 * the guard entirely).
 */
export declare const SOFT_REQUEST_BUDGET: Record<string, number>;
/**
 * Resolves the effective soft request budget for an agent. The configured
 * `task.softRequestBudget` and the agent's bundled entry are both upper
 * bounds, so the tighter one wins; a configured budget of 0 disables the
 * guard regardless of the bundled entry.
 */
export declare function resolveSoftRequestBudget(agentName: string, configuredBudget: number): number;
/** Extra requests allowed after a budget stop for the forced yield to land before the run is hard-aborted. */
export declare const BUDGET_STOP_GRACE_REQUESTS = 5;
/** Steering notice injected when a subagent crosses its soft request budget. */
export declare function buildBudgetNotice(requests: number, budget: number): string;
/** Options for subagent execution */
export interface ExecutorOptions {
    cwd: string;
    /** Additional workspace directories to seed on the subagent session (multi-root). */
    additionalDirectories?: string[];
    /** Exact provider credential resolver inherited from the parent session. */
    getApiKey?: CreateAgentSessionOptions["getApiKey"];
    worktree?: string;
    agent: AgentDefinition;
    task: string;
    assignment?: string;
    /** Shared background from the task call (`task.batch`), rendered into the subagent's system prompt. */
    context?: string;
    /**
     * The session's active overall plan, handed off so subagents spawned during
     * plan execution share the same plan context as the main agent. Omitted when
     * the session did not start with a plan (or while plan mode is still active).
     */
    planReference?: {
        path: string;
        content: string;
    };
    /** Pre-set UI label (e.g. eval bridge label). When absent, a tiny-model label is generated from the assignment. */
    description?: string;
    index: number;
    id: string;
    parentToolCallId?: string;
    /**
     * Spawn runs as a detached background job (parent turn not blocked on it).
     * Rides the subagent lifecycle/progress payloads so HUD-style surfaces can
     * skip spawns the transcript already renders inline. See
     * {@link SubagentLifecyclePayload.detached}.
     */
    detached?: boolean;
    modelOverride?: string | string[];
    /** Explicit pre-expansion model role alias selected for this run. */
    modelRole?: string;
    /**
     * Active model selector of the parent session, used as an auth-aware fallback
     * if the resolved subagent model has no working credentials. See #985.
     */
    parentActiveModelPattern?: string;
    thinkingLevel?: ConfiguredThinkingLevel;
    /** Caller-requested coarse effort (`lo`/`med`/`hi`); maps onto the resolved model's supported thinking range and wins over {@link thinkingLevel}. */
    effort?: TaskEffort;
    /** Schema used to validate the final structured completion. */
    outputSchema?: unknown;
    /** Enforcement policy for {@link outputSchema}; defaults to legacy permissive behavior. */
    outputSchemaMode?: StructuredSubagentSchemaMode;
    /** Origin of the selected schema, preserved in {@link SingleResult.structuredOutput}. */
    outputSchemaSource?: StructuredSubagentSchemaSource;
    /**
     * Caller supplied a schema that supersedes the agent's native output prompt.
     * Eval `agent(..., schema=...)` sets this so built-in agents ignore stale yield labels.
     */
    outputSchemaOverridesAgent?: boolean;
    /** Parent task recursion depth (0 = top-level, 1 = first child, etc.) */
    taskDepth?: number;
    /**
     * Override the `task.maxRuntimeMs` wall-clock cap for this run. When provided
     * it wins over the settings value; `0` disables the per-subagent wall-clock
     * limit entirely. Used by the eval `agent()` bridge, whose parent cell
     * watchdog is already suspended for the call's duration.
     */
    maxRuntimeMs?: number;
    /** Include IRC only when the invocation policy permits collaboration. */
    enableIrc?: boolean;
    enableLsp?: boolean;
    /**
     * Enable MCP capabilities for this child. `false` suppresses both inherited
     * MCP proxy tools and session MCP discovery; it never consults the
     * process-global MCP manager. Defaults to `true`.
     */
    enableMCP?: boolean;
    /**
     * Limit the child to its explicit host tool names and the required yield
     * tool, suppressing discovered and always-included capabilities.
     */
    restrictToolNames?: boolean;
    signal?: AbortSignal;
    onProgress?: (progress: AgentProgress) => void;
    /**
     * Epochs (ms, `Date.now()`) bracketing the concurrency-semaphore wait:
     * `invokedAt` is stamped at the spawn boundary before `acquire()`,
     * `acquiredAt` immediately after. {@link runSubprocess} reports true queue
     * wait (`acquiredAt - invokedAt`) and pre-run setup (`startTime - acquiredAt`)
     * separately in the launch-timing debug log. Undefined for callers that
     * bypass the semaphore path.
     */
    invokedAt?: number;
    acquiredAt?: number;
    sessionFile?: string | null;
    persistArtifacts?: boolean;
    artifactsDir?: string;
    eventBus?: EventBus;
    contextFiles?: ContextFileEntry[];
    skills?: Skill[];
    promptTemplates?: PromptTemplate[];
    workspaceTree?: WorkspaceTree;
    /** Parent-discovered rules, forwarded to skip rule discovery in the subagent. */
    rules?: Rule[];
    /**
     * Parent's discovered extension source paths. Forwarded to skip the
     * extension FS scan in the subagent; the subagent then re-binds each
     * extension against its own `ExtensionAPI` (cwd, eventBus, runtime).
     */
    preloadedExtensionPaths?: string[];
    /**
     * Parent's discovered custom-tool source paths. Forwarded to skip the
     * `.omp/tools/` FS scan in the subagent; the subagent then re-binds each
     * tool against its own `CustomToolAPI` (cwd, exec, pushPendingAction, UI).
     */
    preloadedCustomToolPaths?: ToolPathWithSource[];
    mcpManager?: MCPManager;
    authStorage?: AuthStorage;
    modelRegistry?: ModelRegistry;
    settings?: Settings;
    /**
     * Parent session's live per-family service tiers, the source of truth for a
     * subagent whose `tier.subagent` is `"inherit"`. `null` = the parent
     * explicitly has no tier (e.g. `/fast off`); omitted = no live session, so
     * inherit falls back to the subagent's configured `tier.*` settings.
     */
    parentServiceTier?: ServiceTierByFamily | null;
    /** Override local:// protocol options so subagent shares parent's local:// root */
    localProtocolOptions?: LocalProtocolOptions;
    /**
     * Parent session's ArtifactManager. Subagent adopts it so artifact IDs are
     * unique across the whole agent tree and all artifacts land in the parent's
     * artifacts directory (no per-subagent subdir).
     */
    parentArtifactManager?: ArtifactManager;
    parentHindsightSessionState?: HindsightSessionState;
    parentMnemopiSessionState?: MnemopiSessionState;
    /** Parent agent's eval executor session id. Subagents reuse it so eval state is shared. */
    parentEvalSessionId?: string;
    /**
     * Parent agent's OpenTelemetry configuration. When defined, the subagent's
     * loop is started with the same tracer/hooks but its own agent identity
     * stamped, so its `invoke_agent` / `chat` / `execute_tool` spans appear as
     * a sub-tree under the parent's active `execute_tool task` span. A
     * `handoff` span is emitted on dispatch to mark the parent → subagent
     * transition explicitly.
     */
    parentTelemetry?: AgentTelemetryConfig;
    /** Skills to autoload via sendCustomMessage before the first prompt */
    autoloadSkills?: Skill[];
    /**
     * Registry id of the spawning agent, recorded as this subagent's parent.
     * Forwarded verbatim to the SDK; the executor never derives it (the spawner
     * passes its own `getAgentId()`).
     */
    parentAgentId?: string;
    /**
     * Keep the finished subagent addressable in the registry for IRC/revival.
     * Defaults to true. Eval bridge agents are programmatic one-shot helpers and
     * set this false so disposal unregisters them instead of leaving idle peers.
     */
    keepAlive?: boolean;
    /** Internal ownership handoff for cleanup that outlives the visible Task result. */
    onCleanupDeferred?: (completion: Promise<void>) => void;
    /** Internal cleanup grace override for deterministic lifecycle tests. */
    cleanupGraceMs?: number;
}
interface FinalizeSubprocessOutputArgs {
    rawOutput: string;
    exitCode: number;
    stderr: string;
    doneAborted: boolean;
    signalAborted: boolean;
    yieldItems?: YieldItem[];
    outputSchema: unknown;
    outputSchemaMode?: StructuredSubagentSchemaMode;
    outputSchemaSource?: StructuredSubagentSchemaSource;
    lastAssistantText?: string;
}
interface FinalizeSubprocessOutputResult {
    rawOutput: string;
    exitCode: number;
    stderr: string;
    abortedViaYield: boolean;
    hasYield: boolean;
    structuredOutput?: StructuredSubagentOutput;
}
export declare const SUBAGENT_WARNING_SCHEMA_OVERRIDDEN = "SYSTEM WARNING: Subagent exhausted schema-retry budget; result was accepted despite failing the output schema.";
export declare const SUBAGENT_WARNING_NULL_YIELD = "SYSTEM WARNING: Subagent called yield with null data.";
export declare const SUBAGENT_WARNING_MISSING_YIELD = "SYSTEM WARNING: Subagent exited without calling yield tool after 3 reminders.";
export declare function finalizeSubprocessOutput(args: FinalizeSubprocessOutputArgs): FinalizeSubprocessOutputResult;
/**
 * Create proxy tools that reuse the parent's MCP connections.
 *
 * Each proxy delegates to the current source `MCPTool`/`DeferredMCPTool` rather
 * than rebuilding a raw `tools/call` request, so the Task/subagent path shares
 * the source tool's authoritative outbound boundary: harness-intent (`i`)
 * stripping, optional-placeholder pruning, local-URL resolution, reconnect
 * retry, abort handling, and result/provider metadata. The source tool is
 * re-resolved on every call by raw MCP server/tool metadata (not the normalized
 * display name), so a reconnect that swaps the instance in `getTools()` is
 * always honored. The proxy adds only the Task-specific 60s call timeout,
 * combining its abort signal with the caller's around source execution.
 */
export declare function createMCPProxyTools(mcpManager: MCPManager): CustomTool[];
export declare function createSubagentSettings(baseSettings: Settings, overrides?: Partial<Record<SettingPath, unknown>>, inheritedServiceTier?: ServiceTierByFamily | null): Settings;
export type AbortReason = "signal" | "shutdown" | "terminate" | "timeout" | "budget";
/** Inputs for {@link attachIrcWakeTurnMonitor}. */
export interface IrcWakeTurnMonitorOptions {
    /** Registry id of the kept-alive subagent whose autonomous IRC wake turns are monitored. */
    id: string;
    index?: number;
    agent: AgentDefinition;
    description?: string;
    modelOverride?: string | string[];
    /** Explicit pre-expansion model role alias selected for this run. */
    modelRole?: string;
    eventBus?: EventBus;
    parentToolCallId?: string;
    /** Fallback session file when the registry ref carries none. */
    sessionFile?: string;
    maxRuntimeMs?: number;
    outputSchema?: unknown;
    outputSchemaMode?: StructuredSubagentSchemaMode;
    outputSchemaSource?: StructuredSubagentSchemaSource;
    artifactsDir?: string;
}
/**
 * Bracket a kept-alive subagent's autonomous IRC wake turns with a task run
 * monitor so RPC/collab subscribers see the same `subagent_lifecycle` /
 * `subagent_progress` frames a first run emits. Shared by the live executor
 * reviver and the persisted cold-revive path so a resumed process's parked
 * subagents are not blind spots. The observer runs after the session has
 * flushed its post-prompt settle (see {@link AgentSession.setIrcWakeTurnObserver}).
 */
export declare function attachIrcWakeTurnMonitor(session: AgentSession, options: IrcWakeTurnMonitorOptions): void;
/**
 * Settle a subagent's registry lifecycle after a run: terminal teardown for
 * hard aborts, unregister for one-shot helpers, park for isolated runs, and
 * idle + lifecycle adoption for kept-alive agents. A soft-budget abort on a
 * kept-alive, revivable agent is treated as a self-inflicted stop rather than
 * a kill — the agent stays interrogable and resumable (irc wake / revival).
 */
export declare function finalizeSubagentLifecycle(args: {
    id: string;
    session: AgentSession;
    aborted: boolean;
    /** Which watchdog (if any) requested the abort; decides revivability. */
    abortKind?: AbortReason;
    keepAlive: boolean;
    isolated: boolean;
    agentIdleTtlMs: number;
    reviveSession: AgentReviver | null;
    cleanupDeadlineAt?: number;
    onCleanupDeferred?: (completion: Promise<void>) => void;
}): Promise<void>;
/** Options for {@link runSubagentFollowUpTurn}. */
export interface FollowUpTurnOptions {
    /** Registry id of the (live or parked) subagent to continue. */
    id: string;
    /** Agent definition the session was originally spawned with (drives progress labels + finalize). */
    agent: AgentDefinition;
    /** The follow-up message; sent as the turn's user prompt. */
    message: string;
    index?: number;
    description?: string;
    /** Explicit pre-expansion model role alias retained from the original run. */
    modelRole?: string;
    /** Structured-output state retained from the original invocation. */
    outputSchema?: unknown;
    outputSchemaMode?: StructuredSubagentSchemaMode;
    outputSchemaSource?: StructuredSubagentSchemaSource;
    signal?: AbortSignal;
    onProgress?: (progress: AgentProgress) => void;
    eventBus?: EventBus;
    parentToolCallId?: string;
    /** When set, the turn's raw output is (re)written to `<artifactsDir>/<id>.md` so `agent://<id>` tracks the latest turn. */
    artifactsDir?: string;
    /** Wall-clock cap in ms for this turn; 0 disables. */
    maxRuntimeMs?: number;
}
/**
 * Continue a previously spawned (keep-alive) subagent with one more monitored
 * turn: revive it if parked, send `message` as a real prompt, drive it to
 * `yield`, and finalize a {@link SingleResult} exactly like a first run.
 *
 * The session's full conversation history is retained (live session, or JSONL
 * replay through the lifecycle reviver), so the turn sees all prior context.
 * Unlike {@link runSubprocess}, the session is NOT torn down afterwards — it
 * stays adopted by the {@link AgentLifecycleManager} (idle → TTL park →
 * revive), and an aborted turn only aborts the in-flight turn.
 */
export declare function runSubagentFollowUpTurn(options: FollowUpTurnOptions): Promise<SingleResult>;
/**
 * Run a single agent in-process.
 */
export declare function runSubprocess(options: ExecutorOptions): Promise<SingleResult>;
