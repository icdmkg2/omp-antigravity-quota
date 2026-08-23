import type { BlobDestinationId } from "./destinations.js";
import type { BlobUploader } from "./publication.js";
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/** Create a built-in image-host uploader, or `null` for another destination family. */
export declare function createImageHostUploader(destination: BlobDestinationId, config: DestinationRuntimeConfig): BlobUploader | null;
