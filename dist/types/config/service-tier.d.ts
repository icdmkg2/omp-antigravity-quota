import type { ServiceTier, ServiceTierByFamily, ServiceTierFamily } from "@oh-my-pi/pi-ai";
import type { SubmenuOption } from "./settings-schema.js";
/**
 * Per-family service-tier setting values. `"none"` is the omit-the-parameter
 * sentinel; the rest mirror the wire {@link ServiceTier} values each provider
 * family actually realizes. OpenAI accepts the full set; Anthropic realizes
 * only `priority` (fast mode); Google (Gemini API + Vertex) realizes
 * `flex`/`priority`.
 */
export declare const SERVICE_TIER_OPENAI_VALUES: readonly ["none", "auto", "default", "flex", "scale", "priority"];
export declare const SERVICE_TIER_ANTHROPIC_VALUES: readonly ["none", "priority"];
export declare const SERVICE_TIER_GOOGLE_VALUES: readonly ["none", "flex", "priority"];
export type ServiceTierOpenAISettingValue = (typeof SERVICE_TIER_OPENAI_VALUES)[number];
export type ServiceTierAnthropicSettingValue = (typeof SERVICE_TIER_ANTHROPIC_VALUES)[number];
export type ServiceTierGoogleSettingValue = (typeof SERVICE_TIER_GOOGLE_VALUES)[number];
/** Whether a runtime value is a supported OpenAI service-tier setting. */
export declare function isServiceTierOpenAISettingValue(value: string): value is ServiceTierOpenAISettingValue;
/** Whether a runtime value names a provider family with an independent service-tier knob. */
export declare function isServiceTierFamily(value: unknown): value is ServiceTierFamily;
/** Whether a runtime value is a supported service tier for one provider family. */
export declare function isServiceTierForFamily(family: string, tier: unknown): tier is ServiceTier;
/**
 * Inherit-capable single value for the subagent/advisor tiers. The chosen tier
 * is broadcast across families and applied to whichever family the spawned
 * model belongs to (clamped to what that family realizes); `"inherit"` defers
 * to the main agent's live per-family selection.
 */
export declare const SERVICE_TIER_INHERIT_SETTING_VALUES: readonly ["inherit", "none", "auto", "default", "flex", "scale", "priority"];
export type ServiceTierInheritSettingValue = (typeof SERVICE_TIER_INHERIT_SETTING_VALUES)[number];
export declare const SERVICE_TIER_OPENAI_OPTIONS: ReadonlyArray<SubmenuOption<ServiceTierOpenAISettingValue>>;
export declare const SERVICE_TIER_ANTHROPIC_OPTIONS: ReadonlyArray<SubmenuOption<ServiceTierAnthropicSettingValue>>;
export declare const SERVICE_TIER_GOOGLE_OPTIONS: ReadonlyArray<SubmenuOption<ServiceTierGoogleSettingValue>>;
export declare const SERVICE_TIER_INHERIT_OPTIONS: ReadonlyArray<SubmenuOption<ServiceTierInheritSettingValue>>;
/** Map a per-family setting value to a wire {@link ServiceTier}, or `undefined` to omit. */
export declare function serviceTierSettingToTier(value: string): ServiceTier | undefined;
/** Assemble the live per-family tier map from the three `tier.*` setting values. */
export declare function buildServiceTierByFamily(openai: string, anthropic: string, google: string): ServiceTierByFamily;
/**
 * Broadcast a single chosen tier across families, clamped to what each family
 * realizes: OpenAI takes any tier, Anthropic only `priority`, Google only
 * `flex`/`priority`. Used by the subagent/advisor single-value settings and the
 * `omp bench --service-tier` flag, which apply one tier to whatever family the
 * target model belongs to.
 */
export declare function serviceTierForAllFamilies(tier: ServiceTier | undefined): ServiceTierByFamily;
/**
 * Resolve a subagent/advisor service-tier setting to a per-family map.
 *
 * - A concrete tier is broadcast across families (see
 *   {@link serviceTierForAllFamilies}).
 * - `"none"` yields an empty map.
 * - `"inherit"` defers to `inherited` — the parent's live per-family tiers when
 *   a live session supplied them, else the empty map.
 */
export declare function resolveSubagentServiceTier(setting: string, inherited: ServiceTierByFamily): ServiceTierByFamily;
