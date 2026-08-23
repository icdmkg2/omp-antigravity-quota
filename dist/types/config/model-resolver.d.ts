/**
 * Model resolution, scoping, and initial selection.
 *
 * Layering:
 * - `matchModel` is the single matching engine. Order: exact `provider/id`
 *   reference (with variant-alias and OpenRouter routed/date fallbacks) →
 *   exact bare id → retired variant alias → provider-scoped fuzzy → substring
 *   with alias-vs-dated pick.
 * - `parseModelPatternWithContext`/`parseModelPattern` layer the selector
 *   grammar on top: trailing `:level` thinking suffixes (`splitThinkingSuffix`)
 *   and `@upstream` provider routing (`splitUpstreamRouting`).
 * - Everything else (`resolveModelFromString`, `resolveModelOverride*`,
 *   `resolveRoleSelection`, `resolveModelScope`, `resolveCliModel`,
 *   `findSmolModel`/`findSlowModel`) adapts inputs — roles, settings patterns,
 *   CLI flags, scope globs — onto that pipeline.
 */
import { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, Effort, Model } from "@oh-my-pi/pi-ai";
import { type ConfiguredThinkingLevel } from "../thinking.js";
import { type ModelRegistry } from "./model-registry.js";
import { type ModelRole } from "./model-roles.js";
import type { Settings } from "./settings.js";
/**
 * Pick the first provider-default model in availability order.
 *
 * If multiple providers expose that same default id, rank only that shared-id
 * group by canonical provider priority so native/OAuth transports beat mirrors
 * without changing unrelated provider fallback precedence.
 */
export declare function pickDefaultAvailableModel(availableModels: Model<Api>[]): Model<Api> | undefined;
export interface ScopedModel {
    model: Model<Api>;
    thinkingLevel?: ThinkingLevel;
    explicitThinkingLevel: boolean;
}
interface ThinkingSuffixOptions {
    allowMaxSuffix?: boolean;
    allowAutoAlias?: boolean;
}
interface ModelStringParseOptions extends ThinkingSuffixOptions {
    isLiteralModelId?: (provider: string, id: string) => boolean;
}
/**
 * Parse a model string in "provider/modelId" format.
 * Returns undefined if the format is invalid.
 */
export declare function parseModelString(modelStr: string, options?: ModelStringParseOptions): {
    provider: string;
    id: string;
    thinkingLevel?: ConfiguredThinkingLevel;
} | undefined;
/**
 * Format a model as "provider/modelId" string.
 */
export declare function formatModelString(model: Model<Api>): string;
export declare function formatModelStringWithRouting(model: Model<Api>): string;
export declare function formatModelSelectorValue(selector: string, thinkingLevel: ConfiguredThinkingLevel | undefined): string;
/**
 * Split a trailing `@<upstream>` provider-routing selector off a model pattern.
 *
 * `openrouter/z-ai/glm-4.7@cerebras` -> base `openrouter/z-ai/glm-4.7`, upstream
 * `cerebras`. A `:thinking` suffix after the slug is kept on the base
 * (`...@cerebras:high` -> base `...:high`). Returns undefined when there is no
 * `@` or the suffix is not a bare provider slug, so model ids that legitimately
 * contain `@` (`claude-opus-4-8@default`, `workers-ai/@cf/...`) are never split.
 */
