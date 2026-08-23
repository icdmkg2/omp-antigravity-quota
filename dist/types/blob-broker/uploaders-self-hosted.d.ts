import type { BlobDestinationId } from "./destinations.js";
import type { BlobUploader } from "./publication.js";
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/** Create an uploader for the built-in self-hosted and filesystem destination family. */
export declare function createSelfHostedUploader(destination: BlobDestinationId, config: DestinationRuntimeConfig): BlobUploader | null;
