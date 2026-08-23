/** Ordered automatic context-maintenance methods and their settings metadata. */
import { type CompactionSettings as EngineCompactionSettings } from "@oh-my-pi/pi-agent-core/compaction";
import type { Model } from "@oh-my-pi/pi-ai";
import type { CompactionSettings } from "../config/settings-schema.js";
/** Choices presented by the ordered compaction-method setting. */
export declare const COMPACTION_METHOD_CHOICES: readonly [{
    readonly value: "remote";
    readonly label: "OpenAI server compaction";
    readonly description: "Use provider-native OpenAI-compatible server compaction when the active route supports it";
}, {
    readonly value: "snapcompact";
    readonly label: "Snapcompact";
    readonly description: "Archive history onto dense bitmap images the active vision model reads back; no LLM call";
}, {
    readonly value: "handoff";
    readonly label: "Handoff";
    readonly description: "Generate a handoff document and continue from it as the compaction summary";
}, {
    readonly value: "soft";
    readonly label: "Soft compaction";
    readonly description: "Summarize in place with a compaction model without using server compaction";
}, {
    readonly value: "shake";
    readonly label: "Shake";
    readonly description: "Drop recoverable heavy content in place without an LLM call";
}];
/** One selectable automatic context-maintenance method. */
export type CompactionMethod = (typeof COMPACTION_METHOD_CHOICES)[number]["value"];
/** Default fallback order: server-native first, portable summary last. */
export declare const DEFAULT_COMPACTION_METHOD_ORDER: CompactionMethod[];
/** Whether an unknown configuration value names a supported compaction method. */
export declare function isCompactionMethod(value: unknown): value is CompactionMethod;
/**
 * Filter malformed entries and preserve first occurrence order from a configured
 * compaction-method preference list.
 */
export declare function resolveCompactionMethodOrder(value: unknown): CompactionMethod[];
/**
 * Convert the selected preference into the engine's compact operation flags.
 * The engine intentionally remains usable by SDK consumers that do not expose
 * the coding agent's preference list.
 */
export declare function resolveMethodSettings(settings: CompactionSettings, method: CompactionMethod): EngineCompactionSettings;
/** Whether server compaction has either a configured endpoint or an active native route. */
export declare function canUseRemoteCompaction(model: Model | null | undefined, settings: EngineCompactionSettings): boolean;
/**
 * First configured method a threshold pass would run, or undefined when it is
 * local (snapcompact/shake) — local methods are effectively instant, so there
 * is nothing to speculate. Shared by the maintenance loop's speculation gate
 * and the status line's annotated context gauge (speculation marker).
 */
export declare function resolveSpeculationMethod(model: Model | null | undefined, settings: CompactionSettings): "remote" | "handoff" | "soft" | undefined;
