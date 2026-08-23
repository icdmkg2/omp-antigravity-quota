import type { CommitType } from "../../commit/types.js";
export interface TrivialChangeResult {
    isTrivial: true;
    type: CommitType;
    summary: string;
}
export declare function detectTrivialChange(diff: string): TrivialChangeResult | null;
