import { type AgentTelemetryConfig } from "@oh-my-pi/pi-agent-core";
import type { Api, completeSimple, ImageContent, Model, TextContent } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import { type LocalProtocolOptions } from "../internal-urls/index.js";
/** Registry surface needed to resolve a vision model and authorize requests. */
export type VisionFallbackRegistry = Pick<ModelRegistry, "getAvailable" | "getApiKey" | "resolver">;
export interface DescribeAttachedImagesDeps {
    /** Active (text-only) model the prompt is destined for. */
    activeModel: Model<Api>;
    modelRegistry: VisionFallbackRegistry;
    settings: Settings;
    /** Inputs for resolving the session-scoped `local://` root. */
    localProtocolOptions: LocalProtocolOptions;
    /** `provider/id` of the active model; a last-resort vision-model candidate (filtered to image-capable). */
    activeModelString?: string;
    telemetryConfig?: AgentTelemetryConfig;
    sessionId?: string;
    /** Test seam: overrides the underlying completeSimple call. */
    completeImpl?: typeof completeSimple;
}
/**
 * Save each attached image under `local://` and replace it with a descriptive
 * text block. Returns one {@link TextContent} per input image, in order. Never
 * throws for an individual image: a failed description falls back to a note while
 * the saved-path block is still emitted.
 */
export declare function describeAttachedImagesForTextModel(images: readonly ImageContent[], deps: DescribeAttachedImagesDeps, signal?: AbortSignal): Promise<TextContent[]>;
