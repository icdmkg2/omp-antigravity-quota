import { type Model } from "@oh-my-pi/pi-ai";
import { type ModelRegistry } from "../config/model-registry.js";
import type { CustomTool } from "../extensibility/custom-tools/types.js";
import { type ImageProvider } from "./image-providers.js";
export type { ImageProvider } from "./image-providers.js";
export type ImageProviderPreference = ImageProvider | "auto";
declare const responseModalitySchema: import("@oh-my-pi/omptype").FluentType<"IMAGE" | "TEXT", "IMAGE" | "TEXT">;
export declare const imageGenSchema: import("@oh-my-pi/omptype").FluentType<{
    action?: string | undefined;
    aspect_ratio?: "16:9" | "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | undefined;
    changes?: string[] | undefined;
    composition?: string | undefined;
    image_size?: "1024x1024" | "1024x1536" | "1536x1024" | undefined;
    input?: {
        data?: string | undefined;
        mime_type?: string | undefined;
        path?: string | undefined;
    }[] | undefined;
    lighting?: string | undefined;
    provider?: "auto" | ImageProvider | undefined;
    scene?: string | undefined;
    style?: string | undefined;
    subject: string;
    text?: string | undefined;
}, {
    action?: string | undefined;
    aspect_ratio?: "16:9" | "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | undefined;
    changes?: string[] | undefined;
    composition?: string | undefined;
    image_size?: "1024x1024" | "1024x1536" | "1536x1024" | undefined;
    input?: {
        data?: string | undefined;
        mime_type?: string | undefined;
        path?: string | undefined;
    }[] | undefined;
    lighting?: string | undefined;
    provider?: "auto" | ImageProvider | undefined;
    scene?: string | undefined;
    style?: string | undefined;
    subject: string;
    text?: string | undefined;
}>;
export type ImageGenParams = typeof imageGenSchema.infer;
export type GeminiResponseModality = typeof responseModalitySchema.infer;
interface GeminiSafetyRating {
    category?: string;
    probability?: string;
}
interface GeminiPromptFeedback {
    blockReason?: string;
    safetyRatings?: GeminiSafetyRating[];
}
interface GeminiUsageMetadata {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
}
interface OpenAIResponsesUsage {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
}
type ImageUsageMetadata = GeminiUsageMetadata | OpenAIResponsesUsage;
interface ImageGenToolDetails {
    provider: ImageProvider;
    model: string;
    imageCount: number;
    imagePaths: string[];
    images: InlineImageData[];
    responseText?: string;
    promptFeedback?: GeminiPromptFeedback;
    revisedPrompt?: string;
    usage?: ImageUsageMetadata;
}
interface InlineImageData {
    data: string;
    mimeType: string;
}
export declare function isImageProviderPreference(value: unknown): value is ImageProviderPreference;
/** Set the configured image-provider priority from settings; invalid IDs are dropped. */
export declare function setImageProviderOrder(providers: readonly string[]): void;
export declare const imageGenTool: CustomTool<typeof imageGenSchema, ImageGenToolDetails>;
export declare function getImageGenTools(_modelRegistry?: ModelRegistry, _activeModel?: Model): Promise<Array<CustomTool<typeof imageGenSchema, ImageGenToolDetails>>>;
export declare function getImageGenToolsWithRegistry(_modelRegistry: ModelRegistry, _activeModel?: Model): Promise<Array<CustomTool<typeof imageGenSchema, ImageGenToolDetails>>>;
