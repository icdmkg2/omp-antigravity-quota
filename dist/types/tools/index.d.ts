import type { Clipboard, InMemorySnapshotStore } from "@oh-my-pi/hashline";
import type { AgentOptions, AgentTelemetryConfig, AgentTool, AgentToolContext } from "@oh-my-pi/pi-agent-core";
import type { FetchImpl, ImageContent, Model, ServiceTierByFamily, ToolChoice } from "@oh-my-pi/pi-ai";
import type { AsyncJobManager } from "../async/job-manager.js";
import type { Rule } from "../capability/rule.js";
import type { PromptTemplate } from "../config/prompt-templates.js";
import type { Settings } from "../config/settings.js";
import type { ToolPathWithSource } from "../extensibility/custom-tools/index.js";
import type { Skill } from "../extensibility/skills.js";
import type { GoalModeState, GoalRuntime } from "../goals/index.js";
import type { HindsightSessionState } from "../hindsight/state.js";
import type { LocalProtocolOptions } from "../internal-urls/index.js";
import type { DaemonCompletionNotification } from "../launch/protocol.js";
import type { MCPManager } from "../mcp/index.js";
import type { MnemopiSessionState } from "../mnemopi/state.js";
import type { PlanModeState } from "../plan-mode/state.js";
import type { AgentLifecycleManager } from "../registry/agent-lifecycle.js";
import type { AgentRegistry } from "../registry/agent-registry.js";
import type { ArtifactManager } from "../session/artifacts.js";
import type { ClientBridge } from "../session/client-bridge.js";
import type { CustomMessage } from "../session/messages.js";
import type { UsageStatistics } from "../session/session-entries.js";
import type { SessionManager } from "../session/session-manager.js";
import type { ToolChoiceQueue } from "../session/tool-choice-queue.js";
import type { AgentOutputManager } from "../task/output-manager.js";
import { type StructuredSubagentSchemaMode } from "../task/types.js";
import type { EventBus } from "../utils/event-bus.js";
import { type InspectImageMode } from "../utils/inspect-image-mode.js";
import type { WorkspaceTree } from "../workspace-tree.js";
import { type BuiltinToolName, type HiddenToolName } from "./builtin-names.js";
import { type CheckpointState, type CompletedRewindState } from "./checkpoint.js";
import type { PlanProposalHandler } from "./resolve.js";
import { type TodoPhase } from "./todo.js";
import { type XdevState } from "./xdev.js";
export * from "../edit/index.js";
export * from "../goals/index.js";
export * from "../lsp/index.js";
export * from "../session/streaming-output.js";
export * from "../task/index.js";
export * from "../web/search/index.js";
export * from "./ask.js";
export * from "./ast-edit.js";
export * from "./ast-grep.js";
export * from "./bash.js";
export * from "./browser.js";
export * from "./checkpoint.js";
export * from "./computer.js";
export * from "./computer/supervisor.js";
export * from "./debug.js";
export * from "./essential-tools.js";
export * from "./eval.js";
export * from "./eval-backends.js";
export * from "./file-write-fallback.js";
export * from "./gh.js";
export * from "./glob.js";
export * from "./grep.js";
export * from "./hub/index.js";
export * from "./image-gen.js";
export * from "./inspect-image.js";
export * from "./learn.js";
export * from "./manage-skill.js";
export * from "./memory-edit.js";
export * from "./memory-recall.js";
export * from "./memory-reflect.js";
export * from "./memory-retain.js";
export * from "./read.js";
export * from "./report-tool-issue.js";
export * from "./resolve.js";
export * from "./review.js";
export * from "./security-scan.js";
export * from "./think.js";
export * from "./todo.js";
export * from "./tts.js";
export * from "./vibe.js";
export * from "./write.js";
export * from "./xdev.js";
export * from "./yield.js";
/** Tool type (AgentTool from pi-ai) */
export type Tool = AgentTool<any, any, any>;
export type ContextFileEntry = {
    path: string;
    content: string;
    depth?: number;
};
/** Image attachment handle exposed to tools for user-facing labels such as `Image #1`. */
export type ImageAttachmentEntry = {
    label: string;
    uri: string;
    image: ImageContent;
    /** Existing content-addressed file path containing the original image bytes. */
    sourcePath: string;
};
/**
 * A late LSP diagnostics result that arrived after the edit/write tool already
 * returned. Surfaced to the model and the transcript via
 * {@link ToolSession.queueDeferredDiagnostics}, batched through the session
 * yield queue like background-job results.
 */