export declare function splitUpstreamRouting(pattern: string): {
    base: string;
    upstream: string;
} | undefined;
export declare function resolveProviderModelReference(provider: string, modelId: string, availableModels: readonly Model<Api>[]): Model<Api> | undefined;
export interface ModelMatchPreferences {
    /** Most-recently-used model keys (provider/modelId) to prefer when ambiguous. */
    usageOrder?: string[];
    /** Provider precedence used for ambiguous unqualified model patterns. */
    providerOrder?: readonly string[];
    /** Providers to deprioritize when no recent usage or provider priority is available. */
    deprioritizeProviders?: string[];
}
export type ModelLookupRegistry = Pick<ModelRegistry, "getAvailable">;
type CliModelRegistry = Pick<ModelRegistry, "getAll" | "getAvailable">;
type InitialModelRegistry = Pick<ModelRegistry, "getAvailable" | "find">;
type RestorableModelRegistry = Pick<ModelRegistry, "getAvailable" | "find" | "getApiKey">;
export declare function getModelMatchPreferences(settings?: Partial<Pick<Settings, "get" | "getStorage">>): ModelMatchPreferences;
export interface ParsedModelResult {
    model: Model<Api> | undefined;
    /** Thinking level if explicitly specified in pattern, undefined otherwise */
    thinkingLevel?: ConfiguredThinkingLevel;
    /** Upstream provider slug from an `@upstream` routing selector, if present. */
    upstream?: string;
    warning: string | undefined;
    explicitThinkingLevel: boolean;
}
export declare function parseModelPattern(pattern: string, availableModels: Model<Api>[], preferences?: ModelMatchPreferences, options?: {
    allowInvalidThinkingSelectorFallback?: boolean;
}): ParsedModelResult;
export interface ModelRoleLookup {
    getModelRole(role: ModelRole | string): string | undefined;
}
/** Normalize comma-separated or array model selectors into an ordered pattern list. */
export declare function normalizeModelPatternList(value: string | string[] | undefined): string[];
/**
 * Extract the first explicit model-role alias from a raw model selection.
 *
 * This intentionally runs before role expansion so callers can retain the
 * source identity (`@smol`, `pi/slow`, or `*`) even when it resolves to a
 * concrete provider/model or inherited fallback. Bare role names and explicit
 * provider/model selectors are not role aliases.
 */
export declare function resolveExplicitModelRole(value: string | string[] | undefined, settings?: ModelRoleLookup): string | undefined;
/**
 * Expand a role alias like "@smol" to the configured model string.
 */
export declare function expandRoleAlias(value: string, settings?: ModelRoleLookup): string;
export declare function resolveConfiguredModelPatterns(value: string | string[] | undefined, settings?: ModelRoleLookup): string[];
export interface AgentModelPatternResolutionOptions {
    /** Highest-priority request selector, when supplied by a caller. */
    requestModel?: string | string[];
    settingsOverride?: string | string[];
    agentModel?: string | string[];
    settings?: Settings;
    activeModelPattern?: string;
    fallbackModelPattern?: string;
}
/** Effective agent model patterns paired with the pre-expansion role alias behind them. */
export interface AgentModelSelection {
    /** Expanded model patterns to spawn with. */
    patterns: string[];
    /** Role alias the patterns came from (`@task` -> `task`), when the source named one. */
    role: string | undefined;
}
/**
 * Resolve an agent's model patterns together with the role identity they were
 * expanded from. Spawn paths MUST take both from this single call: the child's
 * inherited retry-fallback chain is keyed off the role, which the expansion
 * discards, and deriving the two halves separately is how they drift apart.
 */
export declare function resolveAgentModelSelection(options: AgentModelPatternResolutionOptions): AgentModelSelection;
/** Effective agent model patterns alone, for callers with no interest in role identity. */
export declare function resolveAgentModelPatterns(options: AgentModelPatternResolutionOptions): string[];
/** Default prewalk hand-off target when no explicit target is configured. */
export declare const DEFAULT_PREWALK_TARGET = "@smol";
export interface AgentPrewalkResolutionOptions {
    /** `task.agentPrewalk` settings value for this agent: `"on"`, `"off"`, or a model pattern. */
    settingsOverride?: string;
    /** Agent definition `prewalk` frontmatter: `true` = default target, string = custom target pattern. */
    agentPrewalk?: boolean | string;
}
/**
 * Effective prewalk target pattern for a subagent, or `undefined` when prewalk
 * is disabled. The settings override decides enablement first ("off" wins,
 * "on" enables with the agent's own target or {@link DEFAULT_PREWALK_TARGET},
 * any other value is a custom target pattern); otherwise the agent
 * definition's `prewalk` field applies. Role aliases in the returned pattern
 * are expanded later by {@link resolveModelOverride}.
 */
