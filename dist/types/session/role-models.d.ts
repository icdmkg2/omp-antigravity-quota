import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Model } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import { type ResolvedModelRoleValue } from "../config/model-resolver.js";
import type { Settings } from "../config/settings.js";
/** Formats a role assignment while preserving its explicit thinking selector. */
export declare function formatRoleModelValue(settings: Settings, modelRegistry: ModelRegistry, role: string, model: Model, selectorOverride?: string, thinkingLevelOverride?: ThinkingLevel): string;
/** Resolves a configured model target relative to the current provider. */
export declare function resolveConfiguredModelTarget(configuredTarget: string | undefined, currentModel: Model, availableModels: Model[]): Model | undefined;
/** Resolves a model's configured context-promotion target. */
export declare function resolveContextPromotionConfiguredTarget(currentModel: Model, availableModels: Model[]): Model | undefined;
/** Resolves a model's configured compaction target. */
export declare function resolveCompactionConfiguredTarget(currentModel: Model, availableModels: Model[]): Model | undefined;
/** Resolves a model role and its explicit thinking selection. */
export declare function resolveRoleModelFull(settings: Settings, role: string, availableModels: Model[], currentModel: Model | undefined): ResolvedModelRoleValue;
