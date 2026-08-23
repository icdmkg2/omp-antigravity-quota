import type { InternalResource } from "./types.js";
/**
 * Builds a text resource for a filesystem directory resolved by an internal URL handler.
 *
 * The resource is flagged immutable so the read tool never mints hashline edit
 * anchors against a directory listing — only file resources from the same
 * handler stay editable.
 */
export declare function buildDirectoryResource(url: string, directoryPath: string, notes?: string[]): Promise<InternalResource>;
