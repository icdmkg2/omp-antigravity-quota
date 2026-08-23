import type { Model } from "@oh-my-pi/pi-ai";
import type { ProviderFileClient } from "./provider-file-types.js";
import type { FetchImpl } from "./uploader-runtime.js";
/**
 * Create an OpenAI Files API client for an official OpenAI Responses model.
 *
 * Models using Codex, Azure, OpenRouter, or another OpenAI-compatible endpoint
 * are rejected locally by returning `null`; no request is attempted for them.
 */
export declare function createOpenAIFileClient(model: Model, credential: string, fetchImpl?: FetchImpl): ProviderFileClient | null;
