import type { FileDiff, FileHunks, NumstatEntry } from "../../commit/types.js";
export declare function parseNumstat(output: string): NumstatEntry[];
export declare function parseFileDiffs(diff: string): FileDiff[];
export declare function parseDiffHunks(diff: string): FileHunks[];
export declare function parseFileHunks(fileDiff: FileDiff): FileHunks;
