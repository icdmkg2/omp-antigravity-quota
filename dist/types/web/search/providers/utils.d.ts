import type { AgentStorage } from "../../../session/agent-storage.js";
import { SearchProviderError, type SearchProviderId, type SearchSource } from "../../../web/search/types.js";
/**
 * Search for an API credential by checking an env-derived key first,
 * then falling back to agent.db stored credentials for the given providers.
 *
 * The caller MUST supply an open {@link AgentStorage} handle so the helper
 * never reaches out to global filesystem state; both the unified web_search
 * chain and one-shot CLI calls open storage exactly once and thread it
 * through every provider.
 *
 * @param storage - Open agent storage handle
 * @param envKey - Pre-resolved environment variable value (or null)
 * @param storageProviders - Provider names to look up in AgentStorage
 */
export declare function findCredential(storage: AgentStorage | null | undefined, envKey: string | null | undefined, ...storageProviders: string[]): string | null;
/**
 * The 60-second default tolerates legitimate slow LLM-mediated responses
 * (Anthropic web_search_20250305, Perplexity, Gemini, Codex) while bounding
 * Windows stalls when Bun's `AbortSignal` fails to propagate. Callers may
 * configure a longer provider deadline, capped at five minutes by the
 * dispatcher; pure search APIs typically settle far faster.
 */
export declare const SEARCH_HARD_TIMEOUT_MS: number;
/**
 * Compose a caller-supplied {@link AbortSignal} with a hard timeout so an
 * outbound `fetch()` is guaranteed to settle within `ms` even when the
 * runtime fails to propagate cancellation to the underlying transport.
 *
 * Bun's WinHTTP backend on Windows is known to ignore `AbortSignal` once a
 * TCP/TLS connection stalls (oven-sh/bun#15275, oven-sh/bun#18536); without
 * this safety net a stalled web-search request freezes the entire session
 * because the user's Esc is never delivered to the native layer.
 *
 * @param signal - Caller cancellation signal, if any.
 * @param ms - Hard timeout in milliseconds. Defaults to {@link SEARCH_HARD_TIMEOUT_MS}.
 */
export declare function withHardTimeout(signal: AbortSignal | undefined, ms?: number): AbortSignal;
/**
 * Map a provider's raw source list to the unified SearchSource shape,
 * clamped to the requested result count and annotated with ageSeconds.
 */
export declare function toSearchSources(sources: ReadonlyArray<{
    title: string;
    url: string;
    snippet?: string;
    publishedDate?: string;
}>, numResults: number): SearchSource[];
export declare function classifyProviderHttpError(provider: SearchProviderId, status: number, body: string): SearchProviderError | null;
