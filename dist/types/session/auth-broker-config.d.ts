/**
 * Resolve auth-broker connection configuration for the local omp client.
 *
 * This is a thin coding-agent wrapper around the shared resolver in
 * `@oh-my-pi/pi-ai/auth-broker/discover` that preserves the process-lifetime
 * memoization expected by the CLI and injects the full `resolveConfigValue`
 * (including `!command` config indirection) from coding-agent's config layer.
 *
 * Precedence (highest first):
 *   1. `OMP_AUTH_BROKER_URL` / `OMP_AUTH_BROKER_TOKEN` env vars.
 *   2. `auth.broker.url` / `auth.broker.token` in `~/.omp/agent/config.yml`
 *      (hidden from the settings UI; `!command` resolution supported).
 *   3. Token file `~/.omp/auth-broker.token` (paired with URL from env or config).
 *
 * Returns null when no broker URL is configured — caller falls back to the
 * local SQLite store.
 *
 * Reads config.yml directly (instead of going through `Settings.init`) because
 * `discoverAuthStorage` runs before the settings singleton is initialized in
 * `runRootCommand`, and we want hand-edited config entries to be honoured at
 * boot without forcing a startup reorder.
 */
import { type AuthBrokerClientConfig, type DiscoverAuthStorageOptions, getAuthBrokerTokenFilePath } from "@oh-my-pi/pi-ai/auth-broker/discover";
import type { AuthStorage } from "./auth-storage.js";
export { type AuthBrokerClientConfig, getAuthBrokerTokenFilePath };
/**
 * Read broker configuration. Returns null when the URL is missing
 * (broker disabled — local store is used). Throws when URL is set but no
 * token is available — the caller cannot fall back silently because the
 * user explicitly asked to use the broker.
 *
 * Successful resolutions (including "no broker configured") are memoized for
 * the process lifetime; failures are not, so a missing token can be fixed and
 * retried. Concurrent callers share one in-flight resolution.
 */
export declare function resolveAuthBrokerConfig(): Promise<AuthBrokerClientConfig | null>;
/**
 * Create an AuthStorage instance, using the broker when configured and falling
 * back to the local SQLite store otherwise. Delegates to the shared resolver in
 * pi-ai so the CLI, subagents, and the catalog generator all see the same
 * credentials.
 *
 * Default `agentDir` is the current configured agent directory.
 */
export declare function discoverAuthStorage(agentDir?: string, options?: Omit<DiscoverAuthStorageOptions, "agentDir" | "configValueResolver">): Promise<AuthStorage>;
/**
 * Turn an auth-storage discovery failure raised at CLI startup into a clean,
 * actionable message, or return `null` when the error is unrelated to the
 * broker (so the caller rethrows it unchanged).
 *
 * A configured broker deliberately *replaces* the local credential store —
 * {@link discoverAuthStorage} never silently falls back to local SQLite once
 * `auth.broker.url` is set — so an unreachable broker is fatal. Without this,
 * the underlying `AuthBrokerError` (or missing-token `MissingApiKeyError`)
 * propagates as a raw uncaught exception and the CLI dies with a stack dump
 * instead of recovery guidance (issue #8096).
 */
export declare function describeAuthBrokerStartupError(error: unknown): Promise<string | null>;
