import type { SecurityAccountRef, SecurityProducer, SecurityProvenance, SecurityScan } from "./contracts/index.js";
export declare const CODEX_SECURITY_UPSTREAM: {
    readonly repository: "https://github.com/openai/codex-security";
    readonly revision: "f22d4a36f26d16287bcdfd707b369116e02a08c3";
    readonly packageVersion: "0.1.1";
    readonly pluginVersion: "0.1.14";
    readonly archiveSha256: "13745c495b7c5cf5273cf2115df86b9c3ec3056f43151c869e004aa3f30bcffb";
};
export declare const OMP_SECURITY_WORKFLOW_VERSION = "1.0.0";
export declare function createNativeSecurityProducer(): SecurityProducer;
export declare function createSecurityCredentialAffinity(account: SecurityAccountRef): string;
export declare function redactPrivateSecurityMetadata(value: unknown): unknown;
export declare function createPublicSecurityScan(scan: SecurityScan, options?: {
    includePlan?: boolean;
}): unknown;
export declare function createNativeSecurityProvenance(options: {
    createdAt: string;
    account: SecurityAccountRef;
    planFingerprint: string;
    workflowFingerprint: string;
    sessionId?: string;
    operationId?: string;
}): SecurityProvenance;
export declare function createSecurityWorkflowFingerprint(inputs: readonly string[]): string;
