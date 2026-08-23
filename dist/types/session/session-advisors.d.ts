import { Agent, type AgentMessage, type AgentTool, type AgentToolContext, type StreamFn } from "@oh-my-pi/pi-agent-core";
import type { CodexCompactionContext, Context, Message, Model, ProviderSessionState, ServiceTier, SimpleStreamOptions } from "@oh-my-pi/pi-ai";
import { type AdvisorConfig, type AdvisorRuntimeStatus } from "../advisor/index.js";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import { type CursorMcpResourceAdapter } from "../cursor.js";
import type { PlanModeState } from "../plan-mode/state.js";
import type { SecretObfuscator } from "../secrets/obfuscator.js";
import type { AgentSessionEvent } from "./agent-session-events.js";
import type { ClientBridge } from "./client-bridge.js";
import type { CustomMessage, CustomMessagePayload } from "./messages.js";
import { type RetryFallbackSelector } from "./retry-fallback-chains.js";
import type { SessionManager } from "./session-manager.js";
import type { YieldQueue } from "./yield-queue.js";
/** Advisor statistics for the advisor status command. */
export interface AdvisorStats {
    configured: boolean;
    active: boolean;
    model?: Model;
    contextWindow: number;
    contextTokens: number;
    tokens: {
        input: number;
        output: number;
        reasoning: number;
        cacheRead: number;
        cacheWrite: number;
        total: number;
    };
    cost: number;
    messages: {
        user: number;
        assistant: number;
        total: number;
    };
    /** Per-advisor breakdown for every configured advisor. */
    advisors: PerAdvisorStat[];
}
/** One advisor's status, token usage, cost, and message counts. */
export interface PerAdvisorStat {
    name: string;
    status: AdvisorRuntimeStatus;
    model?: Model;
    contextWindow: number;
    contextTokens: number;
    tokens: AdvisorStats["tokens"];
    cost: number;
    messages: AdvisorStats["messages"];
    sessionId?: string;
}
/** Inputs that configure the advisor roster owned by a session. */
export interface SessionAdvisorsOptions {
    enabled: boolean;
    tools?: AgentTool[];
    /**
     * Build a `grep` honoring a Cursor `pi_grep` frame's own context width and
     * match cap. The advisor's tools are fixed instances carrying session
     * defaults, so without this an advisor running against Cursor silently
     * drops both fields — the same gap the primary bridge closes.
     */
    createGrepTool?(options: {
        context?: number;
        totalMatchLimit?: number;
    }): AgentTool | undefined;
    /**
     * Build the `replace`-mode `edit` a Cursor `pi_edit` frame needs. The
     * advisor's own instance follows the configured `edit.mode` (`hashline` by
     * default), whose schema the frame's `old_string`/`new_string` args do not
     * match, so without this every native advisor edit fails validation.
     */
    createEditTool?(): AgentTool | undefined;
    /**
     * The execute-time context the bridge's tools resolve approval from.
     *
     * `ExtensionToolWrapper` reads the approval mode, per-tool policies and
     * `autoApprove` only from here; with none it falls back to `yolo` and empty
     * policies, so a native frame would run past a configured `ask` or `deny`.
     */
    getToolContext?: () => AgentToolContext | undefined;
    /**
     * The live MCP connections Cursor's resource frames answer from.
     *
     * Advisors share the session's connections and may hold tools from those
     * same servers, so without this their frames report that every server
     * advertises nothing.
     */
    mcpResources?: CursorMcpResourceAdapter;
    watchdogPrompt?: string;
    sharedInstructions?: string;
    contextPrompt?: string;
    configs?: AdvisorConfig[];
    streamFn?: StreamFn;
    transformProviderContext?: (context: Context, model: Model) => Context | Promise<Context>;
    /** Advisor spend already persisted for this session, restored on resume. */
    initialCosts?: ReadonlyMap<string, number>;
}
/** Options accepted when an advisor injects a primary-session message. */
export interface AdvisorMessageDeliveryOptions {
    triggerTurn?: boolean;
    deliverAs?: "steer" | "followUp" | "nextTurn";
    queueChipText?: string;
    acceptTerminalEmptyStop?: boolean;
}
/** Session capabilities borrowed by the advisor controller. */
export interface SessionAdvisorsHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    modelRegistry: ModelRegistry;
    yieldQueue: YieldQueue;
    obfuscator: SecretObfuscator | undefined;
    providerSessionState: Map<string, ProviderSessionState>;
    preferWebsockets: boolean | undefined;
    onPayload: SimpleStreamOptions["onPayload"] | undefined;
    onResponse: SimpleStreamOptions["onResponse"] | undefined;
    onSseEvent: SimpleStreamOptions["onSseEvent"] | undefined;
    isDisposed(): boolean;
    abortInProgress(): boolean;
    allowAgentInitiatedTurns(): boolean;
    planModeState(): PlanModeState | undefined;
    clientBridge(): ClientBridge | undefined;
    emitSessionEvent(event: AgentSessionEvent): Promise<void>;
    emitNotice(level: "info" | "warning" | "error", message: string, source?: string): void;
    sendCustomMessage(message: CustomMessagePayload, options?: AdvisorMessageDeliveryOptions): Promise<boolean>;
    extractQueuedAdvisorCards(): CustomMessage[];
    dropPendingAdvisorCards(): void;
    preserveAdvisorCard(card: CustomMessage): void;
    hasPendingNextTurnMessages(): boolean;
    convertToLlmForSideRequest(messages: AgentMessage[]): Message[];
    effectiveServiceTier(model: Model): ServiceTier | undefined;
    resolveContextPromotionTarget(currentModel: Model, contextWindow: number, signal: AbortSignal): Promise<Model | undefined>;
    resolveCompactionModelCandidates(preferredModel: Model | null | undefined, availableModels: Model[]): Model[];
    resolveRetryFallbackRole(currentSelector: string, currentModel?: Model | null, roleHint?: string): string | undefined;
    retryFallbackChainKeys(currentSelector: string, currentModel?: Model | null, options?: {
        pinnedRole?: string;
        roleHint?: string;
    }): string[];
    findRetryFallbackCandidates(role: string, currentSelector: string, currentModel?: Model | null): RetryFallbackSelector[];
    isRetryFallbackSelectorSuppressed(selector: RetryFallbackSelector): boolean;
    noteRetryFallbackCooldown(currentSelector: string, retryAfterMs: number | undefined, errorMessage: string): void;
    createCodexCompactionContext(options: {
        trigger: CodexCompactionContext["trigger"];
        reason: CodexCompactionContext["reason"];
        phase: CodexCompactionContext["phase"];
    }): CodexCompactionContext;
    sessionId(): string;
}
/** Owns advisor runtimes, delivery policy, context maintenance, and status reporting. */
export declare class SessionAdvisors {
    #private;
    constructor(host: SessionAdvisorsHost, options: SessionAdvisorsOptions);
    /** Delivers one completed primary turn to every live advisor. */
    onPrimaryTurnEnd(messages: AgentMessage[], willContinue: boolean | undefined, signal?: AbortSignal): Promise<void>;
    /** Rebuilds live advisors when role assignments alter their resolved runtime inputs. */
    onModelRolesChanged(): void;
    /**
     * True when the enabled advisor roster still has an entry left at `no_model`.
     *
     * At construction the advisor role is resolved against whatever the model
     * catalog holds at that instant. Discovery-backed providers (e.g. GitHub
     * Copilot) may not have populated the registry yet, so a valid configured
     * model can transiently fail to resolve and record `no_model`. See #9010.
     */
    hasInactiveNoModelAdvisor(): boolean;
    /**
     * Reactivate an enabled advisor stuck at `no_model` after the initial
     * background model discovery settles, so a valid configured model that was
     * merely late to the catalog starts without a manual `/advisor` toggle. The
     * rebuild is quiet (no warnings) because a warning was already emitted at
     * construction. Returns true when the rebuild brought an advisor online so the
     * caller can refresh the status line. See #9010.
     */
    retryAfterModelDiscovery(): boolean;
    /** Starts configured advisor runtimes when they are eligible. */
    buildRuntime(seedToCurrent?: boolean): boolean;
    /** Stops every advisor runtime and starts recorder shutdown. */
    stopRuntime(): void;
    /**
     * Pause advisor work while old-session recorder feeds remain attached, then
     * detach only after any active prompt has settled.
     */
    drainAndDetachRecorders(): Promise<void>;
    /** Detaches and drains recorder feeds before transcript artifacts are removed. */
    detachAndCloseRecorders(): Promise<void>;
    /** Reattach recorder feeds and resume work after a rolled-back or preserving transition. */
    reattachRecorderFeeds(): void;
    /** Re-primes advisor transcript views across a conversation boundary. */
    resetSessionState(options?: {
        preserveCost?: boolean;
    }): void;
    /** Drop the recorded spend once a conversation boundary has committed. */
    clearCost(): void;
    /** Replace the ledger with the spend recorded for the session becoming active. */
    restoreCost(costs: ReadonlyMap<string, number>): void;
    /**
     * Rebind every live advisor to the active primary conversation's provider
     * identity (session id, prompt-cache key, credential + metadata resolvers,
     * telemetry). Invoked on every provider-session change — including branch
     * paths that skip conversation restore — so advisors never keep emitting the
     * previous conversation's session id/metadata (issue #6625).
     */
    refreshProviderIdentity(): void;
    /** Re-primes advisor transcript views after an in-conversation history rewrite. */
    resetAllRuntimes(reason?: string): void;
    /** Whether live runtimes still match the resolved advisor configuration. */
    runtimeMatchesCurrentConfig(): boolean;
    /** Whether concern/blocker delivery is inside the post-interrupt immunity window. */
    isInterruptImmuneTurnActive(): boolean;
    /** Latest aggregate recorder-close barrier. */
    recorderClosed(): Promise<void>;
    /** Whether a user interrupt currently suppresses advisor-driven auto-resume. */
    get autoResumeSuppressed(): boolean;
    set autoResumeSuppressed(value: boolean);
    /** Tracks persistence of a visible advisor card emitted outside the primary loop. */
    trackCardEvent(processing: Promise<void>): void;
    /** Waits for all advisor-card persistence handlers currently in flight. */
    waitForPendingCardEvents(): Promise<void>;
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
     * Swap the project context prompt handed to advisor sessions after context
     * files change (`/reload-plugins` edit/disable). Rebuilds live runtimes in
     * place so the next advisor turn evaluates against the current instructions;
     * a no-op when the rendered prompt is unchanged.
     */
    setContextPrompt(contextPrompt: string | undefined): void;
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
    /** Return cumulative advisor cost recorded for the current session. */
    getAdvisorCost(): number;
    /** Return whether any active or configured advisor is running on an OAuth/subscription model. */
    isUsingSubscription(): boolean;
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
}
