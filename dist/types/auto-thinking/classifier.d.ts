/**
 * Per-prompt difficulty classifier for the `auto` thinking level.
 *
 * Picks a coding-difficulty bucket for a user prompt and maps it to a concrete
 * {@link Effort}, clamped into the active model's supported range (never below
 * {@link Effort.Low}). Two backends, selected by `providers.autoThinkingModel`:
 *
 * - `online` (default): a smol model classifies into `low|medium|high|xhigh`,
 *   plus `max` when the target model exposes that tier.
 * - a local key: an on-device memory model classifies into the coarser
 *   `trivial|moderate|hard` scheme (3-class is more reliable than 4-way ordinal
 *   on sub-2B models), mapped to `low|high|xhigh`.
 *
 * Throws on any failure (no model, no key, unparseable output, abort/timeout);
 * the caller falls back to a concrete level and continues the turn.
 */
import { Effort, type Model } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
export interface ClassifyDifficultyDeps {
    settings: Settings;
    registry: ModelRegistry;
    model: Model;
    sessionId?: string;
    signal?: AbortSignal;
    metadataResolver?: (provider: string) => Record<string, unknown> | undefined;
}
/**
 * Classify `promptText` and return a concrete effort clamped to `deps.model`,
 * or `undefined` when the model has no controllable effort surface (auto has
 * nothing to pick — the caller leaves the prior reasoning level in place).
 * @throws when the backend cannot produce a usable classification.
 */
export declare function classifyDifficulty(promptText: string, deps: ClassifyDifficultyDeps): Promise<Effort | undefined>;
/**
 * Map an online level keyword to an {@link Effort}; earliest match wins.
 *
 * `max` is only offered to the classifier when the target model exposes that
 * tier, but it is always parsed: an unsupported `max` is snapped back down by
 * {@link clampAutoThinkingEffort} rather than failing the turn.
 */
export declare function parseDifficultyLevel(text: string): Effort | undefined;
/** Map the local 3-way bucket keyword to an {@link Effort}; earliest match wins. */
export declare function parseDifficultyBucket(text: string): Effort | undefined;
