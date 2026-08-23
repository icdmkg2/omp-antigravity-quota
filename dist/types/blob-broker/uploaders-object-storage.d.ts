import type { BlobDestinationId } from "./destinations.js";
import type { BlobUploader } from "./publication.js";
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/** Create an uploader for an S3-compatible, GCS, Azure Blob, or Backblaze B2 destination. */
export declare function createObjectStorageUploader(destination: BlobDestinationId, config: DestinationRuntimeConfig): BlobUploader | null;
