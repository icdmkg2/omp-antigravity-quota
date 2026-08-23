/**
 * Creates a deduplicating recorder for relative file paths.
 * Preserves insertion order in `list`; subsequent duplicates are ignored.
 */
export declare function createFileRecorder(): {
    record: (relativePath: string) => void;
    list: string[];
};
/**
 * Strip native virtual-root prefixes and format file paths relative to cwd when
 * they are inside cwd. Paths outside cwd remain absolute.
 */
export declare function formatResultPath(filePath: string, isDirectory: boolean, basePath: string, cwd: string): string;
