import { type Agent, ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Model, ProviderSessionState, ServiceTier, ServiceTierByFamily, ServiceTierFamily } from "@oh-my-pi/pi-ai";
import { Effort } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import { type ResolvedModelRoleValue } from "../config/model-resolver.js";
import type { Settings } from "../config/settings.js";
import { type ConfiguredThinkingLevel } from "../thinking.js";
import type { EditMode } from "../utils/edit-mode.js";
import type { AgentSessionEvent } from "./agent-session-events.js";
import type { ModelCycleResult, ResolvedRoleModel, RoleModelCycle, RoleModelCycleResult } from "./agent-session-types.js";
import type { SessionManager } from "./session-manager.js";
/** Capabilities borrowed from the owning AgentSession. */
export interface ModelControlsHost {
    agent: Agent;
    settings: Settings;
    modelRegistry: ModelRegistry;
    sessionManager: SessionManager;
    providerSessionState: Map<string, ProviderSessionState>;
    model(): Model | undefined;
    sessionId(): string;
    promptGeneration(): number;
    resolveActiveEditMode(): EditMode;
    syncAfterModelChange(previousEditMode: EditMode): Promise<void>;
    setModelWithProviderSessionReset(model: Model): Promise<void>;
    clearActiveRetryFallback(): void;
    clearInheritedProviderPromptCacheKey(): void;
    magicKeywordEnabled(keyword: "orchestrate" | "ultrathink" | "workflow"): boolean;
    emit(event: AgentSessionEvent): void;
    emitSessionEvent(event: AgentSessionEvent): Promise<void>;
    emitNotice(level: "info" | "warning" | "error", message: string, source?: string): void;
}
/** Owns model selection, thinking effort, role cycling, and service tiers. */
export declare class ModelControls {
    #private;
    constructor(host: ModelControlsHost, options: {
        scopedModels?: Array<{
            model: Model;
            thinkingLevel?: ThinkingLevel;
        }>;
        thinkingLevel?: ConfiguredThinkingLevel;
        thinkingLevelCeiling?: Effort;
        serviceTierByFamily?: ServiceTierByFamily;
    });
    /** Effective metadata-clamped thinking level applied to the agent. */
    get thinkingLevel(): ThinkingLevel | undefined;
    /** Hard per-session effort ceiling every thinking-level change is clamped to. */
    get thinkingLevelCeiling(): Effort | undefined;
    /** Configured selector, preserving `auto` while classification is active. */
    configuredThinkingLevel(): ConfiguredThinkingLevel | undefined;
    /** Whether per-turn automatic thinking classification is enabled. */
    get isAutoThinking(): boolean;
    /** Last concrete effort selected by automatic classification. */
    get autoResolvedThinkingLevel(): Effort | undefined;
    /** Models explicitly scoped to the session's cycle command. */
    get scopedModels(): ReadonlyArray<{
        model: Model;
        thinkingLevel?: ThinkingLevel;
    }>;
    /**
     * Replace the Ctrl+P cycle scope. Startup resolves the scope before background
     * provider discovery runs; the CLI re-pushes the fuller list here once discovery
     * completes so a newly-discovered `enabledModels` model joins the cycle and the
     * scoped `/models` picker (issue #9220).
     */
    setScopedModels(scopedModels: Array<{
        model: Model;
        thinkingLevel?: ThinkingLevel;
    }>): void;
    /** Live per-provider-family service-tier selection. */
    get serviceTierByFamily(): ServiceTierByFamily;
    /** Restores thinking state from a transcript without persisting a new entry. */
    restoreThinkingLevel(level: ConfiguredThinkingLevel | undefined): void;
    /** Restores an exact thinking snapshot after a failed session switch. */
    restoreThinkingSnapshot(level: ThinkingLevel | undefined, auto: boolean, resolved: Effort | undefined): void;
    /** Restores service tiers without persisting a duplicate transcript entry. */
    restoreServiceTiers(tiers: ServiceTierByFamily): void;
    resolveRoleModel(role: string): Model | undefined;
    resolveRoleModelWithThinking(role: string): ResolvedModelRoleValue;
    resolveTemporaryModelThinkingLevel(model: Model): ConfiguredThinkingLevel | undefined;
    setModel(model: Model, role?: string, options?: {
        selector?: string;
        thinkingLevel?: ThinkingLevel;
        persist?: boolean;
    }): Promise<{
        switched: boolean;
    }>;
    /**
     * Set model temporarily (for this session only).
     * Validates that a credential source is configured (synchronously, without
     * refreshing OAuth or running command-backed key programs), saves to session
     * log but NOT to settings.
     * @throws Error if no API key available for the model
     */
    setModelTemporary(model: Model, thinkingLevel?: ConfiguredThinkingLevel, options?: {
        ephemeral?: boolean;
    }): Promise<void>;
    /**
     * Cycle to next/previous model.
     * Uses scoped models (from --models flag) if available, otherwise all available models.
     * @param direction - "forward" (default) or "backward"
     * @returns The new model info, or undefined if only one model available
     */
    cycleModel(direction?: "forward" | "backward"): Promise<ModelCycleResult | undefined>;
    /**
     * Resolve the configured role models in the given order plus the index of
     * the currently active one. Roles that have no configured model, or whose
     * configured model is not currently available, are skipped. The `default`
     * role falls back to the active model when no explicit assignment exists.
     *
     * Returns `undefined` only when there is no current model or no available
     * models at all; an empty `models` array is never returned (callers should
     * still guard on `models.length`).
     */
    getRoleModelCycle(roleOrder: readonly string[]): RoleModelCycle | undefined;
    /**
     * Apply a resolved role model as the active model without changing global
     * settings. Shared with role cycling and the plan-approval model slider.
     */
    applyRoleModel(entry: ResolvedRoleModel): Promise<void>;
    /**
     * Cycle through configured role models in a fixed order.
     * Skips missing roles and changes only the active session model.
     * @param roleOrder - Order of roles to cycle through (e.g., ["slow", "default", "smol"])
     * @param direction - "forward" (default) or "backward"
     */
    cycleRoleModels(roleOrder: readonly string[], direction?: "forward" | "backward"): Promise<RoleModelCycleResult | undefined>;
    /**
     * Get all available models with valid API keys, filtered by `enabledModels` when configured.
     * See {@link filterAvailableModelsByEnabledPatterns} for supported pattern forms and limitations.
     */
    getAvailableModels(): Model[];
    /**
     * Set the thinking level. `auto` enables per-turn classification. Entering
     * auto writes its provisional level plus `configured: "auto"` immediately,
     * giving external readers an authoritative selection receipt before the next
     * user turn. Later classifications persist only changed concrete resolutions.
     */
    setThinkingLevel(level: ConfiguredThinkingLevel | undefined, persist?: boolean): void;
    /**
     * Cycle to next thinking level: off → auto → minimal..max → off.
     * @returns New selector, or undefined if model doesn't support thinking
     */
    cycleThinkingLevel(): ConfiguredThinkingLevel | undefined;
    /**
     * Classify the current user turn and set the effective thinking level for it.
     * Bounded by a timeout + abort; on failure it preserves the last classified
     * level, or uses the provisional concrete level before the first resolution.
     * Never throws into the turn, and never clears `#autoThinking`.
     */
    applyAutoThinkingLevel(promptText: string, generation: number): Promise<void>;
    /**
     * True when the currently selected model's family is set to `priority` — the
     * `/fast` on/off state for the active model. Returns false when no model is
     * selected or the model exposes no service-tier family (e.g. Fireworks, which
     * has its own Providers › Fireworks Tier toggle).
     *
     * For "is priority actually applied to the next request?" use
     * {@link isFastModeActive} instead.
     */
    isFastModeEnabled(): boolean;
    /**
     * True when `priority` is actually realized on the wire for the currently
     * selected model (OpenAI/Google `service_tier`, direct Anthropic fast mode,
     * or Fireworks priority). Returns false for tiers the active model can't
     * realize and when no model is selected.
     */
    isFastModeActive(): boolean;
    /**
     * Effective wire service-tier for a request to `model`. Fireworks models take
     * the Priority serving path only when the Providers › Fireworks Tier setting
     * is `"priority"` (and never for `-fast` variants, whose Fast serving path is
     * mutually exclusive with Priority). Every other model resolves the live
     * per-family tier map down to the entry for its family.
     */
    effectiveServiceTier(model?: Model | undefined): ServiceTier | undefined;
    /** The live per-family tier map, or `null` when empty (for session persistence). */
    serviceTierEntry(): ServiceTierByFamily | null;
    /** Set one family's tier (or clear it with `undefined`); persists the change. */
    setServiceTierFamily(family: ServiceTierFamily, tier: ServiceTier | undefined): void;
    /**
     * `/fast on|off` targets the family of the currently selected model: it sets
     * (or clears) that family's `priority` tier. Returns `false` when the model
     * has no service-tier family, so callers can report that fast mode is
     * unavailable instead of claiming success.
     */
    setFastMode(enabled: boolean): boolean;
    toggleFastMode(): boolean;
    /**
     * Get available thinking levels for current model.
     */
    getAvailableThinkingLevels(): ReadonlyArray<Effort>;
}
