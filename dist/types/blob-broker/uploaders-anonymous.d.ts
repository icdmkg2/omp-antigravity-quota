import type { BlobDestinationId } from "./destinations.js";
import type { BlobUploader } from "./publication.js";
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/** Create an uploader for an anonymous HTTP host, or null for another family. */
export declare function createAnonymousUploader(destination: BlobDestinationId, config: DestinationRuntimeConfig): BlobUploader | null;
