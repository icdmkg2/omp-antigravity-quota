import type { CompressResult } from "./types.js";
/** User-facing options for `omp compress`. */
export interface CompressCommandOptions {
    /** Files and glob patterns to compress. */
    files: string[];
    /** Model selector; defaults to the configured session model. */
    model?: string;
    /** Maximum drafts per file before that file gives up unapproved. Default 3. */
    maxRounds?: number;
    /** Concurrent files. Default 4. */
    concurrency?: number;
    /** Write the approved text here instead of stdout. Single file only. */
    output?: string;
    /** Overwrite each source file with its approved text. */
    inPlace?: boolean;
}
/**
 * Expand `patterns` into a deduplicated, sorted list of absolute file paths.
 *
 * Entries containing glob metacharacters are matched against `cwd`; everything else is
 * treated as a literal path so filenames containing brackets still resolve. Throws when
 * a literal path is missing or a pattern matches nothing, since silently compressing
 * fewer files than asked is worse than failing.
 */
export declare function resolveCompressTargets(patterns: readonly string[], cwd: string): Promise<string[]>;
/** Compress every requested file through the rewrite/approve loop. */
export declare function runCompressCommand(options: CompressCommandOptions): Promise<CompressResult>;
