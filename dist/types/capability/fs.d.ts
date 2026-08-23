import * as fs from "node:fs";
export declare function readFile(filePath: string): Promise<string | null>;
export declare function readDirEntries(dirPath: string): Promise<fs.Dirent[]>;
export declare function readDir(dirPath: string): Promise<string[]>;
export declare function walkUp(startDir: string, name: string, opts?: {
    file?: boolean;
    dir?: boolean;
}): Promise<string | null>;
/**
 * Walk up from startDir looking for a `.git` entry (file or directory).
 * Returns the directory containing `.git` (the repo root), or null if not in a git repo.
 * Results are based on the cached readDirEntries, so repeated calls are cheap.
 */
export declare function findRepoRoot(startDir: string): Promise<string | null>;
export declare function cacheStats(): {
    content: number;
    dir: number;
};
export declare function clearCache(): void;
export declare function invalidate(filePath: string): void;
