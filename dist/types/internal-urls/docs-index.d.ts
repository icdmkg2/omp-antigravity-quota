export interface DocsIndex {
    /** Sorted documentation file names, relative to `docs/`. */
    readonly filenames: readonly string[];
    /** Resolve a doc body by path; inflates the embedded bodies off-thread, lazily, on first call. */
    getBody(relativePath: string): Promise<string | undefined>;
}
/**
 * Decode a populated two-line embed (`<filenames JSON>\n<base64 gzip of bodies>`)
 * into a lazily-inflating index, or `null` when there is no newline separator
 * (the empty placeholder, or a malformed payload — the caller decides which).
 * Reading `filenames` never touches the blob; the bodies are gunzipped off the
 * event loop into a path→content table on the first `getBody` call, and that
 * work is shared across concurrent reads.
 */
export declare function decodeDocsIndex(embed: string): DocsIndex | null;
/** Sorted list of available documentation file names (relative to `docs/`). */
export declare function getDocFilenames(): readonly string[];
/** Resolve a documentation file's content, or `undefined` when not found. */
export declare function getEmbeddedDoc(relativePath: string): Promise<string | undefined>;
