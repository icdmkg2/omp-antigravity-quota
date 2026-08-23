/** Built-in push-mode uploader composition and command uploader support. */
import { type BlobDestinationId } from "./destinations.js";
import type { BlobPublication, BlobUploader, BlobUploadRequest } from "./publication.js";
import { type DestinationRuntimeConfig } from "./uploader-runtime.js";
/**
 * Quote-aware argv split for the command template. Supports single/double
 * quotes and backslash escapes outside single quotes — enough for uploader
 * command lines without invoking a shell.
 */
export declare function splitCommandTemplate(template: string): string[];
/** Last URL printed on stdout wins; uploader tools often log progress first. */
export declare function extractUploadUrl(stdout: string): string | null;
/**
 * Build an uploader from an argv template. Placeholders, substituted after
 * splitting (paths with spaces stay one argument): `{file}` temp file path,
 * `{mime}` MIME type, `{ext}` bare extension.
 */
export declare function createCommandUploader(template: string): BlobUploader;
/**
 * Resolve one registry destination to its built-in uploader.
 *
 * Serving destinations deliberately return `null`; the broker selects those
 * through its separate serve-kind predicate. Registry entries known to be
 * unusable, and active entries without an implementation, fail explicitly
 * before an upload can issue a network request.
 */
export declare function createConfiguredUploader(destination: BlobDestinationId, config: DestinationRuntimeConfig): BlobUploader | null;
/** Wrap an uploader with per-hash memoization so bytes upload at most once. */
export declare function memoizeUploader(uploader: BlobUploader): (hash: string, request: BlobUploadRequest) => Promise<BlobPublication | null>;
