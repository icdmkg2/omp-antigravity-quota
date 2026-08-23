/**
 * Mental-model bootstrap, caching, and rendering for the Hindsight backend.
 *
 * Mental models are persisted, named summaries on the Hindsight server. They
 * are populated by a background reflect at create time and refreshed
 * automatically when consolidation runs (`refresh_after_consolidation: true`).
 *
 * This module:
 *   1. **Seeds** a small, curated set of mental models on first session boot
 *      for a given bank (idempotent: never modifies an existing model).
 *   2. **Loads** the seeded + any operator-curated models into a cached
 *      `<mental_models>` block that the backend splices into developer
 *      instructions on every prompt rebuild — bypassing per-turn recall HTTP
 *      cost for stable knowledge.
 *   3. **Renders** content blocks with anti-feedback wrappers so the LLM
 *      treats them as background knowledge, not as commands (mirrors the
 *      `<memories>` warning).
 *
 * Tag discipline (foot-gun):
 * The Hindsight refresh path filters source memories with `all_strict` tag
 * matching against the model's tags. A seed tagged with something we never
 * write at retain time will refresh empty. Therefore seed tags MUST be a
 * subset of the tags actually attached by `retainSession` / `enqueueRetain`
 * for the active scoping mode. In `per-project-tagged` we only carry
 * `project:<cwd>`; do not invent new tag axes here without first wiring the
 * retain side to emit them.
 *
 * Seed tags are baked from `seeds.json` plus, for `projectTagged: true`
 * entries, the active scope's `retainTags` (i.e. `project:<cwd>`). In
 * `per-project-tagged`, those project seeds also get project-suffixed ids so
 * each tag can own its conventions/decisions models in the shared bank.
 * Untagged seeds (e.g. `user-preferences`) read every memory in the bank — the
 * reflect call applies no tag filter when `tags` is empty.
 *
 * Seed lifecycle is **create-only**: changes to `source_query`, `tags`,
 * `max_tokens`, or `trigger` in `seeds.json` will NOT propagate to existing
 * models on the server. Operators who want a structural change must
 * `/memory mm refresh <id>` (content-only) or `/memory mm delete <id>`
 * followed by a re-seed.
 */
import type { BankScope } from "./bank.js";
import type { HindsightApi, MentalModelMode, MentalModelSummary, MentalModelTrigger } from "./client.js";
import type { HindsightScoping } from "./config.js";
interface RawSeed {
    id: string;
    name: string;
    source_query: string;
    scopes: HindsightScoping[];
    projectTagged: boolean;
    trigger?: {
        mode?: MentalModelMode;
        refresh_after_consolidation?: boolean;
    };
    max_tokens?: number;
    extra_tags?: string[];
}
export interface MentalModelSeed {
    id: string;
    name: string;
    sourceQuery: string;
    tags: string[];
    maxTokens?: number;
    /** Legacy unqualified seed ids accepted as already-present when tags match. */
    legacyIds?: string[];
    trigger?: MentalModelTrigger;
}
/**
 * Resolve the seed list that applies to the active bank scope. Per-project
 * seeds are skipped in `global` mode (where there is no project axis) and
 * `projectTagged` seeds inherit the scope's `retainTags`. In shared tagged
 * banks, project seeds use project-suffixed ids and accept matching legacy
 * bare ids as already present.
 */
export declare function resolveSeedsForScope(scope: BankScope, scoping: HindsightScoping): MentalModelSeed[];
/**
 * Idempotently create any seed mental models that don't already exist on the
 * bank. Best-effort: a list/create failure does not throw — mental models are
 * an optimization, not a precondition for retain/recall, and we mirror the
 * swallow-on-failure pattern used by `ensureBankExists`.
 *
 * Existing models are NEVER modified. See module docstring.
 */
export declare function ensureMentalModels(client: HindsightApi, bankId: string, seeds: MentalModelSeed[], debug: boolean): Promise<void>;
/** Return whether a seed is already represented by current bank metadata. */
export declare function seedAlreadyExists(seed: MentalModelSeed, models: readonly MentalModelSummary[]): boolean;
/**
 * Default character budget for the rendered `<mental_models>` block. Mental
 * models are injected on every prompt rebuild; an unbounded block can crowd
 * out the user's actual context (and we cannot trust a curated/operator
 * model to stay small without enforcement). The budget is a coarse char cap
 * — token-accurate accounting would require a model-specific tokenizer we
 * don't carry here.
 */
export declare const MENTAL_MODEL_RENDER_BUDGET_CHARS_DEFAULT = 16000;
/**
 * Pull the current mental-model snapshot from the server and render it into a
 * `<mental_models>` block ready to be appended to developer instructions.
 *
 * Returns `undefined` when the server has no models yet, when the API call
 * fails, or when every model still has empty content (e.g. the background
 * reflect for a freshly-seeded model hasn't completed yet).
 *
 * The rendered block is bounded by `budgetChars` (default
 * MENTAL_MODEL_RENDER_BUDGET_CHARS_DEFAULT). When `visibleTags` is supplied,
 * tagged models must match at least one active tag; untagged models remain
 * visible in every scope. Per-model content is truncated before assembly; if
 * assembly still exceeds the budget, trailing models are dropped. A budget
 * overflow leaves a `…` marker so the LLM can tell the snapshot is truncated.
 */
export declare function loadMentalModelsBlock(client: HindsightApi, bankId: string, budgetChars?: number, visibleTags?: readonly string[]): Promise<string | undefined>;
export declare function renderMentalModelsBlock(models: MentalModelSummary[], budgetChars: number): string;
/** Inventory line used by the `/memory mm list` command. */
export declare function summarizeMentalModel(model: MentalModelSummary): string;
/**
 * Render a unified-style line diff between the previous and current content
 * of a mental model. Hindsight's history endpoint returns the previous
 * snapshot only; the diff is computed locally for display purposes.
 *
 * This is intentionally minimal — for "what changed" at a glance, not for a
 * full structural diff. Each side is capped at `MAX_LCS_LINES` lines BEFORE
 * the O(n*m) LCS table is built so a long curated model can never hang the
 * TUI; output is then capped at `maxLines` so the rendered diff stays
 * readable. The cap is signalled inline.
 */
/** Hard cap on input line count per side before LCS. Keeps the O(n*m) table tractable. */
export declare const MAX_LCS_LINES = 1000;
export declare function diffMentalModelContent(previous: string | null, current: string, maxLines?: number): string;
/** Awaited only by the first-turn race in `beforeAgentStartPrompt`. */
export declare const MENTAL_MODEL_FIRST_TURN_DEADLINE_MS = 1500;
/** Cache TTL: re-list models on `agent_end` once this many ms have elapsed. */
export declare const MENTAL_MODEL_REFRESH_INTERVAL_MS: number;
/** Need-only export of the raw seed list for tests. */
export declare const builtinSeedsForTest: ReadonlyArray<Readonly<RawSeed>>;
export {};
