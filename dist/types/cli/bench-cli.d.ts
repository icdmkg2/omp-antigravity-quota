import type { ResolvedThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, ApiKeyResolver, AssistantMessageEventStream, Context, Model, ServiceTierByFamily, SimpleStreamOptions } from "@oh-my-pi/pi-ai";
import type { ApiKeyResolverModel } from "../config/api-key-resolver.js";
import { Settings } from "../config/settings.js";
/**
 * One built-in workload a bench run exercises:
 * - `chat`: balanced prompt/output — the everyday latency + throughput picture.
 * - `prefill`: large cache-busted input, tiny output — isolates input-token
 *   processing (TTFT and prefill tok/s).
 * - `generation`: tiny prompt, long forced output — isolates sustained decode
 *   throughput.
 */
export type BenchChallengeKind = "chat" | "prefill" | "generation";
/** `mix` (the default) rotates through every challenge kind; a kind name isolates one. */
export type BenchProfile = "mix" | BenchChallengeKind;
export interface BenchCommandArgs {
    models: string[];
    flags: {
        runs?: number;
        maxTokens?: number;
        prompt?: string;
        /** Service-tier setting value (`none` omits); overrides the configured `serviceTier` setting. */
        serviceTier?: string;
        json?: boolean;
        par?: number;
        /** Benchmark workload: `mix` (default) rotates challenge kinds; a kind name isolates one. */
        profile?: string;
        /** Synthetic input size for prefill challenges (default: 32768 bytes). */
        prefillBytes?: number;
        cache?: boolean;
        cachePrefixFile?: string;
        cachePrefixBytes?: number;
        cachePairs?: number;
        cacheConcurrency?: number;
    };
}
export interface BenchModelRegistry {
    getAll(): Model<Api>[];
    getAvailable(): Model<Api>[];
    getApiKey(model: Model<Api>, sessionId?: string): Promise<string | undefined>;
    resolver(model: ApiKeyResolverModel, sessionId?: string): ApiKeyResolver;
    hasConfiguredAuth?(model: Model<Api>): boolean;
}
export interface BenchRuntime {
    modelRegistry: BenchModelRegistry;
    settings?: Settings;
    close?: () => void;
}
export interface BenchRunSuccess {
    ok: true;
    /** Challenge kind this run exercised; absent in `--cache` mode. */
    challenge?: BenchChallengeKind;
    /** Request start → first streamed token: queue + prefill window. */
    ttftMs: number;
    /** First streamed token → done: decode window (0 when the response arrived buffered). */
    generationMs: number;
    durationMs: number;
    /** Total prompt tokens: `usage.input` plus cache reads/writes (providers report cached prompt tokens outside `input`). */
    inputTokens: number;
    outputTokens: number;
    /** Output tokens/sec over the total request duration. */
    tokensPerSecond: number;
    /**
     * Output tokens/sec over the decode window. Inflated on providers that hide
     * reasoning until completion (tiny decode window); 0 for fully buffered
     * responses. Compare `tokensPerSecond` for a buffering-proof number.
     */
    generationTps: number;
    /** Prompt tokens/sec over the TTFT window (queue-inclusive prefill rate). */
    prefillTps: number;
    /** Priced cost of the request; 0 when pricing is unavailable. */
    cost: number;
}
export interface BenchRunFailure {
    ok: false;
    /** Challenge kind this run exercised; absent in `--cache` mode. */
    challenge?: BenchChallengeKind;
    error: string;
}
export type BenchRunResult = BenchRunSuccess | BenchRunFailure;
export type CacheObservation = "prompt_cache_read_observed" | "prompt_cache_write_observed" | "response_cache_hit_observed" | "no_provider_proof";
export interface BenchCacheUsage {
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens: number;
    totalTokens: number;
    cost: number;
}
export interface BenchCacheRunReport {
    phase: "cold" | "warm";
    result: BenchRunResult;
    usage?: BenchCacheUsage;
    requestIdObserved: boolean;
    observations: CacheObservation[];
}
export interface BenchCachePairReport {
    cold: BenchCacheRunReport;
    warm: BenchCacheRunReport;
    /** The nominal cold request showed cache reuse, so it is not a true cold baseline. */
    coldAlreadyWarm: boolean;
    /** Structural-only comparisons: prompt text and cache keys are never emitted. */
    stablePrefix: true;
    suffixChanged: true;
    promptCacheKeyStable: true;
    statefulResponsesDisabled: true;
    freshProviderSessionState: true;
    /** "unavailable" when a transport does not expose the provider payload locally. */
    payloadStructureStable: boolean | "unavailable";
}
/** Distribution summary over successful runs. */
export interface MetricStats {
    mean: number;
    min: number;
    /** Median (nearest-rank). */
    p50: number;
    /** 95th percentile (nearest-rank). */
    p95: number;
    max: number;
}
/** Aggregates over successful runs. */
export interface BenchStats {
    ttftMs: MetricStats;
    durationMs: MetricStats;
    tokensPerSecond: MetricStats;
    generationTps: MetricStats;
    prefillTps: MetricStats;
    /** Mean input tokens per successful run. */
    inputTokens: number;
    /** Mean output tokens per successful run. */
    outputTokens: number;
    /** Mean priced cost per successful run; 0 when pricing is unavailable. */
    cost: number;
}
export interface BenchModelReport {
    /** Selector as the user typed it (e.g. "opus" or "gemini-3.5:low"). */
    selector: string;
    /** Resolved `provider/id`. */
    model: string;
    /** Explicit thinking level from a `:level` selector suffix; undefined = provider default. */
    thinking?: ResolvedThinkingLevel;
    results: BenchRunResult[];
    /** Aggregates over successful runs; null when every run failed. */
    stats: BenchStats | null;
    /** Aggregates per challenge kind; empty in `--cache` mode. */
    byChallenge: Partial<Record<BenchChallengeKind, BenchStats>>;
    cachePairs?: BenchCachePairReport[];
}
export interface BenchSummary {
    runs: number;
    /** Explicit `--max-tokens` override (cache mode: resolved value); absent when per-challenge defaults apply. */
    maxTokens?: number;
    /** Benchmark workload; absent in `--cache` mode. */
    profile?: BenchProfile;
    models: BenchModelReport[];
    failures: number;
    /** Requested per-family service tiers, resolved per model before reaching the wire. */
    serviceTierByFamily?: ServiceTierByFamily;
    cache?: {
        pairs: number;
        concurrency: number;
    };
}
type BenchStreamSimple = (model: Model<Api>, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStream;
export interface BenchDependencies {
    createRuntime?: () => Promise<BenchRuntime>;
    randomSessionId?: () => string;
    writeStdout?: (text: string) => void;
    writeStderr?: (text: string) => void;
    setExitCode?: (code: number) => void;
    streamSimple?: BenchStreamSimple;
    now?: () => number;
    /** Uniform [0,1) source for challenge randomization; default `Math.random`. */
    random?: () => number;
    readTextFile?: (path: string, maxBytes: number) => Promise<string>;
    stdoutIsTTY?: boolean;
}
/**
 * Ranked comparison table over model reports: one headline column per
 * challenge kind present (`tok/s` chat, `decode` generation, `prefill`
 * ingest rate); the winner's model cell is highlighted. Medians (not means)
 * so one queue hiccup cannot reorder rows.
 */
export declare function formatBenchTable(summary: BenchSummary): string;
export declare function runBenchCommand(command: BenchCommandArgs, deps?: BenchDependencies): Promise<BenchSummary>;
export {};
