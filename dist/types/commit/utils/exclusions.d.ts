export declare function isExcludedFile(path: string): boolean;
export declare function filterExcludedFiles<T extends {
    filename: string;
}>(files: T[]): T[];
