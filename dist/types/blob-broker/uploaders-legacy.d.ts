import type { BlobDestinationId } from "./destinations.js";
import type { BlobUploader } from "./publication.js";
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/** Create a viable ShareX legacy HTTP uploader, or `null` for another destination family. */
export declare function createLegacyUploader(destination: BlobDestinationId, config: DestinationRuntimeConfig): BlobUploader | null;
