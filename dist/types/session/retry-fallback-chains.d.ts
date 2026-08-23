import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Model } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import { type ConfiguredThinkingLevel } from "../thinking.js";
/** Configured fallback chains keyed by role or model selector. */
export type RetryFallbackChains = Record<string, string[]>;
/** Policy controlling restoration of a fallback chain's primary model. */
export type RetryFallbackRevertPolicy = "never" | "cooldown-expiry";
/** Parsed model selector used by retry fallback resolution. */
export interface RetryFallbackSelector {
    raw: string;
    provider: string;
    id: string;
    thinkingLevel: ThinkingLevel | undefined;
}
/** Minimal model lookup needed by fallback-chain resolution. */
export interface RetryFallbackModelLookup {
    find(provider: string, id: string): Model | undefined;
    hasProvider(provider: string): boolean;
}
/**
 * Inputs shared by startup (sdk) and runtime (turn-recovery) fallback-chain
 * resolution. `chains` is pre-expanded so callers can apply the default chain
 * to roles beyond the configured model roles (e.g. a subagent fallback role).
 */
export interface RetryFallbackResolutionContext {
    chains: RetryFallbackChains;
    getModelRole(role: string): string | undefined;
    modelLookup: RetryFallbackModelLookup;
}
/** Active retry fallback state retained until the primary can be restored. */
export interface ActiveRetryFallbackState {
    /** Chain key that produced this fallback: a model-role name or a model-selector key. */
    role: string;
    originalSelector: string;
    originalThinkingLevel: ConfiguredThinkingLevel | undefined;
    lastAppliedFallbackThinkingLevel: ConfiguredThinkingLevel | undefined;
    pinned: boolean;
    /**
     * Set once a turn on the fallback target settles successfully. Until then the
     * switch is only a routing decision — nothing has been produced by the new
     * model, so no observer may report the run as having used it.
     */
    served?: boolean;
}
/** Model a session's produced work is attributed to. */
export interface ServingModel {
    /** Full selector including routing and thinking level. */
    selector: string;
    /** Whether fallback routing, rather than the configured primary, owns it. */
    isFallback: boolean;
}
/** Calculates capped exponential retry delay with downward jitter. */
export declare function calculateRetryBackoffDelayMs(baseDelayMs: number, attempt: number): number;
/** Parses a configured retry fallback selector. */
export declare function parseRetryFallbackSelector(selector: string, modelLookup?: Pick<RetryFallbackModelLookup, "find">): RetryFallbackSelector | undefined;
/** Whether a fallback-chain key is a model selector rather than a role. */
export declare function isRetryFallbackModelKey(key: string): boolean;
/** Whether a fallback-chain key or entry is a provider wildcard. */
export declare function isRetryFallbackWildcardKey(key: string): boolean;
/** Splits a wildcard selector into provider and optional model-id prefix. */
export declare function parseRetryFallbackWildcard(key: string, isKnownProvider: (provider: string) => boolean): {
    provider: string;
    idPrefix: string | undefined;
};
/** Formats a concrete model and thinking level as a fallback selector. */
export declare function formatRetryFallbackSelector(model: Model, thinkingLevel: ThinkingLevel | undefined): string;
/** Whether a provider is registered or configured for discovery. */
export declare function isKnownProvider(modelRegistry: ModelRegistry, provider: string): boolean;
/** Apply the configured default chain to roles without their own chain. */
export declare function expandDefaultRetryFallbackChains(configuredChains: RetryFallbackChains, roleNames: readonly string[]): RetryFallbackChains;
/** Resolves configured fallback chains, applying the default chain to named roles. */
export declare function getRetryFallbackChains(settings: Settings): RetryFallbackChains;
/** Validates configured fallback chains and reports each warning. */
export declare function validateRetryFallbackChains(settings: Settings, modelRegistry: ModelRegistry, warn: (message: string) => void): void;
/** Returns the configured fallback-primary restoration policy. */
export declare function getRetryFallbackRevertPolicy(settings: Settings): RetryFallbackRevertPolicy;
/**
 * Resolve the chain key for a concrete selector by specificity: exact model,
 * longest matching wildcard, hinted role, then matching role keys with
 * `default` preferred over other shared assignments, then default.
 */
export declare function resolveRetryFallbackChainKey(context: RetryFallbackResolutionContext, currentSelector: string, currentModel?: Model | null, roleHint?: string): string | undefined;
/** Return the candidates after the current selector in an effective chain. */
export declare function findRetryFallbackCandidates(context: RetryFallbackResolutionContext, chainKey: string, currentSelector: string, currentModel?: Model | null, options?: {
    allowMissingPrimary?: boolean;
}): RetryFallbackSelector[];
