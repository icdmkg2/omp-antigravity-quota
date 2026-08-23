import type { Model } from "@oh-my-pi/pi-ai";
import type { ProviderFileClient } from "./provider-file-types.js";
import type { FetchImpl } from "./uploader-runtime.js";
/**
 * Create a native Gemini Files API client for a direct Google Generative AI model.
 * Unsupported model transports return `null` without issuing a network request.
 */
export declare function createGeminiProviderFileClient(model: Model, credential: string, fetchImpl?: FetchImpl): ProviderFileClient | null;
