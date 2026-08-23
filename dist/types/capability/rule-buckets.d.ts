/**
 * Rule bucketing
 *
 * Single funnel that every discovered rule passes through on its way into a
 * session. It applies the user's disable levers, registers TTSR rules with the
 * manager, and splits the rest into the always-apply and rulebook buckets.
 *
 * Bucket precedence (matches docs/rulebook-matching-pipeline.md §5):
 *   1. TTSR     — non-empty `condition`/`astCondition` that `TtsrManager.addRule` accepts
 *   2. always   — `alwaysApply === true`
 *   3. rulebook — has a `description`
 */
import type { TtsrManager } from "../export/ttsr.js";
import { type Rule } from "./rule.js";
export interface RuleBuckets {
    rulebookRules: Rule[];
    alwaysApplyRules: Rule[];
}
export interface BucketRulesOptions {
    /** Rule names to drop entirely (bundled defaults and user rules alike). */
    disabledRules?: readonly string[];
    /** When false, drop every rule from the bundled `builtin-defaults` provider. */
    builtinRules?: boolean;
}
/**
 * Filter and bucket rules, registering TTSR rules on `ttsrManager` as a side
 * effect. Disabled rules are dropped before any bucket assignment, so a
 * disabled rule is neither matched as TTSR nor surfaced via `rule://`.
 */
export declare function bucketRules(rules: readonly Rule[], ttsrManager: TtsrManager, options?: BucketRulesOptions): RuleBuckets;
