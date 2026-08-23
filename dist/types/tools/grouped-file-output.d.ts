/**
 * One file's contribution to a grouped file output. The header itself is generated
 * by `formatGroupedFiles` (one `#` per nesting level); use `headerSuffix` to tack
 * on extras like ` (1 replacement)`.
 */
export interface GroupedFileSection {
    /** Optional suffix appended to the file header. */
    headerSuffix?: string;
    /** Body lines emitted into the textual model output. */
    modelLines: string[];
    /** Body lines emitted into the display output. Defaults to `modelLines`. */
    displayLines?: string[];
    /** When true, the file (and its header) is omitted entirely. */
    skip?: boolean;
}
export interface GroupedFilesOutput {
    model: string[];
    display: string[];
}
/**
 * Render a list of files as a multi-level, prefix-folded directory tree shared by
 * grep, ast-grep, ast-edit, and the LSP diagnostic formatter.
 *
 * Layout (one `#` per level; the shared prefix folds into the top header):
 *   # packages/pkg/src/
 *   ## root.ts
 *   …body…
 *   ## nested/
 *   ### child.ts
 *   …body…
 *
 * Files in the (folded) project root become single-`#` headers with no parent
 * directory line. A blank line precedes every directory header and every
 * root-level file so the renderers can split the output into collapsible groups.
 */
export declare function formatGroupedFiles(files: string[], renderFile: (filePath: string) => GroupedFileSection): GroupedFilesOutput;
/** Per-line classification of grouped output, used by renderers for hyperlinks. */
export interface GroupedLineContext {
    /** Directory header, file header, or any non-header body/content line. */
    kind: "dir" | "file" | "content";
    /** Number of leading `#` for headers; 0 for content lines. */
    depth: number;
    /** Resolved absolute path of the dir/file a header points at (when resolvable). */
    headerPath?: string;
    /** For content lines, the absolute path of the owning file (line hyperlinks). */
    filePath?: string;
    /** Header is an internal/url-like target the caller resolves itself. */
    isUrl?: boolean;
}
/**
 * Walk grouped output lines, tracking a directory stack keyed by header depth, so
 * each header and body line can be linked back to its absolute filesystem path.
 * Reconstruction is stack-based (not per-blank-group) so nested directory headers
 * resolve correctly across the whole output.
 *
 * `headerBase` is the directory the displayed (folded) header paths are relative
 * to — for grep/ast tools that is the session cwd, since display paths are
 * formatted relative to cwd regardless of the (sub)directory the search was
 * scoped to. `fileScope` is the initial owning file for body lines that appear
 * before any header (single-file scopes have no `#` headers); it defaults to
 * `headerBase` and should be passed the scoped file's absolute path.
 */
export declare function classifyGroupedLines(lines: readonly string[], headerBase: string | undefined, fileScope?: string | undefined): GroupedLineContext[];
/**
 * Split line indices into blank-line-separated groups, mirroring
 * `splitGroupsByBlankLine`: when any blank line is present, break on runs of
 * blanks; otherwise return a single group of the non-empty lines. Returning
 * indices lets callers slice parallel arrays (raw lines, styled lines, contexts).
 */
export declare function groupLineIndicesByBlank(rawLines: readonly string[]): number[][];
