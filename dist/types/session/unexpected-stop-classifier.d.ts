import { type AssistantMessage } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
export interface ClassifyUnexpectedStopDeps {
    settings: Settings;
    registry: ModelRegistry;
    sessionId: string;
    metadataResolver?: (provider: string) => Record<string, unknown> | undefined;
    signal?: AbortSignal;
}
/** Detects terminal turns eligible for mechanical recovery or smart classification. */
export declare function isUnexpectedStopCandidate(message: AssistantMessage): boolean;
export declare function classifyUnexpectedStop(text: string, deps: ClassifyUnexpectedStopDeps): Promise<boolean | undefined>;
export declare function parseUnexpectedStopClassification(text: string): boolean | undefined;
