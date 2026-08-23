/**
 * AgentSession - Core abstraction for agent lifecycle and session management.
 *
 * This class is shared between all run modes (interactive, print, rpc).
 * It encapsulates:
 * - Agent state access
 * - Event subscription with automatic session persistence
 * - Model and thinking level management
 * - Compaction (manual and auto)
 * - Bash execution
 * - Session switching and branching
 *
 * Modes use this class and add their own I/O layer on top.
 */
import type { Clipboard, InMemorySnapshotStore } from "@oh-my-pi/hashline";
import { type Agent, type AgentMessage, type AgentState, type AgentTool, type AgentToolContext, type AgentToolResult, type ThinkingLevel, type ToolChoiceDirective } from "@oh-my-pi/pi-agent-core";
import { type CompactionResult, type ShakeConfig } from "@oh-my-pi/pi-agent-core/compaction";
import type { AssistantMessage, ImageContent, Message, Model, ProviderSessionState, ResetCreditAccountStatus, ResetCreditRedeemOutcome, ResetCreditTarget, ServiceTier, ServiceTierByFamily, ServiceTierFamily, SimpleStreamOptions, TextContent, UsageReport } from "@oh-my-pi/pi-ai";
import { type Effort } from "@oh-my-pi/pi-ai";
import { type AdvisorConfig, type AdvisorRuntimeStatus } from "../advisor/index.js";
import { AsyncJobManager } from "../async/index.js";
import type { ModelRegistry } from "../config/model-registry.js";
import type { ResolvedModelRoleValue } from "../config/model-resolver.js";
import { type PromptTemplate } from "../config/prompt-templates.js";
import type { Settings, SkillsSettings } from "../config/settings.js";
import { RawSseDebugBuffer } from "../debug/raw-sse-buffer.js";
import type { PythonResult } from "../eval/py/executor.js";
import type { BashResult } from "../exec/bash-executor.js";
import type { TtsrManager } from "../export/ttsr.js";
import type { LoadedCustomCommand } from "../extensibility/custom-commands/index.js";
import type { CustomTool } from "../extensibility/custom-tools/types.js";
import type { ExtensionRunner, ExtensionUIContext, ToolInfo } from "../extensibility/extensions/index.js";
import type { CompactOptions, ContextUsage } from "../extensibility/extensions/types.js";
import type { Skill, SkillWarning } from "../extensibility/skills.js";
import { type FileSlashCommand } from "../extensibility/slash-commands.js";
import { GoalRuntime } from "../goals/runtime.js";
import type { GoalModeState } from "../goals/state.js";
import type { HindsightSessionState } from "../hindsight/state.js";
import type { IrcMessage } from "../irc/bus.js";
import type { DaemonCompletionNotification } from "../launch/protocol.js";
import { type MnemopiSessionState } from "../mnemopi/state.js";
import { type PlanApprovalDetails } from "../plan-mode/approved-plan.js";
import type { PlanModeState } from "../plan-mode/state.js";
import type { SecretObfuscator } from "../secrets/obfuscator.js";
import { type ConfiguredThinkingLevel } from "../thinking.js";
import type { ImageAttachmentEntry } from "../tools/index.js";
import { type AskToolDetails, type AskToolInput } from "../tools/ask.js";
import type { CheckpointState, CompletedRewindState } from "../tools/checkpoint.js";
import { type PlanProposalHandler } from "../tools/resolve.js";
import type { TodoPhase } from "../tools/todo.js";
import type { InspectImageMode } from "../utils/inspect-image-mode.js";
import type { VibeModeState } from "../vibe/state.js";
import type { AgentSessionEventListener } from "./agent-session-events.js";
import type { AgentSessionConfig, AgentSessionDisposeOptions, AsyncJobSnapshot, CommandMetadataChangedListener, ContextUsageBreakdown, DroppedPrompt, FollowUpOptions, FreshSessionResult, HandoffResult, ModelCycleResult, Prewalk, PromptOptions, ResetSessionContextResult, ResolvedRoleModel, RestoredQueuedMessage, RoleModelCycle, RoleModelCycleResult, SessionHandoffOptions, SessionOAuthAccountList, SessionStats, UsageFallbackConfirmer } from "./agent-session-types.js";
import type { ClientBridge } from "./client-bridge.js";
import { type CustomMessage, type CustomMessagePayload } from "./messages.js";
import type { ServingModel } from "./retry-fallback-chains.js";
import { type AdvisorStats } from "./session-advisors.js";
import type { BuildSessionContextOptions, SessionContext } from "./session-context.js";
import type { BranchSummaryEntry, NewSessionOptions } from "./session-entries.js";
import { type SessionManager } from "./session-manager.js";
import type { ShakeMode, ShakeResult } from "./shake-types.js";
import { ToolChoiceQueue } from "./tool-choice-queue.js";
import { YieldQueue } from "./yield-queue.js";
export * from "./agent-session-events.js";
export * from "./agent-session-types.js";
export type { AdvisorStats, PerAdvisorStat } from "./session-advisors.js";
type SessionNameTrigger = "replan";
export declare class AgentSession {
    #private;
    readonly agent: Agent;
    readonly sessionManager: SessionManager;
    readonly settings: Settings;
    /** Entries of tools mounted under `xd://`; empty when virtual devices are unmounted. */
    getXdevToolEntries: () => Array<{
        name: string;
        summary: string;
    }>;
    readonly yieldQueue: YieldQueue;
    fileSnapshotStore?: InMemorySnapshotStore;
    /** Per-session `CUT`/`PASTE` clipboard register shared across edit calls. */
    editClipboard?: Clipboard;
    readonly configWarnings: string[];
    readonly rawSseDebugBuffer: RawSseDebugBuffer;
    /**
     * Arm prewalk outside the normal startup path so an explicit slash command starts immediately.
     */
    armPrewalk(target: Model, thinkingLevel?: ConfiguredThinkingLevel): boolean;
    /** Validate the active plan artifact and shape an `xd://propose` result for review-mode hosts. */
    preparePlanForReview(title: string): Promise<AgentToolResult<PlanApprovalDetails>>;
    constructor(config: AgentSessionConfig);
    /** Model registry for API key resolution and model discovery */
    get modelRegistry(): ModelRegistry;
    get asyncJobManager(): AsyncJobManager | undefined;
    getAgentId(): string | undefined;
    /**
     * The per-turn tool-choice directive for the agent loop's `getToolChoice`. Priority:
     *   1. a HARD forced choice from the queue (genuine forces: user-force, eager-todo, …) —
     *      consuming (advances the queue generator);
     *   2. else, when a non-forcing preview is pending, a {@link SoftToolRequirement} — a
     *      PEEK (advances/pops nothing), so the agent-loop injects the reminder once per head
     *      and escalates to a forced `write` only if the model declines to
     *      resolve via `xd://resolve` or `xd://reject`. A compliant turn
     *      pays ZERO tool_choice change (no prompt-cache messages-cache invalidation);
     *   3. else undefined.
     */
    nextToolChoiceDirective(): ToolChoiceDirective | undefined;
    /** Peek the head non-forcing pending preview invoker, for the preview-resolution dispatch. */
    peekPendingInvoker(): ((input: unknown) => Promise<unknown> | unknown) | undefined;
    /** Clear stale non-forcing pending preview invokers after a resolve dispatch proves none can run. */
    clearPendingInvokers(): void;
    /**
     * Force the next model call to target a specific active tool, then terminate
     * the agent loop. Pushes a two-step sequence [forced, "none"] so the model
     * calls exactly the forced tool once and then cannot call another.
     */
    setForcedToolChoice(toolName: string): void;
    /** The tool-choice queue: forces forthcoming tool invocations and carries handlers. */
    get toolChoiceQueue(): ToolChoiceQueue;
    /** Peek the in-flight directive's invocation handler for the preview-resolution dispatch. */
    peekQueueInvoker(): ((input: unknown) => Promise<unknown> | unknown) | undefined;
    peekPlanProposalHandler(): PlanProposalHandler | undefined;
    setPlanProposalHandler(handler: PlanProposalHandler | null): void;
    setSessionBeforeSwitchReconciler(reconciler: (() => Promise<void>) | null): void;
    setSessionSwitchReconciler(reconciler: (() => Promise<void>) | null): void;
    /** Provider-scoped mutable state store for transport/session caches. */
    get providerSessionState(): Map<string, ProviderSessionState>;
    /** Hint forwarded to provider calls that support websocket transport. */
    get preferWebsockets(): boolean | undefined;
    getHindsightSessionState(): HindsightSessionState | undefined;
    setHindsightSessionState(state: HindsightSessionState | undefined): HindsightSessionState | undefined;
    getMnemopiSessionState(): MnemopiSessionState | undefined;
    /** TTSR manager for time-traveling stream rules */
    get ttsrManager(): TtsrManager | undefined;
    /** Secret obfuscator, when secrets are configured; /share redaction reuses it. */
    get obfuscator(): SecretObfuscator | undefined;
    /** Whether a TTSR abort is pending (stream was aborted to inject rules) */
    get isTtsrAbortPending(): boolean;
    /** Whether an expected internal plan-mode abort is pending. Consumed by
     *  `#handleAgentEvent` to stamp `SILENT_ABORT_MARKER` on the next aborted
     *  assistant message_end; callers clear it in `finally`. */
    get isPlanInternalAbortPending(): boolean;
    /** Arm the silent-abort marker for the next aborted assistant message_end.
     *  Caller MUST clear via `clearPlanInternalAbortPending()` in a `finally`
     *  to guarantee no leak. */
    markPlanInternalAbortPending(): void;
    /** Unconditionally clear the silent-abort flag. Idempotent: safe when the
     *  flag was never set OR was already consumed by `#handleAgentEvent`. */
    clearPlanInternalAbortPending(): void;
    getAsyncJobSnapshot(options?: {
        recentLimit?: number;
    }): AsyncJobSnapshot | null;
    /**
     * Public view of the pending-async-wake state for run drivers: true while
     * owner-scoped async work can still re-wake this session's run (a running
     * background job with an unsuppressed delivery, or a queued / in-flight
     * delivery). The task executor's quiescence barrier polls this to
     * distinguish a scheduling pause from terminal completion.
     */
    hasPendingAsyncWork(): boolean;
    /**
     * Settle one generation of owner-scoped async work: wait for running owner
     * jobs to finish, deliver their queued results (which enqueue async-result
     * follow-ups on this session's yield queue), and wait for the injected
     * follow-up turn(s) to go idle. Callers loop while
     * {@link hasPendingAsyncWork} still holds — a follow-up turn may start new
     * jobs.
     */
    settleAsyncWork(): Promise<void>;
    /**
     * Emit a UI-only notice to the session. Surfaces in interactive mode as a
     * `showWarning` / `showError` / `showStatus` line; non-interactive modes
     * receive the event through the normal subscribe stream.
     *
     * Notices are NOT added to agent state and never reach the LLM — use this
     * for out-of-band conditions the user should see but the model shouldn't
     * react to (e.g. background queue flush failures).
     */
    emitNotice(level: "info" | "warning" | "error", message: string, source?: string): void;
    /**
     * Subscribe to agent events.
     * Session persistence is handled internally (saves messages on message_end).
     * Multiple listeners can be added. Returns unsubscribe function for this listener.
     */
    subscribe(listener: AgentSessionEventListener): () => void;
    /**
     * Observe authoritative run-state transitions before public `agent_end`
     * deferral, for lifecycle owners that must not remain stale while prompts unwind.
     */
    subscribeRunState(listener: (state: "running" | "idle") => void): () => void;
    /** Register cleanup that runs when this AgentSession adopts a different session ID. */
    registerSessionChangeCallback(callback: () => void): () => void;
    subscribeCommandMetadataChanged(listener: CommandMetadataChangedListener): () => void;
    /** Run one abortable auto-learn capture outside the primary agent loop. */
    runAutolearnCapture(capture: (signal: AbortSignal) => Promise<void>): Promise<void>;
    /** True once dispose() has begun; deferred background work (e.g. the deferred
     *  MCP discovery task in sdk.ts) must not touch the session past this point. */
    get isDisposed(): boolean;
    markMovedFromEmptySessionFile(sessionFile: string): void;
    /**
     * Synchronously mark the session as disposing so new work is rejected
     * immediately: eval starts throw, queued asides are dropped, and the
     * aside provider is detached. Idempotent; `dispose()` runs it first.
     *
     * Wrappers that await other teardown before delegating to `dispose()` MUST
     * call this before their first await — otherwise work started in that async
     * gap slips past the disposal guards.
     */
    beginDispose(): void;
    dispose(options?: AgentSessionDisposeOptions): Promise<void>;
    freshSession(): FreshSessionResult | undefined;
    /**
     * Reset the current conversation in place: drop every message, queued turn,
     * and pending tool call from the model's context while keeping the session
     * itself — its id, title, cwd, model, settings, and on-disk transcript all
     * survive. The next turn is sent with only the base system prompt plus the
     * project rules/AGENTS.md.
     *
     * This is the in-place sibling of {@link newSession}: it reuses the same
     * conversation-boundary teardown (drop the conversation, rotate provider-side
     * session state so providers that keep history server-side resume nothing,
     * re-prime the advisors, and undo any memory promotion) but skips minting a
     * new session id and opening a fresh transcript file. Unlike
     * {@link freshSession} (which only rotates provider stream state) it also
     * clears the conversation.
     *
     * Returns `undefined` without mutating anything while a response is
     * streaming or a foreground bash/python execution is in flight.
     */
    resetSessionContext(): Promise<ResetSessionContextResult | undefined>;
    /** Full agent state */
    get state(): AgentState;
    /** Current model (may be undefined if not yet selected) */
    get model(): Model | undefined;
    /**
     * Model this session's produced work is attributed to. Holds the last model
     * that actually served while a fallback is armed but unproven, so observers
     * never credit a run to a candidate that produced nothing.
     */
    get servingModel(): ServingModel | undefined;
    /** Install the interactive decision surface for reserve-triggered model changes. */
    setUsageFallbackConfirmer(confirmer: UsageFallbackConfirmer | undefined): void;
    /** Effective thinking level applied to the agent (the resolved level when `auto`). */
    get thinkingLevel(): ThinkingLevel | undefined;
    /** The selector the user configured: `auto` when auto mode is active, else the effective level. */
    configuredThinkingLevel(): ConfiguredThinkingLevel | undefined;
    /** True when `auto` thinking mode is active. */
    get isAutoThinking(): boolean;
    /** The level `auto` resolved to for the current turn (undefined until classified). */
    autoResolvedThinkingLevel(): Effort | undefined;
    /** Live per-family service tiers (OpenAI / Anthropic / Google). */
    get serviceTierByFamily(): ServiceTierByFamily;
    /** Whether agent is currently streaming a response */
    get isStreaming(): boolean;
    get isAborting(): boolean;
    /** Wait until streaming, event persistence, and deferred recovery work are fully settled. */
    waitForIdle(): Promise<void>;
    /**
     * Prevent advisor notes from starting hidden primary turns while a headless
     * caller prints and drains the final primary response.
     */
    prepareForHeadlessAdvisorDrain(): void;
    /**
     * Wait for active advisor reviews and their emitted card events before a
     * headless caller disposes the session. Returns `false` and logs work disposal
     * will abandon when the shared deadline expires or an advisor fails.
     */
    waitForAdvisorCatchup(timeoutMs: number): Promise<boolean>;
    drainAsyncJobDeliveriesForAcp(options?: {
        timeoutMs?: number;
    }): Promise<boolean>;
    /**
     * Most recent settled assistant message. A classifier-refusal turn pruned
     * from active context at settle is still reported until the next run
     * starts, so terminal-outcome consumers (print mode, task executor) see
     * the refusal error rather than the previous turn — or nothing.
     */
    getLastAssistantMessage(): AssistantMessage | undefined;
    /** Current effective system prompt blocks (includes any per-turn extension modifications) */
    get systemPrompt(): string[];
    /** Marks streamed text as committed or buffered for turn-recovery replay decisions. */
    setTextOutputCommitted(committed: boolean): void;
    /** Current retry attempt (0 if not retrying) */
    get retryAttempt(): number;
    /** Names of tools currently exposed at the top level. */
    getActiveToolNames(): string[];
    /** Enabled top-level and discoverable tool names. */
    getEnabledToolNames(): string[];
    /** Names of dynamic tools mounted under `xd://`. */
    getMountedXdevToolNames(): string[];
    /** Whether the edit tool is registered in this session. */
    get hasEditTool(): boolean;
    /** Looks up a registered tool by name. */
    getToolByName(name: string): AgentTool | undefined;
    /** Looks up an enabled eval-bridge tool with the session's permission gate applied. */
    getToolForEvalBridge(name: string): AgentTool | undefined;
    /** Names currently authorized through the eval bridge. */
    getEvalBridgeToolNames(): string[];
    /** Tools left directly model-visible by Code Mode; undefined when inactive. */
    getCodeModeDirectToolNames(): readonly string[] | undefined;
    /** Whether a registry entry came from a built-in factory. */
    hasBuiltInTool(name: string): boolean;
    /** Updates source provenance when a live registry entry is replaced or restored. */
    setToolBuiltIn(name: string, builtIn: boolean): void;
    /** Whether the live registry entry is owned by the RPC host. */
    hasRpcHostTool(name: string): boolean;
    /** Whether the current MCP entry came from the manager snapshot. */
    hasMCPManagerTool(name: string): boolean;
    /** Restores manager ownership after a lifecycle registration rollback. */
    setMCPManagerTool(name: string, managerOwned: boolean): void;
    /** Current extension-owned MCP entry retained across manager refreshes. */
    getExtensionMCPTool(name: string): AgentTool | undefined;
    /** Updates extension MCP ownership after a lifecycle registration commit or rollback. */
    setExtensionMCPTool(name: string, tool: AgentTool | undefined): void;
    /** Runs a registry/presentation mutation in this session's shared queue. */
    runToolRegistryMutation<T>(mutation: () => Promise<T>, signal?: AbortSignal): Promise<T>;
    /** Names of every registered tool. */
    getAllToolNames(): string[];
    /** Full metadata for every registered tool, including source provenance (backs `getAllTools()`). */
    getAllToolInfos(): ToolInfo[];
    /** Installs and activates the ephemeral vibe tool set. */
    activateVibeTools(baseToolNames: string[]): Promise<void>;
    /** Uninstalls vibe tools and activates the replacement set. */
    deactivateVibeTools(nextToolNames: string[]): Promise<void>;
    /** Removes vibe tools without restoring a source-session snapshot. */
    removeVibeToolsPreservingActive(): Promise<void>;
    /** Enabled MCP tools in their current presentation partition. */
    getSelectedMCPToolNames(): string[];
    /** Rediscovers reloadable skills and refreshes prompt metadata. */
    refreshSkills(): Promise<void>;
    /**
     * Applies Code Mode at session startup: when the initial model activates
     * it (`codeMode` `on`, or `auto` matching a `code_mode_only` catalog flag),
     * the initial tool surface is routed through the Code Mode-aware path so
     * the restricted direct surface and namespaces snapshot exist before the
     * first provider turn instead of waiting for an unrelated reconciliation.
     *
     * Inactive sessions keep their initial surface untouched: re-applying an
     * unchanged set would seed the prompt-rebuild signature cache and suppress
     * the first late tool registration's rebuild (non-MCP `xd://` mounts are
     * deliberately not part of that signature).
     */
    initializeCodeMode(): Promise<void>;
    /** Current Code Mode `tool_namespaces_info` snapshot, or `undefined` when inactive. */
    get codeModeNamespacesInfo(): unknown;
    /** Selects enabled tools, ignoring names absent from the registry. */
    setActiveToolsByName(toolNames: string[]): Promise<void>;
    /** Restores an exact top-level versus `xd://` tool partition. */
    setActiveToolPresentation(toolNames: string[], mountedToolNames: string[], forcePromptRefresh?: boolean, signal?: AbortSignal): Promise<void>;
    /**
     * Session-scoped enable/disable for the settings-gated `computer` tool.
     *
     * Enabling builds the tool through {@link AgentSessionConfig.createComputerTool}
     * on first use and activates it; disabling drops it from the active set while
     * keeping the registry entry so repeated toggles reuse one desktop controller.
     *
     * @returns false when enabling was requested but this session cannot build the
     * tool (e.g. restricted child sessions have no factory).
     */
    setComputerToolEnabled(enabled: boolean): Promise<boolean>;
    /** Applies the external-thinking setting to the private scratchpad tool immediately. */
    setThinkToolEnabled(enabled: boolean): Promise<boolean>;
    /**
     * Session-scoped inspect_image mode (`/vision`). `auto` clears the override
     * and returns to the persisted `inspect_image.mode` setting; `on`/`off`
     * force the tool for this session only. See {@link SessionTools.setInspectImageMode}.
     */
    setInspectImageMode(mode: InspectImageMode): Promise<boolean>;
    /** Effective inspect_image state for `/vision status`. */
    inspectImageState(): {
        mode: InspectImageMode;
        active: boolean;
        model: string | undefined;
    };
    /** Session-scoped `/vision` override; undefined means "follow the persisted setting". */
    getInspectImageModeOverride(): InspectImageMode | undefined;
    /**
     * Reconciles the inspect_image tool set after the persisted
     * `inspect_image.mode` setting changed (e.g. via the settings selector), so
     * the new value takes effect immediately instead of on the next model switch.
     */
    applyInspectImageModeChange(): Promise<boolean>;
    /** Cancels the local rollout-memory startup owned by this session. */
    cancelLocalMemoryStartup(): void;
    /** Starts a new local rollout-memory generation and cancels its predecessor. */
    beginLocalMemoryStartup(): AbortSignal;
    /** Releases the local startup slot if `signal` still owns it. */
    endLocalMemoryStartup(signal: AbortSignal): void;
    /** Applies the selected memory backend to runtime state, tools, and prompt. */
    applyMemoryBackend(): Promise<void>;
    /** Rebuilds the stable base prompt for the current tools and model. */
    refreshBaseSystemPrompt(): Promise<void>;
    /** Replaces connected MCP tools and enables them immediately. */
    refreshMCPTools(mcpTools: CustomTool[]): Promise<void>;
    /** Replaces host-owned RPC tools before the next model call. */
    refreshRpcHostTools(rpcTools: AgentTool[]): Promise<void>;
    /** Whether auto-compaction is currently running */
    get isCompacting(): boolean;
    /** Background speculative-compaction state, for UI indicators. */
    get compactionSpeculation(): "idle" | "running" | "armed";
    /** Strip image content from the current branch and persist the rewrite. */
    dropImages(): Promise<{
        removed: number;
    }>;
    /** Reduce stored context with the selected shake strategy. */
    shake(mode: ShakeMode, opts?: {
        config?: ShakeConfig;
        signal?: AbortSignal;
    }): Promise<ShakeResult>;
    /** Compact the active session history. */
    compact(customInstructions?: string, options?: CompactOptions): Promise<CompactionResult>;
    /** Cancel active manual, automatic, and handoff maintenance, preserving an optional source reason. */
    abortCompaction(reason?: unknown): void;
    /** Trigger idle compaction through the automatic maintenance flow. */
    runIdleCompaction(): Promise<void>;
    /** Toggle automatic compaction. */
    setAutoCompactionEnabled(enabled: boolean): void;
    /** Whether automatic compaction is enabled. */
    get autoCompactionEnabled(): boolean;
    /**
     * Whether idle-flush tasks, auto-continuations, or other short-lived
     * post-prompt work are pending.  True in the brief window after
     * `session.prompt()` returns but before a scheduled background delivery
     * (e.g. an async-job result) has finished its own streaming turn.
     * Loop-mode and similar auto-submit paths should treat this as a block
     * to avoid racing against the delivery turn.
     */
    get hasPostPromptWork(): boolean;
    /** Register post-prompt work in tests without driving a full agent turn. */
    trackPostPromptTaskForTests(task: Promise<unknown>): void;
    /** All messages including custom types like BashExecutionMessage */
    get messages(): AgentMessage[];
    /** Latest image attachments addressable by tools as `Image #N` or `attachment://N`. */
    getImageAttachments(): ImageAttachmentEntry[];
    buildDisplaySessionContext(): SessionContext;
    /**
     * Transcript for TUI display. Full history is kept for export/resume-style
     * callers; live chat can collapse compacted history to keep the hot render
     * surface bounded. Display-only — NEVER feed the result to
     * `agent.replaceMessages` or a provider.
     */
    buildTranscriptSessionContext(options?: Pick<BuildSessionContextOptions, "collapseCompactedHistory" | "keepDanglingToolCalls">): SessionContext;
    /** Convert session messages using the same pre-LLM pipeline as the active session. */
    convertMessagesToLlm(messages: AgentMessage[], signal?: AbortSignal): Promise<Message[]>;
    /** Apply session-level stream hooks to a direct side request. */
    prepareSimpleStreamOptions(options: SimpleStreamOptions, provider?: string): SimpleStreamOptions;
    /** Current steering mode */
    get steeringMode(): "all" | "one-at-a-time";
    /** Current follow-up mode */
    get followUpMode(): "all" | "one-at-a-time";
    /** Current interrupt mode */
    get interruptMode(): "immediate" | "wait";
    /** Current session file path, or undefined if sessions are disabled */
    get sessionFile(): string | undefined;
    /** Current session ID */
    get sessionId(): string;
    getEvalSessionId(): string | null;
    getEvalKernelOwnerId(): string;
    /** Current session display name, if set */
    get sessionName(): string | undefined;
    /** Scoped models for cycling (from --models flag) */
    get scopedModels(): ReadonlyArray<{
        model: Model;
        thinkingLevel?: ThinkingLevel;
    }>;
    /** Replace the Ctrl+P/`/models` cycle scope (post-discovery rebuild; see {@link ModelControls.setScopedModels}). */
    setScopedModels(scopedModels: Array<{
        model: Model;
        thinkingLevel?: ThinkingLevel;
    }>): void;
    /** Prompt templates */
    getPlanModeState(): PlanModeState | undefined;
    /** Prewalk state, if armed and active */
    getPrewalkState(): Prewalk | undefined;
    setPlanModeState(state: PlanModeState | undefined): void;
    getGoalModeState(): GoalModeState | undefined;
    setGoalModeState(state: GoalModeState | undefined): void;
    getVibeModeState(): VibeModeState | undefined;
    setVibeModeState(state: VibeModeState | undefined): void;
    get goalRuntime(): GoalRuntime;
    markPlanReferenceSent(): void;
    setPlanReferencePath(path: string): void;
    getPlanReferencePath(): string;
    get clientBridge(): ClientBridge | undefined;
    setClientBridge(bridge: ClientBridge | undefined): void;
    getCheckpointState(): CheckpointState | undefined;
    getLastCompletedRewind(): CompletedRewindState | undefined;
    setCheckpointState(state: CheckpointState | undefined): void;
    /**
     * Inject the plan mode context message into the conversation history.
     */
    sendPlanModeContext(options?: {
        deliverAs?: "steer" | "followUp" | "nextTurn";
    }): Promise<void>;
    sendGoalModeContext(options?: {
        deliverAs?: "steer" | "followUp" | "nextTurn";
    }): Promise<void>;
    sendVibeModeContext(options?: {
        deliverAs?: "steer" | "followUp" | "nextTurn";
    }): Promise<void>;
    resolveRoleModel(role: string): Model | undefined;
    /**
     * Resolve a role to its model AND thinking level.
     * Unlike resolveRoleModel(), this preserves the thinking level suffix
     * from role configuration (e.g., "anthropic/claude-sonnet-4-5:xhigh").
     */
    resolveRoleModelWithThinking(role: string): ResolvedModelRoleValue;
    /**
     * Resolve the explicit thinking suffix that should apply when a temporary
     * picker selects a model already assigned to a configured role.
     */
    resolveTemporaryModelThinkingLevel(model: Model): ConfiguredThinkingLevel | undefined;
    get promptTemplates(): ReadonlyArray<PromptTemplate>;
    /** Replace file-based slash commands used for prompt expansion. */
    setSlashCommands(slashCommands: FileSlashCommand[]): void;
    /** File-based slash commands discovered at session construction (or last set). */
    get slashCommands(): ReadonlyArray<FileSlashCommand>;
    /** Custom commands (TypeScript slash commands and MCP prompts) */
    get customCommands(): ReadonlyArray<LoadedCustomCommand>;
    /** MCP prompt commands only, for command-list metadata. */
    get mcpPromptCommands(): ReadonlyArray<LoadedCustomCommand>;
    /** Update the MCP prompt commands list. Called when server prompts are (re)loaded. */
    setMCPPromptCommands(commands: LoadedCustomCommand[]): void;
    /**
     * Send a prompt to the agent.
     * - Handles extension commands (registered via pi.registerCommand) immediately, even during streaming
     * - Expands file-based prompt templates by default
     * - During streaming, queues via steer() or followUp() based on streamingBehavior option
     * - Validates model and API key before sending (when not streaming)
     * @throws Error if streaming and no streamingBehavior specified
     * @throws Error if no model selected or no API key available (when not streaming)
     */
    /**
     * Returns `false` when the command was fully handled locally (extension or
     * custom-TS command consumed without calling the LLM). Returns `true` when
     * the prompt was forwarded to the agent — either directly or queued as a
     * steer/follow-up. Callers that render a UI or manage turn lifecycle (e.g.
     * the ACP agent) use this to know whether to expect an `agent_end` event.
     */
    prompt(text: string, options?: PromptOptions): Promise<boolean>;
    promptCustomMessage<T = unknown>(message: Pick<CustomMessage<T>, "customType" | "content" | "display" | "details" | "attribution">, options?: Pick<PromptOptions, "streamingBehavior" | "toolChoice"> & {
        queueChipText?: string;
        queueOnly?: boolean;
    }): Promise<void>;
    /**
     * Queue a steering message to interrupt the agent mid-run.
     */
    steer(text: string, images?: ImageContent[]): Promise<void>;
    /**
     * Queue a follow-up message to process after the agent would otherwise stop.
     * Set `options.synthetic` to enqueue a hidden developer message (agent-attributed
     * by default) instead of a user-attributed follow-up; the plan-approval flow
     * uses this to land its execution directive behind a queued user turn without
     * flipping advisor auto-resume.
     */
    followUp(text: string, images?: ImageContent[], options?: FollowUpOptions): Promise<void>;
    /**
     * Run a mode-exit `teardown` (abort the active turn, swap the toolset, clear
     * mode state) with queued-message auto-resume suppressed, then re-arm the
     * drain so a queued user turn resumes cleanly once the previous toolset is
     * back.
     *
     * `abort()`'s stranded-queue drain runs from its own `finally`; without this
     * guard a queued steer/follow-up behind the aborted turn would start a fresh
     * `agent.continue()` during the teardown's `await`s — while the exiting mode's
     * tools/context are still live — and then have those tools removed underneath
     * it, reintroducing the mode's stale-tool failure on the restarted turn
     * (issue #8326). Suppressing the drain across teardown guarantees the queued
     * turn resumes only after teardown, so it runs as a clean non-mode turn.
     */
    runModeExitTeardown(teardown: () => Promise<void>): Promise<void>;
    queueDeferredMessage(message: CustomMessage): void;
    queueLaunchCompletion(notification: DaemonCompletionNotification): Promise<void>;
    /**
     * Send a custom message to the session. Creates a CustomMessageEntry.
     *
     * Handles three cases:
     * - Streaming: queue as steer/follow-up or store for next turn
     * - Not streaming + triggerTurn: appends to state/session, starts new turn unless the client cannot own it
     * - Not streaming + no trigger: appends to state/session, no turn
     *
     * @returns true iff this call synchronously started a new turn (awaited
     * `agent.prompt`); false when the message was queued/appended without a turn
     * — including when `triggerTurn` is downgraded because the client defers
     * agent-initiated turns. Callers that must mirror the resulting `agent_end`
     * use this to avoid acting on a turn that never ran.
     */
    sendCustomMessage<T = unknown>(message: CustomMessagePayload<T>, options?: {
        triggerTurn?: boolean;
        deliverAs?: "steer" | "followUp" | "nextTurn";
        queueChipText?: string;
        acceptTerminalEmptyStop?: boolean;
    }): Promise<boolean>;
    /**
     * Send a user message through the prompt flow.
     *
     * Omitted `deliverAs` starts a turn when idle and queues as a steer while streaming.
     * Explicit `deliverAs` queues without starting a turn in either state.
     */
    sendUserMessage(content: string | (TextContent | ImageContent)[], options?: {
        deliverAs?: "steer" | "followUp";
    }): Promise<void>;
    /** Clear queued messages and return the user-restorable ones (text plus any attached images).
     *  Only user-authored messages (plain user turns, `attribution:"user"` custom like `/skill`) are
     *  returned for editor restore. Other queued messages stay in the agent-core queues so a continuing
     *  stream still delivers them — EXCEPT on `forInterrupt` (Esc+abort), where only advisor cards are
     *  kept (abort()'s #extractQueuedAdvisorCards preserves them as visible advice) and every other
     *  non-user steer (hidden goal/plan/budget, IRC/extension asides) is dropped, so abort()'s
     *  #drainStrandedQueuedMessages can't auto-resume the run the user just interrupted (the drain only
     *  fires while agent.hasQueuedMessages()). Plain Alt+Up dequeue preserves those non-user steers. */
    clearQueue(options?: {
        forInterrupt?: boolean;
    }): {
        steering: RestoredQueuedMessage[];
        followUp: RestoredQueuedMessage[];
    };
    /** Number of pending displayable messages (includes steering, follow-up, and next-turn messages).
     *  Reflects actual queued work (advisor cards included) — feeds hasPendingMessages()/RPC and the
     *  empty-submit abort gate. The user-restorable subset is surfaced by getQueuedMessages()/clearQueue(). */
    get queuedMessageCount(): number;
    getQueuedMessages(): {
        steering: readonly string[];
        followUp: readonly string[];
    };
    /**
     * Pop the last queued message (steering first, then follow-up).
     * Used by dequeue keybinding to restore messages to editor one at a time.
     * Steps over agent-authored queued messages (advisor cards, hidden/internal steers).
     */
    popLastQueuedMessage(): RestoredQueuedMessage | undefined;
    get skillsSettings(): SkillsSettings | undefined;
    /** Skills loaded by SDK (empty if --no-skills or skills: [] was passed) */
    get skills(): readonly Skill[];
    /** Skill loading warnings captured by SDK */
    get skillWarnings(): readonly SkillWarning[];
    getTodoPhases(): TodoPhase[];
    setTodoPhases(phases: TodoPhase[]): void;
    /**
     * Start automatic title generation when the session and input are eligible.
     * Interactive and CLI-bootstrap submissions share this gate so every first
     * user message persists titles with the same environment, signal, and local
     * extension-command policy.
     */
    maybeStartTitleGeneration(firstMessage: string, onStart?: () => void): void;
    /**
     * Generate an automatic session title tied to this session's lifecycle.
     * Input and replan callers share the signal so disposal cancels provider and
     * local-worker requests instead of leaving background inference alive.
     * `customSystemPrompt` swaps the title prompt for special-purpose titling
     * (e.g. plan-save filename topics) without touching the session override.
     */
    generateTitle(firstMessage: string, customSystemPrompt?: string): Promise<string | null>;
    /** Currently-applied {@link TITLE_SYSTEM.md} override, or undefined when the
     *  bundled prompt is in effect. Consumed by {@link InteractiveMode} so the
     *  first-input title path and the replan refresh share one source. */
    get titleSystemPrompt(): string | undefined;
    /** Replace the title-generation system prompt override. Called by
     *  {@link InteractiveMode.refreshTitleSystemPrompt} after the session cwd
     *  changes (e.g. `/move` relocation) so the next replan refresh resolves
     *  against the destination project's override. */
    setTitleSystemPrompt(prompt: string | undefined): void;
    /** Install the interactive title-download UI hook. Used when `/skill:` starts
     *  titling from {@link promptCustomMessage} without the input-controller callback. */
    setTitleGenerationStart(handler: (() => void) | undefined): void;
    /** Install the host hook that receives a typed user prompt dropped before
     *  dispatch (an Esc abort or usage preflight denial raced turn setup). The
     *  prompt never reached the agent or the session file, so without this hook
     *  it would vanish; interactive mode restores it to the editor for editing. */
    setPromptDropped(handler: ((prompt: DroppedPrompt) => void) | undefined): void;
    /**
     * Abort current operation and wait for agent to become idle.
     *
     * `reason` (e.g. `USER_INTERRUPT_LABEL`) rides the agent's `AbortController`
     * and surfaces verbatim on the aborted assistant message's `errorMessage`, so
     * the transcript can distinguish a deliberate user interrupt from an opaque
     * abort. Omit it for internal/lifecycle aborts.
     */
    abort(options?: {
        goalReason?: "interrupted" | "internal";
        reason?: string;
        /** Internal `/compact` startup keeps the manual-compaction marker alive while aborting the active turn. */
        preserveCompaction?: boolean;
    }): Promise<void>;
    /**
     * Start a new session, optionally with initial messages and parent tracking.
     * Clears all messages and starts a new session.
     * Listeners are preserved and will continue receiving events.
     * @param options - Optional initial messages and parent session path
     * @returns true if completed, false if cancelled by hook
     */
    newSession(options?: NewSessionOptions): Promise<boolean>;
    /**
     * Set a display name for the current session.
     */
    setSessionName(name: string, source?: "auto" | "user", trigger?: SessionNameTrigger): Promise<boolean>;
    /**
     * Fork the current session, creating a new session file with the exact same state.
     * Copies all entries and artifacts to the new session.
     * Unlike newSession(), this preserves all messages in the agent state.
     * @returns true if completed, false if cancelled by hook or not persisting
     */
    fork(): Promise<boolean>;
    /** Move the active session and artifacts after enforcing mode transition invariants. */
    moveSession(newCwd: string, targetSessionDir?: string): Promise<void>;
    /**
     * Set model directly.
     * Validates that a credential source is configured (synchronously, without
     * refreshing OAuth or running command-backed key programs). Active switches
     * always take effect; if the current transcript is too large for the target
     * model, the next prompt's compaction/error path owns that recovery instead
     * of leaving the session pinned to the old model.
     * @throws Error if no API key available for the model
     */
    setModel(model: Model, role?: string, options?: {
        selector?: string;
        thinkingLevel?: ThinkingLevel;
        persist?: boolean;
    }): Promise<{
        switched: boolean;
    }>;
    /** Selects a model for this session without updating persisted model settings. */
    setModelTemporary(model: Model, thinkingLevel?: ConfiguredThinkingLevel, options?: {
        ephemeral?: boolean;
    }): Promise<void>;
    /** Cycles the scoped model set, or all available models when no scope exists. */
    cycleModel(direction?: "forward" | "backward"): Promise<ModelCycleResult | undefined>;
    /** Resolves configured role models and the currently active role index. */
    getRoleModelCycle(roleOrder: readonly string[]): RoleModelCycle | undefined;
    /** Applies a resolved role model without changing global settings. */
    applyRoleModel(entry: ResolvedRoleModel): Promise<void>;
    /** Cycles the configured role models in the supplied order. */
    cycleRoleModels(roleOrder: readonly string[], direction?: "forward" | "backward"): Promise<RoleModelCycleResult | undefined>;
    /** Lists available models after applying the configured enabled-model filter. */
    getAvailableModels(): Model[];
    /** Selects the session thinking level and optionally persists it as the default. */
    setThinkingLevel(level: ConfiguredThinkingLevel | undefined, persist?: boolean): void;
    /** Advances through the thinking selectors supported by the active model. */
    cycleThinkingLevel(): ConfiguredThinkingLevel | undefined;
    /** Reports whether `/fast` is enabled for the active model family. */
    isFastModeEnabled(): boolean;
    /** Reports whether priority service is realized by the active model. */
    isFastModeActive(): boolean;
    /** Sets or clears one model family's live service tier. */
    setServiceTierFamily(family: ServiceTierFamily, tier: ServiceTier | undefined): void;
    /** Enables or disables priority service for the active model family. */
    setFastMode(enabled: boolean): boolean;
    /** Toggles priority service for the active model family. */
    toggleFastMode(): boolean;
    /** Lists thinking levels supported by the active model. */
    getAvailableThinkingLevels(): ReadonlyArray<Effort>;
    /**
     * Set steering mode.
     * Saves to settings.
     */
    setSteeringMode(mode: "all" | "one-at-a-time"): void;
    /**
     * Set follow-up mode.
     * Saves to settings.
     */
    setFollowUpMode(mode: "all" | "one-at-a-time"): void;
    /**
     * Set interrupt mode.
     * Saves to settings.
     */
    setInterruptMode(mode: "immediate" | "wait"): void;
    /**
     * Cancel in-progress branch summarization.
     */
    abortBranchSummary(): void;
    /**
     * Cancel in-progress handoff generation.
     */
    abortHandoff(): void;
    /**
     * Check if handoff generation is in progress.
     */
    get isGeneratingHandoff(): boolean;
    /**
     * Generate a handoff document with a oneshot LLM call and commit it as a
     * compaction entry on the current session (the document becomes the summary;
     * recent history is kept).
     *
     * @param customInstructions Optional focus for the handoff document
     * @param options Handoff execution options
     * @returns The handoff document text, or undefined if cancelled/failed
     */
    handoff(customInstructions?: string, options?: SessionHandoffOptions): Promise<HandoffResult | undefined>;
    /** Cancel an in-progress retry. */
    abortRetry(): void;
    /** Whether auto-retry is currently in progress. */
    get isRetrying(): boolean;
    /** Whether auto-retry is enabled. */
    get autoRetryEnabled(): boolean;
    /** Toggle the auto-retry setting. */
    setAutoRetryEnabled(enabled: boolean): void;
    /** Retry the last failed assistant turn when the session is idle. */
    retry(): Promise<boolean>;
    /**
     * Execute a bash command and retain the session/branch that owned its start.
     * @param command The bash command to execute
     * @param onChunk Optional streaming callback for output
     * @param options.excludeFromContext If true, command output won't be sent to LLM (!! prefix)
     * @param options.useUserShell If true, allow caller to request configured user-shell routing
     */
    executeBash(command: string, onChunk?: (chunk: string) => void, options?: {
        excludeFromContext?: boolean;
        useUserShell?: boolean;
    }): Promise<BashResult>;
    /** Record a bash result supplied outside executeBash in the current ownership scope. */
    recordBashResult(command: string, result: BashResult, options?: {
        excludeFromContext?: boolean;
    }): void;
    /** Cancel running bash commands. */
    abortBash(): void;
    /** Whether a bash command is currently running */
    get isBashRunning(): boolean;
    /** Whether there are pending bash messages waiting to be flushed */
    get hasPendingBashMessages(): boolean;
    /**
     * Execute Python code in the shared kernel.
     * Uses the same kernel session as eval's Python backend, allowing collaborative editing.
     * @param code The Python code to execute
     * @param onChunk Optional streaming callback for output
     * @param options.excludeFromContext If true, execution won't be sent to LLM ($$ prefix)
     */
    executePython(code: string, onChunk?: (chunk: string) => void, options?: {
        excludeFromContext?: boolean;
    }): Promise<PythonResult>;
    assertEvalExecutionAllowed(): void;
    /**
     * Track Python work started outside AgentSession.executePython so dispose can await and abort it too.
     */
    trackEvalExecution<T>(execution: Promise<T>, abortController: AbortController): Promise<T>;
    /**
     * Record a Python execution result in session history.
     */
    recordPythonResult(code: string, result: PythonResult, options?: {
        excludeFromContext?: boolean;
    }): void;
    /**
     * Cancel running Python execution.
     */
    abortEval(): void;
    /** Whether a Python execution is currently running */
    get isEvalRunning(): boolean;
    /** Whether there are pending Python messages waiting to be flushed */
    get hasPendingPythonMessages(): boolean;
    /**
     * Flush pending Python messages to agent state and session.
     */
    /** Surfaces and consumes pending IRC records before automatic injection. */
    drainPendingIrcInboxMessages(agentId: string, opts?: {
        from?: string;
        limit?: number;
    }): IrcMessage[];
    /** Delivers an IRC message into this recipient session. */
    deliverIrcMessage(msg: IrcMessage, opts?: {
        expectsReply?: boolean;
    }): Promise<"injected" | "woken">;
    /** Installs task-executor monitoring around autonomous IRC wake turns. */
    setIrcWakeTurnObserver(observer: ((records: CustomMessage[]) => ((error?: unknown) => void | Promise<void>) | undefined) | undefined): void;
    /** Emits an IRC relay observation for UI rendering without persisting it. */
    emitIrcRelayObservation(record: CustomMessage): void;
    /**
     * Run a single ephemeral side-channel turn against this session's current
     * model + system prompt + history. The main turn's tool catalog is sent
     * to preserve the prompt cache, but the model is reminded not to call
     * tools and any tool calls are discarded. The side request
     * does not block on, or interfere with, any in-flight main turn. The
     * session's history and persisted state are NOT modified by this call.
     *
     * Used by `BtwController` (`/btw`) and `OmfgController` (`/omfg`) to share
     * the snapshot + stream pipeline. The snapshot includes any in-flight
     * streaming assistant text so the model sees the half-finished response
     * rather than missing context.
     */
    runEphemeralTurn(args: {
        promptText: string;
        onTextDelta?: (delta: string) => void;
        signal?: AbortSignal;
        dedupeReply?: boolean;
    }): Promise<{
        replyText: string;
        assistantMessage: AssistantMessage;
    }>;
    /**
     * Reload the current session from disk.
     *
     * Intended for extension commands and headless modes to re-read the current session
     * file and re-emit session_switch hooks.
     */
    reload(): Promise<void>;
    /**
     * Switch to a different session file.
     * Aborts current operation, loads messages, restores model/thinking.
     * Listeners are preserved and will continue receiving events.
     * @returns true if switch completed, false if cancelled by hook
     */
    switchSession(sessionPath: string): Promise<boolean>;
    /**
     * Create a branch from a specific entry.
     * Emits before_branch/branch session events to hooks.
     *
     * @param entryId ID of the entry to branch from
     * @returns Object with:
     *   - selectedText: The text of the selected user message (for editor pre-fill)
     *   - selectedImages: Image attachments of the selected user message (for editor draft restore)
     *   - cancelled: True if a hook cancelled the branch
     */
    branch(entryId: string): Promise<{
        selectedText: string;
        selectedImages: ImageContent[];
        cancelled: boolean;
    }>;
    /** Promotes a completed /btw answer from the explicitly authorized session and leaf. */
    branchFromBtw(question: string, assistantMessage: AssistantMessage, leafId: string, sessionId: string): Promise<{
        cancelled: boolean;
        sessionFile: string | undefined;
    }>;
    /**
     * Navigate to a different node in the session tree.
     * Unlike branch() which creates a new session file, this stays in the same file.
     *
     * @param targetId The entry ID to navigate to
     * @param options.summarize Whether user wants to summarize abandoned branch
     * @param options.customInstructions Custom instructions for summarizer
     * @returns Result with editorText/editorImages (if user message) and cancelled status
     */
    navigateTree(targetId: string, options?: {
        summarize?: boolean;
        customInstructions?: string;
        /**
         * Opts into the two-phase `ask` toolResult re-answer protocol
         * (issue #5642): set only by the interactive `/tree` selector, which
         * knows how to re-open the picker on `reopenAsk` and complete the
         * navigation with `reanswerAskResult`. Every other public caller
         * (extensions, hooks, ACP, session-extension actions) leaves this
         * unset and gets the pre-#5642 plain leaf move onto `ask`
         * toolResults instead — they have no picker to re-open and would
         * otherwise report a successful no-op navigation (roboomp review on
         * #5895).
         */
        allowAskReopen?: boolean;
        /**
         * Completes an in-progress `ask` re-answer (issue #5642): the caller
         * already received `reopenAsk` from a prior call on the same
         * `targetId`, re-opened the picker, and is handing back the fresh
         * answer. Branches a new toolResult sibling instead of landing on
         * the original one.
         */
        reanswerAskResult?: AgentToolResult<AskToolDetails>;
    }): Promise<{
        editorText?: string;
        /** Image attachments of the target user message, parallel to the positional `[Image #N]` markers in {@link editorText}. */
        editorImages?: ImageContent[];
        cancelled: boolean;
        aborted?: boolean;
        summaryEntry?: BranchSummaryEntry;
        /** Raw session context built during navigation — pass to renderInitialMessages to skip a second O(N) walk. */
        sessionContext?: SessionContext;
        /**
         * Set when `targetId` is an `ask` toolResult, `options.allowAskReopen`
         * was set, and `options.reanswerAskResult` was not supplied: nothing was
         * mutated. The caller must re-open the ask picker with these
         * `questions`, then call `navigateTree(targetId, { ...options,
         * reanswerAskResult })` with the produced result to actually branch
         * (issue #5642).
         */
        reopenAsk?: {
            toolCallId: string;
            questions: AskToolInput["questions"];
        };
        /**
         * `true` when this call committed a new sibling answer for an `ask`
         * re-answer (`reanswerAskResult` was applied). The interactive caller
         * resumes the agent via {@link resumeAfterAskReanswer} *after* rebuilding
         * its transcript, so the resumed turn never renders against the stale
         * pre-rebuild UI (issue #6483).
         */
        askReanswerCommitted?: boolean;
    }>;
    /**
     * Resume the agent after the interactive `/tree` caller has committed an
     * `ask` re-answer (`navigateTree` returned `askReanswerCommitted`) and
     * rebuilt its transcript. Mirrors how a live `ask` completion drives a
     * follow-up turn, but is deferred to the caller so the resumed turn renders
     * against the rebuilt UI rather than the stale pre-navigation transcript
     * (issue #6483). The scheduled continue honors the same disposed/compacting
     * guards as every other post-prompt continuation.
     */
    resumeAfterAskReanswer(): void;
    /**
     * Build a standalone `AgentToolContext` for running `AskTool.execute()`
     * outside a normal agent turn, for `/tree` `ask` re-answer (issue #5642).
     * `SelectorController` has no reachable `ToolContextStore` (that store is
     * built inside `sdk.ts` and never threaded through to mode controllers),
     * so this mirrors `refreshMCPTools()`'s `getCustomToolContext` factory
     * with real session state instead of a `{ ... } as unknown as
     * AgentToolContext` cast that could silently compile with an incomplete
     * context (roboomp review on #5895) — every `CustomToolContext` field is
     * backed by live session state, so a future required field fails to
     * compile here instead of surfacing as `undefined` at runtime.
     */
    buildAskReanswerContext(uiContext: ExtensionUIContext): AgentToolContext;
    /**
     * Get all user messages from session for branch selector.
     */
    getUserMessagesForBranching(): Array<{
        entryId: string;
        text: string;
    }>;
    /**
     * Get session statistics.
     */
    getSessionStats(): SessionStats;
    /**
     * Get current context usage statistics.
     * Uses the last assistant message's usage data when available,
     * otherwise estimates tokens for all messages.
     */
    getContextBreakdown(options?: {
        contextWindow?: number;
        pendingMessages?: AgentMessage[];
    }): ContextUsageBreakdown | undefined;
    getContextUsage(options?: {
        contextWindow?: number;
    }): ContextUsage | undefined;
    /**
     * Monotonic counter that changes whenever the in-flight pending context
     * snapshot is set or cleared. Status-line context memoization keys on this so
     * a value computed mid-turn cannot persist after the turn ends/aborts.
     */
    get contextUsageRevision(): number;
    fetchUsageReports(signal?: AbortSignal): Promise<UsageReport[] | null>;
    /** Models whose live `/usage` reports map to a quantitative provider scope. */
    getUsageReportingModelSelectors(reports: readonly UsageReport[]): string[];
    /** List stored OAuth accounts for the current model provider and mark this session's active account. */
    listCurrentProviderOAuthAccounts(): Promise<SessionOAuthAccountList | undefined>;
    /**
     * Pin a stored OAuth account to the current model provider for this session.
     * Returns false while streaming or when the credential is no longer available.
     */
    pinCurrentProviderOAuthAccount(credentialId: number): boolean;
    /**
     * Redeem one saved Codex rate-limit reset for a specific account, injecting
     * the provider base URL like {@link AgentSession.fetchUsageReports}. Powers
     * the `/usage reset` command and auto-redeem. Never throws for business
     * outcomes — inspect the returned `code`.
     */
    redeemResetCredit(target: ResetCreditTarget, signal?: AbortSignal): Promise<ResetCreditRedeemOutcome>;
    /**
     * List saved Codex rate-limit resets per stored account, fetched live from
     * the dedicated credits endpoint (bypasses the usage cache). Powers the
     * `/usage reset` account selector.
     */
    listResetCredits(signal?: AbortSignal): Promise<ResetCreditAccountStatus[]>;
    /**
     * Export session to HTML.
     * @param outputPath Optional output path
     * @param useUserThemes Bundle the dark and light TUI themes selected in settings
     */
    exportToHtml(outputPath?: string, useUserThemes?: boolean): Promise<string>;
    /**
     * Get text content of last assistant message.
     * Useful for /copy command.
     * @returns Text content, or undefined if no assistant message exists
     */
    getLastAssistantText(): string | undefined;
    hasCopyCandidateAssistantMessage(): boolean;
    /**
     * Get text content of the most recent visible handoff message.
     * Sessions created by older versions injected the handoff document as a
     * custom message at the top of a fresh session; callers that copy the
     * "last" message use this as a fallback while no assistant response exists.
     */
    getLastVisibleHandoffText(): string | undefined;
    /**
     * Format the entire session as plain text for clipboard export: system
     * prompt, model/thinking config, tool inventory, and the full transcript
     * rendered with markdown role headings (`## User`, `## Assistant`,
     * `### Tool Call`/`### Tool Result`).
     */
    formatSessionAsText(): string;
    /**
     * Dump the current session's LLM-facing request context as JSON to a
     * auto-named file in `os.tmpdir()`. This is the synchronous
     * `convertToLlm`-boundary snapshot — system prompt, tools (wire schemas),
     * thinking/service tier, and converted messages — with no network round-trip
     * and no arming flag, so advisor/side requests cannot intercept it.
     *
     * The file persists on disk and may contain the same raw context/secrets
     * as `/dump`; treat the path accordingly.
     *
     * @returns the written file path, or `undefined` when there are no messages.
     */
    dumpLlmRequestToTmpDir(): Promise<string | undefined>;
    /**
     * Enable or disable the advisor for this session. The setting is overridden for the session,
     * and the runtime is started or stopped to match.
     *
     * @returns true when the advisor is actively running after the call.
     */
    setAdvisorEnabled(enabled: boolean): boolean;
    /**
     * Toggle the advisor setting and start/stop the runtime accordingly.
     *
     * @returns true when the advisor is actively running after the call.
     */
    toggleAdvisorEnabled(): boolean;
    /**
     * Replace the live advisor roster from an edited `WATCHDOG.yml` (the `/advisor
     * configure` save path). Swaps the configs + shared baseline, then rebuilds the
     * runtimes in place so the change applies without a restart. When the advisor is
     * disabled the new configs are simply stored for the next enable.
     *
     * @returns the number of advisors active after the rebuild.
     */
    applyAdvisorConfigs(advisors: AdvisorConfig[], sharedInstructions: string | undefined): number;
    /**
     * Refresh the project context prompt advisor sessions run against after
     * context files change on `/reload-plugins`. Rebuilds live advisor runtimes so
     * they stop evaluating turns against stale `AGENTS.md` instructions.
     */
    setAdvisorContextPrompt(contextPrompt: string | undefined): void;
    /**
     * Whether the advisor setting is enabled for this session.
     */
    isAdvisorEnabled(): boolean;
    /**
     * Whether a live advisor agent is attached to this session. True only when
     * `advisor.enabled` is set for this session (subagents opt in per agent via
     * frontmatter `advisor` / `task.agentAdvisor`) AND a model resolved for the
     * `advisor` role — i.e. the actual runtime exists, not merely the setting.
     * Drives the status-line badge and `/dump advisor`.
     */
    isAdvisorActive(): boolean;
    /**
     * The names of the tools available to advisors this session (the pool a
     * `/advisor configure` editor lists). The advisor is a full agent, so this is the
     * full built tool set; a tool whose optional factory returns null (e.g. lsp with
     * no servers) is absent.
     */
    getAdvisorAvailableToolNames(): string[];
    /**
     * The live advisor `Agent`, or `undefined` when no advisor runtime is
     * attached. Surfaced for diagnostics (`/dump advisor` already serializes
     * its transcript via {@link formatAdvisorHistoryAsText}) and so callers can
     * verify the advisor inherits the session's provider-shaping options
     * (`streamFn`, `promptCacheKey`, `providerSessionState`, ...).
     */
    getAdvisorAgent(): Agent | undefined;
    /**
     * Lightweight advisor status for the status line: returns just the configured
     * flag and per-advisor name/status without computing token/cost breakdowns.
     * Avoids re-tokenizing the advisor transcript on every render frame.
     */
    getAdvisorStatusOverview(): {
        configured: boolean;
        advisors: {
            name: string;
            status: AdvisorRuntimeStatus;
        }[];
    };
    /** Return cumulative cost recorded for the current session's advisor activity. */
    getAdvisorCost(): number;
    /** Return whether any active or configured advisor is running on an OAuth/subscription model. */
    isAdvisorUsingSubscription(): boolean;
    /**
     * Return structured advisor stats for the status command and TUI panel.
     */
    getAdvisorStats(): AdvisorStats;
    /**
     * Format a concise advisor status line for ACP/text output.
     */
    formatAdvisorStatus(): string;
    /**
     * Format the advisor agent's own transcript (its system prompt, config,
     * tools, and the markdown deltas it received plus its thinking/advise/read
     * calls) as plain text — the advisor-side equivalent of
     * {@link formatSessionAsText}. Returns null when no advisor is active.
     */
    formatAdvisorHistoryAsText(options?: {
        compact?: boolean;
    }): string | null;
    /**
     * Check if extensions have handlers for a specific event type.
     */
    hasExtensionHandlers(eventType: string): boolean;
    /**
     * Get the extension runner (for setting UI context and error handlers).
     */
    get extensionRunner(): ExtensionRunner | undefined;
}
