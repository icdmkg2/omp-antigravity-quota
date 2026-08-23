import type { SecurityLocation } from "./types.js";
export declare function canonicalSecurityJson(value: unknown): string;
export interface SecurityFindingFingerprintInput {
    ruleId: string;
    category: string;
    anchor?: string;
    locations: readonly SecurityLocation[];
}
export declare function createSecurityFindingFingerprint(input: SecurityFindingFingerprintInput): string;
export declare function createSecurityFindingId(fingerprint: string): string;
export declare function createSecurityOccurrenceId(fingerprint: string, locations: readonly SecurityLocation[]): string;
export declare function createSecurityEvidenceId(fingerprint: string, label: string, ordinal: number): string;
export declare function createSecurityScanId(randomUuid?: () => string): string;
export declare function createSecurityPlanId(fingerprint: string): string;
export declare function encodeSecurityProjectKey(repositoryRoot: string): string;
