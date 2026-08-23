import type { NumstatEntry } from "../../commit/types.js";
export interface ScopeCandidatesResult {
    scopeCandidates: string;
    isWide: boolean;
}
export declare function extractScopeCandidates(numstat: NumstatEntry[]): ScopeCandidatesResult;
