/** Maximum number of recursive `@`-import hops. Matches Claude Code's documented cap. */
export declare const MAX_AT_IMPORT_DEPTH = 5;
export interface ExpandAtImportsOptions {
    /** Maximum hop depth (default: {@link MAX_AT_IMPORT_DEPTH}). */
    maxDepth?: number;
    /** Override the home directory used to resolve `~/...` (default: `os.homedir()`). */
    home?: string;
}
/**
 * Expand `@path/to/file` references in `content` against `filePath`'s directory.
 *
 * Returns the expanded text. When no imports match, the original string is
 * returned unchanged.
 */
export declare function expandAtImports(content: string, filePath: string, options?: ExpandAtImportsOptions): Promise<string>;