export interface DeferredDiagnosticsEntry {
    /** Absolute path the diagnostics belong to (the renderer shortens it). */
    path: string;
    /** One-line severity summary, e.g. "2 errors". */
    summary: string;
    /** Formatted, ready-to-display diagnostic lines. */
    messages: string[];
    /** True when any message is error severity. */
    errored: boolean;
    /**
     * Evaluated at injection time (in the dispatcher's stale check): drop the entry
     * when a newer mutation to the same file has superseded it, so the model never
     * sees diagnostics for stale content.
     */
    isStale(): boolean;
}
/** Session context for tool factories */
export interface ToolSession {
    /** Current working directory */
    cwd: string;
    /** Additional workspace directories beyond cwd (multi-root), forwarded to subagents. */
    additionalDirectories?: string[];
    /** Whether UI is available */
    hasUI: boolean;
    /** Whether `ask` can reach a human. Defaults to `hasUI`. */
    canPromptUser?: boolean;
    /** Whether this session has begun disposal. */
    isDisposed?: () => boolean;
    /**
     * Suppress the spawn specialization/coordination advisory appended to `task`
     * results. Set by internal/programmatic callers (e.g. the commit agent's
     * file-analysis fan-out) whose results are consumed by code — not by a model
     * orchestrating further spawns — so the nudge would only be noise.
     */
    suppressSpawnAdvisory?: boolean;
    /** Optional fetch implementation injected into the URL read pipeline (tests, proxies). Defaults to global fetch. */
    fetch?: FetchImpl;
    /** Provider credential resolver forwarded unchanged to restricted child sessions. */
    getApiKey?: AgentOptions["getApiKey"];
    /** Skip subprocess-kernel availability checks and warmup */
    skipPythonPreflight?: boolean;
    /** Pre-loaded context files (AGENTS.md, etc) */
    contextFiles?: ContextFileEntry[];
    /** Pre-loaded workspace tree (forwarded to subagents to skip re-scanning) */
    workspaceTree?: WorkspaceTree;
    /** Pre-loaded skills */
    skills?: readonly Skill[];
    /** Rediscover live session skills after a tool mutates their backing files. */
    refreshSkills?: () => Promise<void>;
    /** Pre-loaded prompt templates */
    promptTemplates?: PromptTemplate[];
    /** Pre-loaded rules (forwarded to subagents to skip re-discovery). */
    rules?: Rule[];
    /**
     * Pre-discovered extension source paths. Forwarded to subagents so they
     * skip the FS scan but still re-bind extensions to their own session-scoped
     * `ExtensionAPI` (cwd, eventBus, runtime). Inline extension factories
     * (`<inline-N>`) are NOT included — those are session-local.
     */
    extensionPaths?: string[];
    /**
     * Pre-discovered custom-tool source paths from `.omp/tools/`, `.claude/tools/`,
     * plugins, etc. Forwarded to subagents so they skip the FS scan but still
     * re-bind tools to their own session-scoped `CustomToolAPI`.
     */
    customToolPaths?: ToolPathWithSource[];
    /** Whether LSP integrations are enabled */
    enableLsp?: boolean;
    /** Whether LSP is limited to navigation and diagnostics. */
    lspReadOnly?: boolean;
    /** Whether this invocation may expose IRC. `false` removes it even for subagents. */
    enableIrc?: boolean;
    /**
     * Whether MCP capabilities may be forwarded to child sessions. `false`
     * prohibits inherited-manager and process-global MCP fallback.
     */
    enableMCP?: boolean;
    /** Whether an edit-capable tool is available in this session (controls hashline output) */
    hasEditTool?: boolean;
    /** Event bus for tool/extension communication */
    eventBus?: EventBus;
    /** Output schema for structured completion (subagents). */
    outputSchema?: unknown;
    /** Enforcement policy for {@link outputSchema}; defaults to legacy permissive behavior. */
    outputSchemaMode?: StructuredSubagentSchemaMode;
    /** Whether to include the yield tool by default */
    requireYieldTool?: boolean;
    /** Session starts with a prewalk hand-off armed. Keeps `todo` in yield-gated
     *  (subagent) registries: the prewalk plan nudge + todo gate need it. */
    prewalkArmed?: boolean;
    /**
     * Constrain the active set to the caller's explicit built-in names (plus a
     * required yield tool). Suppresses automatic tool-set expansion.
     */
    restrictToolNames?: boolean;
    /** Task recursion depth (0 = top-level, 1 = first child, etc.) */
    taskDepth?: number;
    /** Get shared eval executor session ID. Subagents inherit this to share JS/Python/Ruby/Julia state. */
    getEvalSessionId?: () => string | null;
    /** Get session file */
    getSessionFile: () => string | null;
    /** Parent session journal used by tools that persist runtime lifecycle state. */
    sessionManager?: Pick<SessionManager, "appendCustomEntry" | "ensureOnDisk" | "flush" | "getBranch" | "getEntries">;
    /** Get eval kernel owner ID for session-scoped retained-kernel cleanup. */
    getEvalKernelOwnerId?: () => string | null;
    /** Reject new eval work once session disposal has started. */
    assertEvalExecutionAllowed?: () => void;
    /** Track tool-owned eval work so session disposal can await/abort it like direct session eval runs. */
    trackEvalExecution?<T>(execution: Promise<T>, abortController: AbortController): Promise<T>;
    /** Get session ID */
    getSessionId?: () => string | null;
    /** Get Hindsight runtime state for this agent session. */
    getHindsightSessionState?: () => HindsightSessionState | undefined;
    /** Get Mnemopi runtime state for this agent session. */
    getMnemopiSessionState?: () => MnemopiSessionState | undefined;
    /** Agent identity used for IRC routing. Returns the registry id (e.g. "Main", "AuthLoader"). */
    getAgentId?: () => string | null;
    /** Look up a registered tool by name (used by the eval js backend's tool bridge). */
    getToolByName?: (name: string) => AgentTool | undefined;
    /** Look up an enabled tool through the eval bridge's normal permission pipeline. */
    getToolForEvalBridge?: (name: string) => AgentTool | undefined;
    /** Current session context for eval-bridged tool execution. */
    getToolContext?: () => AgentToolContext | undefined;
    /** Names currently authorized for invocation through the eval bridge. */
    getEvalBridgeToolNames?: () => readonly string[];
    /** Direct partition of the active Code Mode surface; undefined when Code Mode is inactive. */
    getCodeModeDirectToolNames?: () => readonly string[] | undefined;
    /** Return whether a built-in tool is active in this turn's tool set. */
    isToolActive?: (name: string) => boolean;
    /** Update the active built-in tool predicate when a session changes tools mid-run. */
    setActiveToolNames?: (names: Iterable<string>) => void;
    /** Canonical map containing every registered tool exactly once. */
    toolRegistry?: Map<string, Tool>;
    /** `xd://` presentation state backed by {@link toolRegistry}. */
    xdev?: XdevState;
    /** Agent registry for IRC routing across live sessions. */
    agentRegistry?: AgentRegistry;
    /** Idle→parked→revive lifecycle owner; lets the hub kill a non-job-backed agent registration. Default: AgentLifecycleManager.global(). */
    agentLifecycle?: () => AgentLifecycleManager;
    /** Get artifacts directory for artifact:// URLs */
    getArtifactsDir?: () => string | null;
    /** Get the ArtifactManager backing this session (shared across parent + subagents). */
    getArtifactManager?: () => ArtifactManager | null;
    /** Allocate a new artifact path and ID for session-scoped truncated output. */
    allocateOutputArtifact?: (toolType: string) => Promise<{
        id?: string;
        path?: string;
    }>;
    /** Get session spawns */
    getSessionSpawns: () => string | null;
    /** Get resolved model string if explicitly set for this session */
    getModelString?: () => string | undefined;
    /** Get the current session model string, regardless of how it was chosen */
    getActiveModelString?: () => string | undefined;
    /** Get the current session model object (provider/api capabilities), regardless of how it was chosen. */
    getActiveModel?: () => Model | undefined;
    /** Session-scoped inspect_image mode override set by `/vision`; wins over the persisted setting. */
    getInspectImageModeOverride?: () => InspectImageMode | undefined;
    /** Get the session's live per-family service tiers (undefined = none). Source of truth for subagent `tier.subagent: inherit`. */
    getServiceTierByFamily?: () => ServiceTierByFamily | undefined;
    /** Auth storage for passing to subagents (avoids re-discovery) */
    authStorage?: import("../session/auth-storage.js").AuthStorage;
    /** Model registry for passing to subagents (avoids re-discovery) */
    modelRegistry?: import("../config/model-registry.js").ModelRegistry;
    /** Agent output manager for unique agent:// IDs across task invocations */
    agentOutputManager?: AgentOutputManager;
    /**
     * Async job manager scoped to this session.
     *
     * - Top-level session that constructed one: its own manager.
     * - Subagent (`parentTaskPrefix` set): the parent's manager, so background
     *   bash/task work and `onJobComplete` deliveries flow into the conversation
     *   that spawned it.
     * - Secondary in-process top-level session that found a singleton already
     *   installed (issue #1923): `undefined`. Tools refuse async work rather
     *   than silently route completions into the owning session's `yieldQueue`.
     *
     * Tools MUST use this instead of `AsyncJobManager.instance()` so a secondary
     * session never borrows the owning session's manager by accident.
     */
    asyncJobManager?: AsyncJobManager;
    /** MCP manager visible to subagents without relying on the process-global singleton. */
    mcpManager?: MCPManager;
    /** Local protocol root to propagate to nested subagents and eval-created agents. */
    localProtocolOptions?: LocalProtocolOptions;
    /** Settings instance for passing to subagents */
    settings: Settings;
    /** Plan mode state (if active) */
    getPlanModeState?: () => PlanModeState | undefined;
    /** Path of the session's active plan reference (e.g. `local://<title>.md`); defaults to `local://PLAN.md`. */
    getPlanReferencePath?: () => string;
    /** Goal mode state (if active or paused) */
    getGoalModeState?: () => GoalModeState | undefined;
    /** Goal runtime for the active agent session. */
    getGoalRuntime?: () => GoalRuntime | undefined;
    /** Get cumulative session usage statistics (input/output tokens, cost). */
    getUsageStatistics?: () => UsageStatistics;
    /** Current per-turn token budget {total, spent, hard} for the eval `budget` helper. */
    getTurnBudget?: () => {
        total: number | null;
        spent: number;
        hard: boolean;
    };
    /** Record output tokens consumed by an eval-spawned subagent toward the current turn budget. */
    recordEvalSubagentUsage?: (output: number) => void;
    /** Bridge to the connected client (e.g. ACP editor host). Tools should route fs/terminal/permission requests through this when available. */
    getClientBridge?: () => ClientBridge | undefined;
    /** Get cached todo phases for this session. */
    getTodoPhases?: () => TodoPhase[];
    /** Replace cached todo phases for this session. */
    setTodoPhases?: (phases: TodoPhase[]) => void;
    /** The tool-choice queue used to force forthcoming tool invocations and carry invocation handlers. */
    getToolChoiceQueue?(): ToolChoiceQueue;
    /** Build a model-provider-specific ToolChoice that targets the named tool, or undefined if unsupported. */
    buildToolChoice?(toolName: string): ToolChoice | undefined;
    /** Steer a hidden custom message into the conversation (e.g. a preview reminder). */
    steer?(message: {
        customType: string;
        content: string;
        details?: unknown;
    }): void;
    /** Peek the currently in-flight tool-choice queue directive's invocation handler. Used by
     *  the `xd://resolve` and `xd://reject` dispatch to reach the pending action. */
    peekQueueInvoker?(): ((input: unknown) => Promise<unknown> | unknown) | undefined;
    /** Peek the most-recently registered non-forcing pending preview invoker. A `write` to
     *  `xd://resolve` or `xd://reject` dispatches to it so a staged preview resolves
     *  WITHOUT forcing tool_choice — the agent-loop's SoftToolRequirement lifecycle owns
     *  reminder injection and escalation. */
    peekPendingInvoker?(): ((input: unknown) => Promise<unknown> | unknown) | undefined;
    /** Clear stale pending preview markers when a resolution dispatch cannot run them. */
    clearPendingInvokers?(): void;
    /** Peek the plan-proposal handler installed by plan mode. `xd://propose` dispatches the
     *  written plan title to it. */
    peekPlanProposalHandler?(): PlanProposalHandler | undefined;
    /** Register or clear the plan-proposal handler. Passing `null` clears it. */
    setPlanProposalHandler?(handler: PlanProposalHandler | null): void;
    /** Get active checkpoint state if any. */
    getCheckpointState?: () => CheckpointState | undefined;
    /** Set or clear active checkpoint state. */
    setCheckpointState?: (state: CheckpointState | null) => void;
    /** Get the most recent completed rewind, if this session just rewound a checkpoint. */
    getLastCompletedRewind?: () => CompletedRewindState | undefined;
    /** Per-session snapshot store of file contents as last shown to the model
     *  by `read`/`search`. Used by hashline anchor-stale recovery to
     *  reconstruct the version the model authored anchors against when the
     *  file changed out-of-band. Lazily initialized by `getFileSnapshotStore`. */
    fileSnapshotStore?: InMemorySnapshotStore;
    /** Per-session `CUT`/`PASTE` clipboard register shared across edit
     *  calls. Lazily initialized by `getEditClipboard`. */
    editClipboard?: Clipboard;
    /** Per-session log of unresolved git merge conflict regions surfaced by
     *  `read`. Each entry gets a stable id N referenced by `write conflict://N`
     *  to splice the recorded region with replacement content. Lazily initialized
     *  by `getConflictHistory`. */
    conflictHistory?: import("./conflict-detect.js").ConflictHistory;
    /** Per-session ledger of post-edit LSP diagnostics already surfaced to the
     *  model for each file. Lazily initialized by `getDiagnosticsLedger`. */
    diagnosticsLedger?: import("../lsp/diagnostics-ledger.js").DiagnosticsLedger;
    /** Per-session ledger of consecutive byte-identical no-op edits, keyed by
     *  canonical file path. The hashline executor escalates a soft no-op hint
     *  to a thrown error once the same payload no-ops `NOOP_HARD_LIMIT` times,
     *  breaking subagent loops that ignore the textual hint (issue #2081).
     *  Lazily initialized by `getNoopLoopGuard`. */
    noopLoopGuard?: import("../edit/hashline/noop-loop-guard.js").NoopLoopGuard;
    /** Queue a hidden message to be injected at the next agent turn. */
    queueDeferredMessage?(message: CustomMessage): void;
    /** Queue a broker supervised-process completion for the owning session. */
    queueLaunchCompletion?(notification: DaemonCompletionNotification): Promise<void>;
    /** Register cleanup that runs when this session is disposed; returns a handle that removes the cleanup. */
    registerDisposeCallback?(callback: () => void): (() => void) | void;
    /** Register cleanup that runs when this ToolSession adopts a different session ID. */
    registerSessionChangeCallback?(callback: () => void): (() => void) | void;
    /** Queue late LSP diagnostics (arrived after an edit/write returned) to be shown
     *  in the transcript and delivered to the model at the next yield, like background
     *  job results. */
    queueDeferredDiagnostics?(entry: DeferredDiagnosticsEntry): void;
    /** Bump and return the session-global mutation counter for `path`. Edit/write
     *  tools call this on every file mutation so stale late-diagnostics can be dropped. */
    bumpFileMutationVersion?(path: string): number;
    /** Read the current session-global mutation counter for `path` (0 if never mutated). */
    getFileMutationVersion?(path: string): number;
    /** Get the active OpenTelemetry config so subagent dispatch can forward
     *  the parent's tracer/hooks with the subagent's own identity stamped. */
    getTelemetry?: () => AgentTelemetryConfig | undefined;
    /** Return image attachments visible to tools for resolving labels such as `Image #1`. */
    getImageAttachments?: () => ImageAttachmentEntry[];
}
export type ToolFactory = (session: ToolSession) => Tool | null | Promise<Tool | null>;
/**
 * Public callable factory map. External callers may invoke `BUILTIN_TOOLS.read(session)` or
 * `BUILTIN_TOOLS[name](session)` to construct a tool directly.
 */
export declare const BUILTIN_TOOLS: Record<BuiltinToolName, ToolFactory>;
export declare const HIDDEN_TOOLS: Record<HiddenToolName, ToolFactory>;
export type ToolName = BuiltinToolName;
/**
 * Create tools from BUILTIN_TOOLS registry.
 */
export declare function createTools(session: ToolSession, toolNames?: string[]): Promise<Tool[]>;
