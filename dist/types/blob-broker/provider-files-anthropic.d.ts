import type { Model } from "@oh-my-pi/pi-ai";
import type { ProviderFileClient } from "./provider-file-types.js";
import type { FetchImpl } from "./uploader-runtime.js";
/**
 * Create a native Anthropic Files API client for an official Anthropic Messages model.
 * Unsupported providers, APIs, and non-Anthropic endpoints return `null` without making a request.
 */
export declare function createAnthropicFileClient(model: Model, credential: string, fetchImpl?: FetchImpl): ProviderFileClient | null;
