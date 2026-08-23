/**
 * Per-provider LLM concurrency cap, applied around each provider HTTP request.
 *
 * The semaphore brackets only the streaming request itself, not the whole
 * agent lifetime: a parent subagent releases its slot the moment its LLM
 * stream finishes producing, so children spawned during tool execution can
 * acquire slots for their own turns. Holding the slot across the parent's
 * full conversation deadlocks any spawn tree whose width exceeds
 * `maxConcurrency` because the parents wait for children that wait for
 * slots the parents are holding (issue
 * [#3749](https://github.com/can1357/oh-my-pi/issues/3749)).
 */
import type { StreamFn } from "@oh-my-pi/pi-agent-core";
import type { Settings } from "../config/settings.js";
import { Semaphore } from "./parallel.js";
/**
 * Resolve the configured concurrency ceiling for a provider, or `undefined`
 * when the provider has no cap concept at all. A configured value `<= 0` means
 * "unlimited" and maps to `Infinity` — still a tracked ceiling, so every run
 * holds a slot and a later finite resize counts work started while unlimited.
 */
export declare function getProviderConcurrencyLimit(settings: Settings, provider: string): number | undefined;
/**
 * Hand out the single shared limiter for `provider` (creating one lazily) and
 * resize it in place when the configured limit changes. Replacing the
 * semaphore would orphan in-flight slots on the old instance and let a
 * runtime or mixed limit value exceed the cap (issue #3464 review feedback).
 */
export declare function getProviderSemaphore(settings: Settings, provider: string): Semaphore | undefined;
/**
 * Wrap a {@link StreamFn} so every LLM HTTP request acquires the provider's
 * concurrency slot before the request goes out and releases it when the
 * stream finishes producing (success, error, or abort). Providers without a
 * configured cap pass straight through.
 *
 * The acquire bracket is intentionally narrow (one slot per LLM call), so
 * spawn trees deeper than `maxConcurrency` no longer deadlock on themselves —
 * see the module-level comment for the failure mode this fixes.
 */
export declare function wrapStreamFnWithProviderConcurrency(settings: Settings, base: StreamFn): StreamFn;
