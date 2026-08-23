import type { BlobDestinationId } from "./destinations.js";
import type { BlobUploader } from "./publication.js";
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/** Create the built-in uploader for a cloud-drive destination, or null for another family. */
export declare function createCloudDriveUploader(destination: BlobDestinationId, config: DestinationRuntimeConfig): BlobUploader | null;