export declare function resolveAgentPrewalkPattern(options: AgentPrewalkResolutionOptions): string | undefined;
export interface AgentAdvisorResolutionOptions {
    /** `task.agentAdvisor` settings value for this agent: `"on"`, `"off"`, or a model pattern. */
    settingsOverride?: string;
    /** Agent definition `advisor` frontmatter: `true` = default advisor-role model, string = custom model pattern. */
    agentAdvisor?: boolean | string;
}
/** Effective advisor for one spawned agent: absent `model` resolves through the `advisor` role. */
export interface AgentAdvisorSelection {
    model?: string;
}
/**
 * Effective advisor selection for a subagent, or `undefined` when the agent
 * runs unadvised. The settings override decides enablement first ("off" wins,
 * "on" enables with the agent's own model pattern or the `advisor` role, any
 * other value is a custom model pattern); otherwise the agent definition's
 * `advisor` field applies. A returned pattern lands on the spawned session's
 * `modelRoles.advisor`, so role aliases and `:level` suffixes resolve there.
 */
export declare function resolveAgentAdvisorSelection(options: AgentAdvisorResolutionOptions): AgentAdvisorSelection | undefined;
/**
 * Resolve a model role value into a concrete model and thinking metadata.
 */
export interface ResolvedModelRoleValue {
    model: Model<Api> | undefined;
    thinkingLevel?: ConfiguredThinkingLevel;
    /** matchedPatternIndex identifies the first configured pattern that matched an available model. */
    matchedPatternIndex?: number;
    explicitThinkingLevel: boolean;
    warning: string | undefined;
}
export declare function resolveModelRoleValue(roleValue: string | undefined, availableModels: Model<Api>[], options?: {
    settings?: Settings;
    roleLookup?: ModelRoleLookup;
    matchPreferences?: ModelMatchPreferences;
}): ResolvedModelRoleValue;
interface ExplicitThinkingSelectorOptions {
    isLiteralModelId?: (provider: string, id: string) => boolean;
}
export declare function extractExplicitThinkingSelector(value: string | undefined, settings?: Settings, options?: ExplicitThinkingSelectorOptions): ConfiguredThinkingLevel | undefined;
/**
 * Resolve a model identifier or pattern to a Model instance.
 */
export declare function resolveModelFromString(value: string, available: Model<Api>[], matchPreferences?: ModelMatchPreferences): Model<Api> | undefined;
/**
 * Resolve a model from configured roles, honoring order and overrides.
 */
export declare function resolveModelFromSettings(options: {
    settings: Settings;
    availableModels: Model<Api>[];
    matchPreferences?: ModelMatchPreferences;
    roleOrder?: readonly ModelRole[];
}): Model<Api> | undefined;
/**
 * Resolve a list of override patterns to the first matching model.
 */
export declare function resolveModelOverride(modelPatterns: string[], modelRegistry: ModelLookupRegistry, settings?: Settings): {
    model?: Model<Api>;
    thinkingLevel?: ConfiguredThinkingLevel;
    explicitThinkingLevel: boolean;
    warning?: string;
};
/**
 * Resolve a list of override patterns to the first matching model, with an
 * auth-aware fallback to the parent session's active model.
 *
 * If the resolved subagent model has no working credentials (provider has no
 * usable auth), and the parent's active model resolves with working auth,
 * use the parent's model instead. This prevents subagent dispatch from
 * silently routing to a provider the user can't actually call (e.g.
 * `modelRoles.task` pointing at an unqualified id whose only available
 * provider variant has no configured credentials — see #985).
 *
 * `sessionId` is forwarded to `getApiKey` so that session-sticky OAuth
 * credentials resolve correctly during the pre-flight auth check. Without it,
 * providers with multiple OAuth accounts may return `undefined` even though
 * the credential is usable once the subagent session starts — see #5325.
 *
 * Keyless-by-design providers (llama.cpp, ollama, lm-studio) advertise the
 * `kNoAuth` sentinel from `getApiKey` to signal that they do not require
 * credentials. Those are treated as authenticated here so an explicitly
 * configured local model is never silently rerouted to the parent's remote
 * provider (see #1008).
 *
 * If neither the subagent nor the parent has working auth, returns the
 * primary resolution unchanged so the existing error path still surfaces
 * a meaningful failure downstream.
 */
