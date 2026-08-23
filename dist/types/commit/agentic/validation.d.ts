import type { CommitType, ConventionalDetail } from "../../commit/types.js";
export declare const SUMMARY_MAX_CHARS = 72;
export declare const MAX_DETAIL_ITEMS = 6;
export declare function normalizeSummary(summary: string, type: CommitType, scope: string | null): string;
export declare function validateSummaryRules(summary: string): {
    errors: string[];
    warnings: string[];
};
export declare function capDetails(details: ConventionalDetail[]): {
    details: ConventionalDetail[];
    warnings: string[];
};
export declare function validateTypeConsistency(type: CommitType, files: string[], options?: {
    diffText?: string;
    summary?: string;
    details?: ConventionalDetail[];
}): {
    errors: string[];
    warnings: string[];
};
