import type { BlobDestinationId } from "./destinations.js";
import type { BlobUploader } from "./publication.js";
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/** Create the built-in Discord webhook uploader, or `null` for another destination. */
export declare function createDiscordUploader(destination: BlobDestinationId, config: DestinationRuntimeConfig): BlobUploader | null;
