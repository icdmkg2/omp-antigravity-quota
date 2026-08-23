import type { SecurityComparisonReport, SecurityDisposition, SecurityEvidence, SecurityFinding, SecurityScan, SecurityScanBundle, SecurityScanPlan, SecurityValidation } from "./contracts/index.js";
export interface SecurityScanSummary {
    id: string;
    status: SecurityScan["status"];
    createdAt: string;
    completedAt?: string;
    producer: SecurityScan["producer"];
    findingCount: number;
    target: SecurityScan["target"];
}
export interface SecurityStoreOptions {
    stateRoot?: string;
    signal?: AbortSignal;
}
export interface SecurityFileWriteOptions {
    hardenParent?: boolean;
}
export declare function writeSecurityFileAtomic(filePath: string, content: string, options?: SecurityFileWriteOptions): Promise<void>;
export declare function writeSecurityBundleToDirectory(directory: string, input: SecurityScanBundle): Promise<void>;
export declare class SecurityStore {
    #private;
    constructor(repositoryRoot: string, projectKey: string, projectDirectory: string);
    static open(repositoryRoot: string, options?: SecurityStoreOptions): Promise<SecurityStore>;
    static openForCwd(cwd: string, options?: SecurityStoreOptions): Promise<SecurityStore>;
    get repositoryRoot(): string;
    get projectKey(): string;
    get projectDirectory(): string;
    putBundle(input: SecurityScanBundle): Promise<void>;
    putPlan(input: SecurityScanPlan): Promise<void>;
    getPlan(planId: string): Promise<SecurityScanPlan | null>;
    listPlans(): Promise<SecurityScanPlan[]>;
    getScan(scanId: string): Promise<SecurityScan | null>;
    getBundle(scanId: string): Promise<SecurityScanBundle | null>;
    listScans(): Promise<SecurityScanSummary[]>;
    getFinding(scanId: string, findingId: string): Promise<SecurityFinding | null>;
    updateDisposition(scanId: string, findingId: string, disposition: SecurityDisposition): Promise<SecurityFinding>;
    updateValidation(scanId: string, findingId: string, validation: SecurityValidation, evidence?: readonly SecurityEvidence[]): Promise<SecurityFinding>;
    compare(beforeScanId: string, afterScanId: string): Promise<SecurityComparisonReport>;
    storeDigest(): Promise<string>;
}
