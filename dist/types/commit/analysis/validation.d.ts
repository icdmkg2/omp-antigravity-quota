import type { ConventionalAnalysis } from "../../commit/types.js";
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export declare function validateSummary(summary: string, maxChars: number): ValidationResult;
export declare function validateScope(scope: string | null): ValidationResult;
export declare function validateAnalysis(analysis: ConventionalAnalysis): ValidationResult;
