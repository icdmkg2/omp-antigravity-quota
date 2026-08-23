import type { ImageContent } from "@oh-my-pi/pi-ai";
import { type BlobPutResult } from "../session/blob-store.js";
/** Cached probe result for a draft image: dimensions, `null` (probe failed), or `undefined`
 *  (never probed). */
export declare function cachedImageDimensions(image: ImageContent): {
    width: number;
    height: number;
} | null | undefined;
/** Record a probe result for a draft image (see {@link cachedImageDimensions}). */
export declare function setCachedImageDimensions(image: ImageContent, dims: {
    width: number;
    height: number;
} | null): void;
type ImageBlobWriter = (data: Buffer, options?: {
    extension?: string;
}) => Promise<BlobPutResult>;
type ImageBlobWriterSync = (data: Buffer, options?: {
    extension?: string;
}) => BlobPutResult;
export declare function imageReferenceHyperlink(label: string, index: number, imageLinks: readonly (string | undefined)[] | undefined, renderLabel: (text: string) => string): string;
export declare function materializeImageReferenceLinks(images: readonly ImageContent[] | undefined, putBlob: ImageBlobWriter): Promise<(string | undefined)[] | undefined>;
export declare function materializeImageReferenceLinksSync(images: readonly ImageContent[] | undefined, putBlob: ImageBlobWriterSync): (string | undefined)[] | undefined;
export {};
