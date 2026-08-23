import type { SecurityComparisonReport, SecurityFinding, SecurityScanBundle } from "./contracts/index.js";
export interface SecurityDifferentialFindingMatch {
    referenceFindingId: string;
    candidateFindingId: string;
    basis: "fingerprint" | "rule_location" | "taxonomy_location";
}
export interface SecurityDifferentialFindingSummary {
    findingId: string;
    ruleId: string;
    title: string;
    severity: SecurityFinding["severity"]["level"];
    confidence: SecurityFinding["confidence"]["level"];
    validationStatus: SecurityFinding["validation"]["status"];
    dispositionStatus: SecurityFinding["disposition"]["status"];
    primaryLocation?: {
        path: string;
        startLine: number;
    };
}
export interface SecurityDifferentialScanSummary {
    scanId: string;
    producer: SecurityScanBundle["scan"]["producer"];
    status: SecurityScanBundle["scan"]["status"];
    findingCount: number;
    actionableFindingCount: number;
    validatedFindingCount: number;
    rejectedFindingCount: number;
    coverage: SecurityScanBundle["scan"]["coverage"];
    metrics?: SecurityScanBundle["scan"]["metrics"];
}
export interface SecurityDifferentialReport {
    referenceScanId: string;
    candidateScanId: string;
    matches: SecurityDifferentialFindingMatch[];
    referenceOnlyFindingIds: string[];
    candidateOnlyFindingIds: string[];
    reference: SecurityDifferentialScanSummary;
    candidate: SecurityDifferentialScanSummary;
    referenceOnlyFindings: SecurityDifferentialFindingSummary[];
    candidateOnlyFindings: SecurityDifferentialFindingSummary[];
    referenceFindingCount: number;
    candidateFindingCount: number;
    matchedFindingCount: number;
    recallAgainstReference: number;
    precisionAgainstReference: number;
    jaccardOverlap: number;
}
export declare function compareSecurityProducers(reference: SecurityScanBundle, candidate: SecurityScanBundle): SecurityDifferentialReport;
export declare function compareSecurityLineage(before: SecurityScanBundle, after: SecurityScanBundle): SecurityComparisonReport;
