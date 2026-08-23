import type { CommitType, ConventionalAnalysis, NumstatEntry } from "../../commit/types.js";
import type { CommitProposal } from "./state.js";
export declare function generateFallbackAnalysis(numstat: NumstatEntry[]): ConventionalAnalysis;
export declare function generateFallbackSummary(type: CommitType, numstat: NumstatEntry[]): string;
export declare function generateFallbackProposal(numstat: NumstatEntry[]): CommitProposal;
