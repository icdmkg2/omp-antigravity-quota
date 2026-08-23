/**
 * Bank ID derivation, project-tag scoping, and first-use bank setup.
 *
 * Three scoping modes (`HindsightConfig.scoping`):
 *   - `global`              — single shared bank, no per-project filter.
 *   - `per-project`         — one bank per cwd basename, hard isolation.
 *   - `per-project-tagged`  — single shared bank, retains carry a `project:<name>`
 *                              tag and recall filters on it but still surfaces
 *                              untagged ("global") memories alongside.
 *
 * The base bank id is `bankIdPrefix-bankId` (default `omp`). Per-project mode
 * appends `-<project>`; tagged mode leaves the bank untouched and uses tags.
 *
 * Bank existence is idempotent at module level — a banksSet keeps track of
 * banks we've already PUT so each session boundary doesn't fire a fresh
 * `createBank` call. The PUT is idempotent server-side, so re-firing on a hot
 * path would only burn round-trips. Failures are swallowed: missing the
 * mission patch is an optimisation, but the bank ITSELF must exist before
 * mental-model bootstrap or the first retain, otherwise the very first POST
 * lands against a missing bank.
 */
import type { HindsightApi } from "./client.js";
import type { HindsightConfig } from "./config.js";
export type RecallTagsMatch = "any" | "all" | "any_strict" | "all_strict";
/**
 * Resolved bank target for a session: which bank to talk to, plus optional
 * tags to attach to retains and to filter recalls by.
 */
export interface BankScope {
    bankId: string;
    /** Tags applied to every retain. Undefined when scoping does not use tags. */
    retainTags?: string[];
    /** Tags filter for recall/reflect. Undefined when scoping does not use tags. */
    recallTags?: string[];
    /** Match mode for `recallTags`. Defaults to `any` so untagged ("global") memories surface too. */
    recallTagsMatch?: RecallTagsMatch;
}
/**
 * Resolve the active bank target plus optional tag scoping.
 *
 * Always returns a non-empty `bankId`. Tag fields are populated only for
 * `per-project-tagged`.
 */
export declare function computeBankScope(config: HindsightConfig, directory: string): BankScope;
/**
 * Backwards-compatible thin wrapper: just return the bank id portion of the
 * scope. New code should prefer `computeBankScope` directly so it can also
 * apply the tag fields.
 */
export declare function deriveBankId(config: HindsightConfig, directory: string): string;
/**
 * Ensure a bank exists, and patch its reflect/retain mission on first use.
 *
 * Idempotent: skips the PUT when the bank id is already in the supplied set.
 * The mission body is optional — when `bankMission` is blank we still PUT to
 * make sure the bank itself is created, so mental-model bootstrap and the
 * first retain don't land against a non-existent bank.
 *
 * The set is capped; on overflow we drop the oldest half so it cannot grow
 * unboundedly across long-lived processes.
 */
export declare function ensureBankExists(client: HindsightApi, bankId: string, config: HindsightConfig, banksSet: Set<string>): Promise<void>;
