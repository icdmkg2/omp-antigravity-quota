/**
 * Transparent provider-file to URL to inline recovery for image requests.
 * Retries are allowed only before the provider emits content, keeping the
 * consumer-facing stream single and ordered.
 */
import type { StreamFn } from "@oh-my-pi/pi-agent-core";
import type { ImageUrlService } from "./service.js";
/** Wrap `base` with provider-file then URL then inline recovery. */
export declare function wrapStreamFnWithBlobUrlFallback(base: StreamFn, broker: ImageUrlService | undefined): StreamFn;
