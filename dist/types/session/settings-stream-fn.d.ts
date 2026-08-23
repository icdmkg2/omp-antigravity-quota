/**
 * Settings-aware stream wrapper shared by the main agent (sdk.ts) and the
 * advisor agent (AgentSession.#buildAdvisorRuntime).
 *
 * verbosity, stream watchdog budgets, per-provider in-flight caps, and the loop
 * guard out of `Settings`
 * per request, layering them onto whatever options the caller passed. Before
 * this helper existed, advisor turns called bare `streamSimple` while the main
 * turn went through an inline closure that read these settings — so an advisor on
 * OpenRouter never saw `providers.openrouterVariant`, breaking sticky routing
 * and OpenRouter response-cache hits across advisor calls.
 */
import type { StreamFn } from "@oh-my-pi/pi-agent-core";
import { type Settings } from "../config/settings.js";
/**
 * Build a {@link StreamFn} that reads provider routing/guard settings from
 * `settings` per call and forwards to `base` (defaults to `streamSimple`).
 *
 * Caller-supplied `streamOptions` always win — the helper only fills holes.
 */
export declare function createSettingsAwareStreamFn(settings: Settings, base?: StreamFn): StreamFn;
