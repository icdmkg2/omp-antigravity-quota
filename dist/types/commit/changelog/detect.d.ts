import type { ChangelogBoundary } from "../../commit/types.js";
export declare function detectChangelogBoundaries(cwd: string, stagedFiles: string[]): Promise<ChangelogBoundary[]>;