export declare function resolveModelOverrideWithAuthFallback(modelPatterns: string[], parentActiveModelPattern: string | undefined, modelRegistry: ModelLookupRegistry & Pick<ModelRegistry, "getApiKey">, settings?: Settings, sessionId?: string): Promise<{
    model?: Model<Api>;
    thinkingLevel?: ConfiguredThinkingLevel;
    explicitThinkingLevel: boolean;
    authFallbackUsed: boolean;
    warning?: string;
}>;
/**
 * Resolve a list of role patterns to the first matching model.
 */
export declare function resolveRoleSelection(roles: readonly string[], settings: Settings, availableModels: Model<Api>[]): {
    model: Model<Api>;
    thinkingLevel?: ConfiguredThinkingLevel;
} | undefined;
/**
 * Resolve the model for the `advisor` role. A configured `modelRoles.advisor`
 * wins outright (a bad override surfaces as no model rather than silently
 * running something else); when unset it falls back to the `slow` priority
 * chain via {@link ROLE_PRIORITY_ALIAS} — a strong reasoning model that, unlike
 * the `slow` role itself, never inherits the primary's model. Returns undefined
 * only when no candidate in the resolved chain is available.
 */
export declare function resolveAdvisorRoleSelection(settings: Settings, availableModels: Model<Api>[]): {
    model: Model<Api>;
    thinkingLevel?: ConfiguredThinkingLevel;
} | undefined;
/**
 * Resolve model patterns to actual Model objects with optional thinking levels
 * Format: "pattern:level" where :level is optional
 * For each pattern, finds all matching models and picks the best version:
 * 1. Prefer alias (e.g., claude-sonnet-4-5) over dated versions (claude-sonnet-4-5-20250929)
 * 2. If no alias, pick the latest dated version
 *
 * Supports models with colons in their IDs (e.g., OpenRouter's model:exacto).
 * The algorithm tries to match the full pattern first, then progressively
 * strips colon-suffixes to find a match.
 */
export declare function resolveModelScope(patterns: string[], modelRegistry: Pick<ModelRegistry, "getAvailable">, preferences?: ModelMatchPreferences, settings?: Settings): Promise<ScopedModel[]>;
/**
 * Resolve the set of models a session is allowed to use, given the active
 * settings. Starts from `modelRegistry.getAvailable()` (so disabled providers
 * and providers without credentials are already filtered out) and, when
 * `enabledModels` is configured for the current path scope, further restricts
 * the result to models matching those patterns.
 *
 * Returns the unfiltered available list when `enabledModels` is empty.
 * Returns an empty list when `enabledModels` is configured but no model matches
 * any pattern — callers MUST treat this as "no usable model" rather than
 * falling back to the global default (see issue #1022).
 */
export declare function resolveAllowedModels(modelRegistry: Pick<ModelRegistry, "getAvailable">, settings: Settings | undefined, preferences?: ModelMatchPreferences): Promise<Model<Api>[]>;
/**
 * Synchronous subset of {@link resolveAllowedModels} for contexts where async is unavailable
 * (e.g. `getAvailableModels()` which is called from the ACP model-list advertisement, RPC
 * `get_available_models`, and the `/model` slash command). Uses the same effective
 * `enabledModels` scope semantics as startup resolution:
 *
 * - Glob selectors match `provider/modelId` and bare model id
 * - Exact `provider/modelId`, bare ids, provider-scoped fuzzy, and substring selectors
 *   resolve through the shared model-pattern matcher
 * - Optional `:thinkingLevel` suffixes are stripped only when valid
 *
 * When no pattern resolves to any model (misconfiguration / typo) an empty list is returned,
 * consistent with the empty-list contract of {@link resolveAllowedModels}. Callers that render
 * a UI picker should treat an empty list as "hide the picker entry", matching how the SDK
 * surfaces the same misconfiguration during session initialization.
 */
