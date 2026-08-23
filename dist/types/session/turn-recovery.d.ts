import { type Agent, type AgentMessage, type ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { AssistantMessage, CodexCompactionContext, Effort, Model, ToolChoice } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import { type ConfiguredThinkingLevel } from "../thinking.js";
import type { AgentSessionEvent } from "./agent-session-events.js";
import type { InitialRetryFallbackState, UsageFallbackConfirmer } from "./agent-session-types.js";
import { type RetryFallbackSelector, type ServingModel } from "./retry-fallback-chains.js";
import type { SessionManager } from "./session-manager.js";
/** Result shape shared with automatic maintenance recovery. */
export interface RecoveryCompactionResult {
    deferredHandoff: boolean;
    continuationScheduled: boolean;
    automaticContinuationBlocked?: boolean;
    historyRewritten?: boolean;
}
/** Capabilities borrowed from the owning AgentSession. */
export interface TurnRecoveryHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    modelRegistry: ModelRegistry;
    configWarnings: string[];
    model(): Model | undefined;
    /**
     * Whether the live context fits `model`'s usable window. `excludedMessage`
     * identifies a failed assistant turn that will be removed before retrying, so
     * selection judges the request that will actually be sent. See
     * `SessionMaintenance.contextFitsModel`.
     */
    contextFitsModel(model: Model, excludedMessage?: AssistantMessage): boolean;
    /** Whether streamed text has already been committed to the active output sink. */
    textOutputCommitted(): boolean;
    thinkingLevel(): ThinkingLevel | undefined;
    configuredThinkingLevel(): ConfiguredThinkingLevel | undefined;
    setThinkingLevel(level: ConfiguredThinkingLevel | undefined): void;
    /** Hard per-session effort ceiling; fallback recovery must never raise thinking above it. */
    thinkingLevelCeiling(): Effort | undefined;
    isDisposed(): boolean;
    isStreaming(): boolean;
    isCompacting(): boolean;
    abortInProgress(): boolean;
    streamingEditAbortTriggered(): boolean;
    promptGeneration(): number;
    sessionId(): string;
    emitSessionEvent(event: AgentSessionEvent): Promise<void>;
    scheduleAgentContinue(options: {
        delayMs?: number;
        generation?: number;
        onError?: (error: unknown) => void;
    }): void;
    waitForSessionMessagePersistence(message: AssistantMessage): Promise<void>;
    appendSessionMessage(message: AssistantMessage): void;
    persistedAssistantEntryId(message: AssistantMessage): string | undefined;
    sessionMessageAlreadyPersisted(message: AssistantMessage): boolean;
    setModelWithProviderSessionReset(model: Model): Promise<void>;
    resetCurrentResponsesProviderSession(reason: string): void;
    /**
     * Spend a saved Codex reset for the blocked pool, if eligible.
     * `activeBlockUnblockAtMs` is the absolute unblock time parsed from the
     * live usage-limit error — authoritative for the active account when the
     * usage report still shows a pre-block snapshot.
     */
    maybeAutoRedeemCodexReset(activeBlockUnblockAtMs?: number): Promise<boolean>;
    runAutoCompaction(reason: "overflow" | "threshold" | "idle" | "incomplete", willRetry: boolean, deferred?: boolean, allowDefer?: boolean, options?: {
        autoContinue?: boolean;
        triggerContextTokens?: number;
        suppressContinuation?: boolean;
        suppressHandoff?: boolean;
        phase?: CodexCompactionContext["phase"];
        terminalTextAnswer?: boolean;
    }): Promise<RecoveryCompactionResult>;
    withBashBranchTransition<T>(operation: () => T): T;
}
/** Construction-time retry state restored from model selection. */
export interface TurnRecoveryOptions {
    initialRetryFallback?: InitialRetryFallbackState;
}
/** Owns terminal-stop recovery, automatic retries, and fallback routing. */
export declare class TurnRecovery {
    #private;
    constructor(host: TurnRecoveryHost, options?: TurnRecoveryOptions);
    /** Current automatic retry attempt. */
    get attempt(): number;
    /** Promise settled when the active retry saga finishes. */
    get retryPromise(): Promise<void> | undefined;
    /**
     * Model this session's produced work is attributed to.
     *
     * A model switch is a routing decision, not evidence the target can produce
     * anything: a candidate that errors on its first request produced none of the
     * turns already in this session. So attribution only ever names a model that
     * has settled a turn here, and a switch — into a fallback, back to a restored
     * primary, or anywhere else — moves it only once the new model answers.
     *
     * Before anything has served there is no earlier work to miscredit, so the
     * configured model is both the only available answer and a safe one.
     */
    get servingModel(): ServingModel | undefined;
    /**
     * Carries attribution onto a new session id that continues this conversation.
     *
     * The session-id anchor assumes a new id means an unrelated transcript, which
     * holds for `/new` and for resuming something else. A fork breaks that
     * assumption on purpose: it clones the transcript and keeps running the same
     * recovery state under a fresh id. Dropping attribution there would bootstrap
     * an unproven fallback as the primary and re-credit it with the work the
     * previous model did — the very bug the anchor exists to prevent.
     *
     * Only state belonging to `previousSessionId` moves, so an id left behind by
     * an earlier switch stays expired.
     */
    reanchorServedAttribution(previousSessionId: string): void;
    /** Resets per-prompt recovery counters and terminal-stop acceptance. */
    resetForNewPrompt(): void;
    /** Sets whether one terminal empty stop is accepted for the current prompt. */
    setAcceptTerminalEmptyStop(accept: boolean): void;
    /**
     * Records which model produced this turn, marks an active fallback as having
     * served, then closes a successful retry saga and annotates recovered
     * persisted errors.
     */
    onAssistantSettledSuccessfully(message: AssistantMessage): Promise<void>;
    /** Closes a failed retry saga when no compaction continuation took ownership. */
    onErrorSettledWithoutRetry(message: AssistantMessage, compaction: RecoveryCompactionResult): Promise<void>;
    /** Persists an otherwise skipped terminal empty error turn. */
    persistTerminalEmptyErrorTurn(message: AssistantMessage): Promise<void>;
    /** Handles empty terminal assistant turns and schedules bounded recovery. */
    handleEmptyAssistantStop(message: AssistantMessage): Promise<"continue" | "terminal" | undefined>;
    /** Classifies suspicious terminal stops and schedules bounded recovery. */
    handleUnexpectedAssistantStop(message: AssistantMessage): Promise<boolean>;
    /** Removes a persisted failed assistant turn after its persistence slot settles; returns the dropped branch entry id. */
    dropPersistedAssistantTurn(message: AssistantMessage): Promise<string | undefined>;
    /** Runs recovery compaction and restores the failed turn when no rewrite occurs. */
    runRecoveryCompactionWithRollback(reason: "overflow" | "incomplete", message: AssistantMessage, allowDefer: boolean, options: {
        autoContinue: boolean;
        triggerContextTokens?: number;
    }): Promise<RecoveryCompactionResult>;
    /**
     * Restores the configured primary after fallback cooldown expiry.
     * @returns true when the active model was actually switched back to the
     * primary, so callers can re-run the pre-send context-fit check against the
     * reverted (possibly smaller) window before issuing the next request.
     */
    maybeRestoreRetryFallbackPrimary(): Promise<boolean>;
    /** Applies model fallback policy from live usage health before a turn starts. */
    maybeApplyUsageAwareFallback(signal: AbortSignal, confirmer?: UsageFallbackConfirmer): Promise<boolean>;
    /** Applies automatic retry, credential rotation, and model fallback policy. */
    handleRetryableError(message: AssistantMessage, options?: {
        allowModelFallback?: boolean;
        fireworksFastFallback?: boolean;
        hardErrorFallback?: boolean;
        preserveFailedTurn?: boolean;
    }): Promise<boolean>;
    /**
     * Records a usage-limit failure before replay eligibility decides whether the
     * failed turn may be discarded. Returns whether credential recovery switched
     * the active account.
     */
    recordUsageLimitOutcome(message: AssistantMessage): Promise<boolean>;
    /** Prompts after transient overlap with a prior agent run. */
    promptAgentWithIdleRetry(messages: AgentMessage[], options?: {
        toolChoice?: ToolChoice;
    }): Promise<void>;
    /** Parses provider retry and rate-limit reset hints into a delay. */
    parseRetryAfterMsFromError(errorMessage: string): number | undefined;
    /** Resolve the pending retry promise */
    resolveRetry(): void;
    removeAssistantMessageFromActiveContext(assistantMessage: AssistantMessage, reason?: string): void;
    /**
     * Drop an assistant turn from BOTH the live agent context and the persisted
     * session branch (reparenting the leaf to the turn's parent), so a discarded
     * turn does not resurface on reload. Used for empty/reasoning-only stops and
     * the Gemini header-runaway interrupt, which must not replay a partial,
     * loop-fueling thinking block.
     */
    discardAssistantTurn(assistantMessage: AssistantMessage): string | undefined;
    /**
     * Retry an empty, reason-less provider abort: a turn with no content that
     * carries the generic sentinel (bare `abort()`), whether the provider
     * finalized it as `stopReason: "aborted"` or leaked it as `stopReason:
     * "error"` (a stalled/dropped stream reported as an error rather than an
     * abort — issue #5375). Only fires while the session is neither aborting nor
     * tearing down. A user/lifecycle abort (`#abortInProgress`), a dispose-driven
     * abort (`#isDisposed`), or a session-induced streaming-edit guard abort
     * (`StreamingEditGuard.abortTriggered` — auto-generated-file guard or failed-patch
     * preview) is deliberate and MUST settle the turn instead: routing it through
     * retry would orphan `#retryPromise` on a continuation the guard skips
     * (hanging the in-flight `prompt()`) or silently undo the guard's intended
     * abort. Deliberate user interrupts (`UserInterrupt`) and silent aborts carry
     * their own marker, not the generic sentinel, so they never match here.
     */
    isRetryableReasonlessAbort(message: AssistantMessage): boolean;
    /**
     * Check if an error is retryable (transient errors, usage limits, or
     * account-scoped policy denials that can rotate credentials).
     * Context overflow is NOT retryable (handled by compaction instead).
     */
    isRetryableError(message: AssistantMessage): boolean;
    /**
     * Classify a reasonless abort, idle stream stall, HTTP/2 stream reset, or
     * premature stream close whose emitted tool calls all have results. The failed
     * assistant/tool-result pair stays in context so continuation cannot replay
     * completed side effects; synthetic results tell the next turn that an
     * unexecuted call must be reissued.
     */
    classifyResolvedInterruptedToolTurn(message: AssistantMessage): "reasonless-abort" | "stream-stall" | undefined;
    /** Checks whether a provider error represents a classifier refusal. */
    isClassifierRefusal(message: AssistantMessage): boolean;
    /** Clears fallback ownership after an explicit model change or a restore. */
    clearActiveRetryFallback(): void;
    /** Checks whether a fallback selector remains in cooldown. */
    isRetryFallbackSelectorSuppressed(selector: RetryFallbackSelector): boolean;
    /** Records the cooldown that should suppress a failing selector. */
    noteRetryFallbackCooldown(currentSelector: string, retryAfterMs: number | undefined, errorMessage: string): void;
    /**
     * Map the failing model selector to the chain key that owns it, by
     * specificity: an exact model-selector key, then a `provider/*` wildcard,
     * then a model role whose current assignment matches, then `default`.
     * Model-oriented keys win over roles so a chain follows the model across
     * role reassignments.
     */
    resolveRetryFallbackRole(currentSelector: string, currentModel?: Model | null | undefined, roleHint?: string): string | undefined;
    /**
     * Chain keys to consult for the active model, most specific walk first: the
     * chain that owns the current fallback walk, then the chain the CURRENT model
     * owns when that is a different key.
     *
     * The second key is what makes a chain reachable from the end of another one.
     * `#activeRetryFallback.role` is pinned at the first hop and never
     * re-resolved, so a session that lands on the last entry of one chain has no
     * candidate left and retries the same model until the budget is gone — even
     * when that entry is itself a chain key with its own fallbacks configured
     * (`anthropic/claude-opus-5 -> … -> runinfra/deepseek-v4-pro`, whose own
     * `runinfra/deepseek-v4-pro -> openrouter/deepseek/…` chain was unreachable).
     *
     * Two keys is the whole walk per attempt. Chains that point at each other
     * alternate models instead of looping in place, and every hop still spends a
     * retry attempt, so the budget terminates either way.
     */
    retryFallbackChainKeys(currentSelector: string, currentModel?: Model | null | undefined, options?: {
        pinnedRole?: string;
        roleHint?: string;
    }): string[];
    /** Finds fallback candidates that follow the active selector. */
    findRetryFallbackCandidates(role: string, currentSelector: string, currentModel?: Model | null | undefined): RetryFallbackSelector[];
    applyRetryFallbackCandidate(role: string, selector: RetryFallbackSelector, currentSelector: string, options?: {
        pinFallback?: boolean;
        apiKey?: string;
        signal?: AbortSignal;
    }): Promise<boolean>;
    /**
     * True when the current turn failed on a Fireworks Fast (`-fast`) model in a
     * way that should degrade to the reliable base (Standard) model. Fast is a
     * speed-optimized router with no SLA, so any *pre-content* failure — a
     * transient overload/5xx or a hard "router/model not found / unsupported" —
     * is worth retrying on the base id. Skips failures the base model shares:
     * context overflow (compaction's job), usage limits and auth errors (same
     * account/key), and turns that already emitted any replay-unsafe output.
     * Requires the base model to exist in the registry.
     */
    isFireworksFastFallbackEligible(message: AssistantMessage): boolean;
    /**
     * True when a turn failed with a hard (non-retryable) provider error but a
     * configured `retry.fallbackChains` entry covers the active model: the same
     * model is not worth retrying, yet a DIFFERENT model is a fresh chance, so
     * the chain is consulted before the error becomes final. Skips failures a
     * model switch cannot fix or must not replay: cancellations (abort-flavored
     * errors are not model faults), context overflow (compaction's job),
     * classifier refusals (chain consult is handled on the retryable path with
     * `pinFallback`), and turns that already emitted replay-unsafe output.
     */
    isHardErrorFallbackEligible(message: AssistantMessage): boolean;
    /**
     * Cancel in-progress retry.
     */
    abortRetry(): void;
    /** Whether auto-retry is currently in progress */
    get isRetrying(): boolean;
    /** Whether auto-retry is enabled */
    get autoRetryEnabled(): boolean;
    /**
     * Toggle auto-retry setting.
     */
    setAutoRetryEnabled(enabled: boolean): void;
    /**
     * Manually retry the last failed assistant turn.
     * Removes the error message from active agent state when present and
     * re-attempts with a fresh retry budget.
     *
     * A stream that stalls or aborts mid-tool-call ends the turn with
     * `stopReason: "error" | "aborted"` and then appends one synthetic
     * {@link isSyntheticToolResultMessage tool_result} per emitted tool call to
     * preserve the provider's tool_use/tool_result pairing (see
     * `createAbortedToolResult` in `agent-loop.ts`). Those placeholders trail the
     * failed assistant turn, so the retry lookback walks back over them before
     * checking the assistant message; it strips both the placeholders and the
     * failed turn before re-attempting.
     *
     * A restored session deliberately omits failed assistant turns from provider
     * context. In that case, the persisted display transcript remains the source
     * of truth for whether the current branch has a retryable failed tail.
     *
     * @returns true if retry was initiated, false if no failed turn to retry or agent is busy
     */
    retry(): Promise<boolean>;
}
