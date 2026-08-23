import { type BlobStore } from "./blob-store.js";
import type { FileEntry } from "./session-entries.js";
export declare function isImageBlock(value: unknown): value is {
    type: "image";
    data: string;
    mimeType?: string;
};
export declare function isImageDataPayload(value: unknown): value is {
    data: string;
    mimeType?: string;
};
export declare function prepareEntryForPersistence(entry: FileEntry, blobStore: BlobStore): FileEntry;
