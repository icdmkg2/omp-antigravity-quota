/** Context maintenance for an active coding-agent session. */
import { type Agent, type AgentMessage, type AgentTurnEndContext, type StreamFn, type ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import { type CompactionPreparation, type CompactionResult, type ShakeConfig } from "@oh-my-pi/pi-agent-core/compaction";
import type { AssistantMessage, CodexCompactionContext, Message, Model, ProviderSessionState } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import type { ExtensionRunner } from "../extensibility/extensions/index.js";
import type { CompactOptions, ContextUsage } from "../extensibility/extensions/types.js";
import type { GoalModeState } from "../goals/state.js";
import type { MemoryBackendOperationContext } from "../memory-backend/types.js";
import type { NonMessageTokenSource } from "../modes/utils/context-usage.js";
import type { ConfiguredThinkingLevel } from "../thinking.js";
import type { AgentSessionEvent } from "./agent-session-events.js";
import type { ContextUsageBreakdown, HandoffResult, SessionHandoffOptions } from "./agent-session-types.js";
import type { SessionContext } from "./session-context.js";
import type { SessionManager } from "./session-manager.js";
import type { ShakeMode, ShakeResult } from "./shake-types.js";
export type CompactionCheckResult = Readonly<{
    deferredHandoff: boolean;
    continuationScheduled: boolean;
    automaticContinuationBlocked?: boolean;
    historyRewritten?: boolean;
}>;
/** Shared no-op result for dispatcher paths that perform no maintenance. */
export declare const COMPACTION_CHECK_NONE: CompactionCheckResult;
/** Creates one provider-scoped compaction lifecycle descriptor. */
export declare function createCodexCompactionContext(options: {
    trigger: CodexCompactionContext["trigger"];
    reason: CodexCompactionContext["reason"];
    phase: CodexCompactionContext["phase"];
}): CodexCompactionContext;
/** Capabilities borrowed from the owning AgentSession. */
export interface SessionMaintenanceHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    modelRegistry: ModelRegistry;
    extensionRunner: ExtensionRunner | undefined;
    sideStreamFn: StreamFn;
    providerSessionState: Map<string, ProviderSessionState>;
    preferWebsockets: boolean | undefined;
    model(): Model | undefined;
    thinkingLevel(): ThinkingLevel | undefined;
    isDisposed(): boolean;
    isStreaming(): boolean;
    isGeneratingHandoff(): boolean;
    promptGeneration(): number;
    sessionId(): string;
    messages(): AgentMessage[];
    baseSystemPrompt(): string[];
    goalModeState(): GoalModeState | undefined;
    planReferencePath(): string;
    nonMessageTokenSource(): NonMessageTokenSource;
    memoryBackendSession(): MemoryBackendOperationContext["session"];
    emitSessionEvent(event: AgentSessionEvent, options?: {
        detachExtensions?: boolean;
    }): Promise<void>;
    emitNotice(level: "info" | "warning" | "error", message: string, source?: string): void;
    schedulePostPromptTask(task: (signal: AbortSignal) => Promise<void>, options?: {
        delayMs?: number;
        generation?: number;
        onSkip?: (reason: "aborted" | "stale-generation") => void;
    }): void;
    scheduleAgentContinue(options?: {
        delayMs?: number;
        generation?: number;
        shouldContinue?: () => boolean;
        onSkip?: (reason: "aborted" | "stale-generation" | "session-unavailable" | "should-continue-false" | "post-restore-unavailable") => void;
        onError?: () => void;
    }): void;
    scheduleCompactionContinuation(options: {
        generation: number;
        autoContinue: boolean;
        terminalTextAnswer: boolean;
        suppressContinuation: boolean;
    }): boolean;
    persistTurnMessagesForMidRunCompaction(context: AgentTurnEndContext | undefined): Promise<boolean>;
    findLastAssistantMessage(): AssistantMessage | undefined;
    disconnectFromAgent(): void;
    reconnectToAgent(): void;
    drainStrandedQueuedMessages(): void;
    buildDisplaySessionContext(): SessionContext;
    convertToLlmForSideRequest(messages: AgentMessage[]): Message[];
    obfuscateTextForProvider(text: string | undefined): string | undefined;
    obfuscatePreparationForProvider(preparation: CompactionPreparation): CompactionPreparation;
    closeCodexProviderSessionsForHistoryRewrite(): void;
    resetCodexProviderAfterCompaction(compaction: CodexCompactionContext): void;
    resetPlanReference(): void;
    syncTodoPhasesFromBranch(): void;
    resetAdvisorRuntimes(reason?: string): void;
    rebaseAfterCompaction(): void;
    recordAnchoredHistoryRewrite(tokensRemoved: number): void;
    getContextBreakdown(options?: {
        contextWindow?: number;
        pendingMessages?: AgentMessage[];
    }): ContextUsageBreakdown | undefined;
    getContextUsage(options?: {
        contextWindow?: number;
    }): ContextUsage | undefined;
    shake(mode: ShakeMode, options?: {
        config?: ShakeConfig;
        signal?: AbortSignal;
    }): Promise<ShakeResult>;
    dropImages(): Promise<{
        removed: number;
    }>;
    generateHandoffDocument(customInstructions?: string, options?: SessionHandoffOptions): Promise<HandoffResult | undefined>;
    removeAssistantMessageFromActiveContext(message: AssistantMessage): void;
    dropPersistedAssistantTurn(message: AssistantMessage): Promise<string | undefined>;
    runRecoveryCompactionWithRollback(reason: "overflow" | "incomplete", message: AssistantMessage, allowDefer: boolean, options: {
        autoContinue: boolean;
        triggerContextTokens?: number;
    }): Promise<CompactionCheckResult>;
    parseRetryAfterMsFromError(errorMessage: string): number | undefined;
    setModelTemporary(model: Model, thinkingLevel?: ConfiguredThinkingLevel, options?: {
        ephemeral?: boolean;
    }): Promise<void>;
    abort(options?: {
        goalReason?: "interrupted" | "internal";
        reason?: string;
        preserveCompaction?: boolean;
    }): Promise<void>;
    abortHandoff(): void;
}
/** Owns compaction, pruning, shake, promotion, and automatic context maintenance. */
export declare class SessionMaintenance {
    #private;
    constructor(host: SessionMaintenanceHost);
    /** Whether manual or automatic context maintenance is active. */
    get isCompacting(): boolean;
    /** Background speculative-compaction state, for UI indicators. */
    get speculationState(): "idle" | "running" | "armed";
    /** Abort and discard any in-flight or armed speculative compaction. */
    cancelSpeculation(): void;
    /** Assistant timestamp whose post-turn maintenance must be skipped once. */
    get skipPostTurnMaintenanceAssistantTimestamp(): number | undefined;
    set skipPostTurnMaintenanceAssistantTimestamp(timestamp: number | undefined);
    /**
     * Strip image content blocks from every message on the current branch and
     * persist the rewrite. Walks `SessionManager.getBranch()` in place — both
     * `SessionMessageEntry.message` and `CustomMessageEntry.content` arrays
     * are mutated, then `rewriteEntries` durably commits the new shape. The
     * agent's runtime view is rebuilt from the freshly-mutated entries so any
     * provider sessions caching message identity (Codex Responses) are torn
     * down to force a clean replay on the next turn.
     *
     * No-op when the branch carries no images; returns `{ removed: 0 }` and
     * skips the disk rewrite.
     */
    dropImages(): Promise<{
        removed: number;
    }>;
    /**
     * Surgically reduce context by dropping heavy content ("shake").
     *
     * - `images` delegates to {@link dropImages}.
     * - `thinking` removes assistant reasoning blocks without replacement text.
     * - `elide` replaces whole tool-call results and large fenced/XML blocks
     *   with short placeholders that embed an `artifact://` recovery link.
     *
     * Mutates the branch in place, persists via `rewriteEntries`, replays the
     * rebuilt context through the agent, and tears down provider sessions that
     * cache message identity — same rewrite contract as {@link dropImages}.
     *
     * No-op (zero counts) when nothing is eligible.
     */
    shake(mode: ShakeMode, opts?: {
        config?: ShakeConfig;
        signal?: AbortSignal;
    }): Promise<ShakeResult>;
    /**
     * Manually compact the session context.
     * Aborts current agent operation first.
     * @param customInstructions Optional instructions for the compaction summary
     * @param options Optional callbacks for completion/error handling
     */
    compact(customInstructions?: string, options?: CompactOptions, methodOffset?: number, retryController?: AbortController): Promise<CompactionResult>;
    /**
     * Cancel in-progress context maintenance and return the active manual pass's
     * cleanup barrier. The barrier resolves only after its agent subscription reconnects.
     */
    abortCompaction(reason?: unknown): Promise<void> | undefined;
    /**
     * Resolves once an in-flight manual compaction has reconnected the agent
     * subscription and re-drained its preserved queues; `undefined` when no manual
     * compaction is active. Callers that must not start a turn against the
     * disconnected session (e.g. ordinary prompts) await this first.
     */
    get manualCompactionCleanup(): Promise<void> | undefined;
    /** Cancel only automatic maintenance while preserving a manual compaction. */
    abortAutomaticCompaction(): void;
    /** Trigger idle compaction through the auto-compaction flow (with UI events). */
    runIdleCompaction(): Promise<void>;
    /**
     * Manual handoff: generate a handoff document and commit it as a compaction
     * entry on the current session — the document becomes the summary and recent
     * history is kept per `compaction.keepRecentTokens`. Unlike `/compact`, the
     * live agent is not aborted; generation reads a snapshot of the live
     * messages through the cache-friendly side-request pipeline.
     */
    handoff(customInstructions?: string, options?: SessionHandoffOptions): Promise<HandoffResult | undefined>;
    /**
     * Start a background speculative compaction when context has entered the
     * pre-threshold band `[threshold − lead, threshold)`. The produced summary
     * is held (armed) and committed instantly by the next real maintenance
     * pass, hiding summarization latency. Only LLM-backed methods
     * (remote/handoff/soft) are speculated — shake and snapcompact are local
     * and effectively instant. Never rewrites history itself; stale results are
     * discarded by apply-time branch validation in {@link #claimArmedSpeculation}.
     * A turn that jumps past the threshold before a run armed is handled by
     * {@link deferThresholdCompactionToSpeculation}'s grace band instead.
     */
    maybeStartSpeculativeCompaction(contextTokens: number, contextWindow: number): void;
    /**
     * Grace band above the compaction threshold: when a single turn jumps past
     * the threshold before the background speculation armed (or even started),
     * the threshold pass keeps serving the user instead of blocking on a
     * synchronous summarization — the speculation finishes in the background
     * and the next maintenance boundary splices it in for free. Returns true
     * while deferral is in effect (a run was live, or one was started here);
     * the caller MUST skip its blocking compaction then.
     *
     * Deferral ends — and the blocking pass resumes — once context grows past
     * `threshold + lead`, clamped to keep {@link SPECULATION_LEAD_MIN_TOKENS}
     * of headroom below the window. A provider overflow inside the band is
     * recovered by the existing overflow path (compact + retry). Never defers
     * for local-first method orders (shake/snapcompact are instant), when
     * async compaction is disabled, or when a `session_before_compact`
     * extension must keep exact blocking semantics.
     */
    deferThresholdCompactionToSpeculation(contextTokens: number, contextWindow: number): boolean;
    runPrePromptCompactionIfNeeded(messages: AgentMessage[]): Promise<void>;
    /**
     * Compact continuing tool-loop runs before the next provider request.
     *
     * `onTurnEnd` is the safe boundary: tool results for the just-finished turn
     * are already paired in `activeMessages`, the live array the agent loop reads
     * before its next model call. Before compacting, the just-finished turn is
     * synchronously persisted if async message hooks have not reached the normal
     * append path yet.
     */
    maintainContextMidRun(activeMessages: AgentMessage[], signal: AbortSignal | undefined, context: AgentTurnEndContext | undefined): Promise<void>;
    /**
     * Check if context maintenance or promotion is needed and run it.
     * Called after agent_end and before prompt submission.
     *
     * Four cases (in order):
     * 1. Input overflow + promotion: promote to larger model, retry without maintenance.
     * 2. Input overflow + no promotion target: run context maintenance, auto-retry on same model.
     * 3. Output incomplete (stopReason === "length", e.g. `response.incomplete`): the
     *    model burned its output budget without producing an actionable deliverable
     *    (reasoning-only or truncated). Drop the dead turn, try promotion, otherwise
     *    run compaction/handoff and retry.
     * 4. Threshold: context over threshold, run context maintenance (no auto-retry).
     *
     * @param assistantMessage The assistant message to check
     * @param skipAbortedCheck If false, include aborted messages (for pre-prompt check). Default: true
     * @param allowDefer If true, a threshold-driven handoff preference may schedule
     *   itself as a deferred post-prompt task instead of running inline. Callers running
     *   inside the `agent_end` handler set this to true so `session.prompt()` resolves
     *   cleanly; callers on the pre-prompt path (where the next agent turn is about to
     *   start) set it to false to avoid racing the deferred handoff against the new turn.
     * @param autoContinue Whether maintenance may schedule the agent-authored continuation prompt.
     * @returns whether compaction/recovery scheduled a handoff, retry, auto-continue, or
     *   queued-message drain that already owns the next turn. Callers MUST skip
     *   `session_stop` and other agent continuations when `continuationScheduled`
     *   is true.
     */
    checkCompaction(assistantMessage: AssistantMessage, skipAbortedCheck?: boolean, allowDefer?: boolean, autoContinue?: boolean): Promise<CompactionCheckResult>;
    resolveContextPromotionTarget(currentModel: Model, contextWindow: number, signal?: AbortSignal): Promise<Model | undefined>;
    resolveCompactionModelCandidates(preferredModel: Model | null | undefined, availableModels: Model[], filter?: (model: Model) => boolean): Model[];
    /**
     * Whether the current stored context fits `model`'s usable window
     * (`contextWindow - reserve`), using the same reserve resolution as
     * compaction. This is deliberately independent of `compaction.enabled`: an
     * oversized request overflows the provider whether or not compaction would
     * have run, so a fit check must judge the raw budget.
     *
     * The default absolute reserve can exceed bundled small-context windows, or
     * nearly consume a 16k-class window; those known-impossible defaults fall
     * back to the proportional 15% reserve. Explicit valid reserves still define
     * the usable prompt budget so callers do not enter headroom the user
     * intentionally reserved.
     *
     * Used by the retry-fallback selector to skip a candidate whose window cannot
     * hold the retry context before switching onto it, and (via
     * {@link #compactionCreatedRetryFit}) to decide whether an overflow recovery
     * produced a retryable prompt. `excludedMessage` identifies a failed assistant
     * turn that will be removed before retrying; subtracting it makes the selector
     * judge the request that will actually be sent. When the window is unknown we
     * cannot evaluate the budget, so we optimistically report a fit (preserving
     * prior behavior).
     */
    contextFitsModel(model: Model, excludedMessage?: AssistantMessage): boolean;
    /**
     * Internal: Run auto-compaction with events.
     *
     * @param allowDefer If true (default), a threshold-driven handoff preference
     *   may schedule itself as a deferred post-prompt task and return a
     *   deferred-handoff result immediately. The caller MUST avoid separately
     *   scheduling `agent.continue()` then; pre-prompt callers pass `false` to
     *   complete the handoff before the next agent turn begins.
     * @returns whether auto-compaction scheduled a follow-up turn.
     */
    runAutoCompaction(reason: "overflow" | "threshold" | "idle" | "incomplete", willRetry: boolean, deferred?: boolean, allowDefer?: boolean, options?: {
        autoContinue?: boolean;
        triggerContextTokens?: number;
        suppressContinuation?: boolean;
        phase?: CodexCompactionContext["phase"];
        terminalTextAnswer?: boolean;
        /** Mid-turn: splice history then return; do not await UI/extension fan-out. */
        detachPostCommit?: boolean;
        /** Index to resume from after an earlier preferred method failed. */
        methodIndex?: number;
        /** A preceding shake already rewrote history before this fallback attempt. */
        fallbackFromShake?: boolean;
    }): Promise<CompactionCheckResult>;
    /**
     * Toggle auto-compaction setting.
     */
    setAutoCompactionEnabled(enabled: boolean): void;
    /** Whether automatic maintenance has an enabled method to run. */
    get autoCompactionEnabled(): boolean;
}
