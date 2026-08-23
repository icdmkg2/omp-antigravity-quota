/**
 * Resolved Hindsight runtime configuration.
 *
 * Source of truth precedence (last wins):
 *   1. Built-in defaults
 *   2. Settings (`hindsight.*` schema entries via `Settings.get(...)`)
 *   3. `HINDSIGHT_*` environment variables
 *
 * Env wins because operators frequently override per-shell (CI, prod) without
 * touching the persisted settings file.
 */
import type { Settings } from "../config/settings.js";
export type HindsightScoping = "global" | "per-project" | "per-project-tagged";
export interface HindsightConfig {
    hindsightApiUrl: string | null;
    hindsightApiToken: string | null;
    bankId: string | null;
    bankIdPrefix: string;
    scoping: HindsightScoping;
    bankMission: string;
    retainMission: string | null;
    autoRecall: boolean;
    autoRetain: boolean;
    retainMode: "full-session" | "last-turn";
    retainEveryNTurns: number;
    retainOverlapTurns: number;
    retainContext: string;
    recallBudget: "low" | "mid" | "high";
    recallMaxTokens: number;
    recallTypes: string[];
    recallContextTurns: number;
    recallMaxQueryChars: number;
    recallPromptPreamble: string;
    debug: boolean;
    /** Default per-request client deadline (ms) for ops without a specific override. */
    requestTimeoutMs: number;
    /** Client deadline (ms) for reflect (agentic synthesis; costlier than a metadata fetch). */
    reflectTimeoutMs: number;
    /** Client deadline (ms) for recall. */
    recallTimeoutMs: number;
    /** Client deadline (ms) for retain / retainBatch. */
    retainTimeoutMs: number;
    mentalModelsEnabled: boolean;
    mentalModelAutoSeed: boolean;
    mentalModelRefreshIntervalMs: number;
    mentalModelMaxRenderChars: number;
}
/**
 * Load the resolved Hindsight config.
 *
 * Pure (no I/O) aside from reading from `process.env` and the supplied
 * Settings instance. Tests can pass `Settings.isolated({...})` and stub
 * `process.env` per case.
 */
export declare function loadHindsightConfig(settings: Settings, env?: NodeJS.ProcessEnv): HindsightConfig;
/** Whether the caller has enough config to talk to a Hindsight server. */
export declare function isHindsightConfigured(config: HindsightConfig): config is HindsightConfig & {
    hindsightApiUrl: string;
};