export declare function filterAvailableModelsByEnabledPatterns(available: Model<Api>[], patterns: readonly string[], settings?: Settings): Model<Api>[];
export interface ResolveCliModelResult {
    model: Model<Api> | undefined;
    /** configuredPatterns contains the role's ordered primary candidates. */
    configuredPatterns?: string[];
    /** configuredRole identifies the role expanded into configuredPatterns. */
    configuredRole?: string;
    /** configuredPatternIndex identifies the configured role pattern that matched an available model. */
    configuredPatternIndex?: number;
    selector?: string;
    thinkingLevel?: ConfiguredThinkingLevel;
    warning: string | undefined;
    error: string | undefined;
}
/**
 * Resolve a single model from CLI flags.
 *
 * Explicit `provider/id` references and authenticated bare ids take precedence
 * over configured role names, which in turn take precedence over an
 * unauthenticated catalog-only id (so a bundled `cursor/default` never shadows a
 * configured `modelRoles.default`).
 */
export declare function resolveCliModel(options: {
    cliProvider?: string;
    cliModel?: string;
    modelRegistry: CliModelRegistry;
    /** Authenticated models to prefer for unqualified selectors; defaults to the registry's authenticated set. */
    availableModels?: Model<Api>[];
    settings?: Settings;
    preferences?: ModelMatchPreferences;
}): ResolveCliModelResult;
export interface InitialModelResult {
    model: Model<Api> | undefined;
    thinkingLevel?: ThinkingLevel;
    fallbackMessage: string | undefined;
}
/**
 * Find the initial model to use based on priority:
 * 1. CLI args (provider + model)
 * 2. First model from scoped models (if not continuing/resuming)
 * 3. Restored from session (if continuing/resuming)
 * 4. Saved default from settings
 * 5. First available model with valid API key
 */
export declare function findInitialModel(options: {
    cliProvider?: string;
    cliModel?: string;
    scopedModels: ScopedModel[];
    isContinuing: boolean;
    defaultProvider?: string;
    defaultModelId?: string;
    defaultThinkingSelector?: Effort;
    modelRegistry: InitialModelRegistry;
}): Promise<InitialModelResult>;
/**
 * Restore model from session, with fallback to available models
 */
export declare function restoreModelFromSession(savedProvider: string, savedModelId: string, currentModel: Model<Api> | undefined, shouldPrintMessages: boolean, modelRegistry: RestorableModelRegistry): Promise<{
    model: Model<Api> | undefined;
    fallbackMessage: string | undefined;
}>;
/**
 * Find a smol/fast model using the priority chain.
 * Tries exact matches first, then fuzzy matches.
 *
 * @param modelRegistry The model registry to search
 * @param savedModel Optional saved model string from settings (provider/modelId)
 * @returns The best available smol model, or undefined if none found
 */
export declare function findSmolModel(modelRegistry: ModelLookupRegistry, savedModel?: string): Promise<Model<Api> | undefined>;
/**
 * Find a slow/comprehensive model using the priority chain.
 * Prioritizes reasoning and codex models for thorough analysis.
 *
 * @param modelRegistry The model registry to search
 * @param savedModel Optional saved model string from settings (provider/modelId)
 * @returns The best available slow model, or undefined if none found
 */
export declare function findSlowModel(modelRegistry: ModelLookupRegistry, savedModel?: string): Promise<Model<Api> | undefined>;
export {};
