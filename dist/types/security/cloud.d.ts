import type { AuthStorage } from "../session/auth-storage.js";
import { type SecurityAccountRef, type SecurityScanBundle, type SecuritySeverityLevel } from "./contracts/index.js";
import type { SecurityStore } from "./store.js";
type JsonObject = Record<string, unknown>;
export type CodexSecurityCloudFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
export interface CodexSecurityCloudClientOptions {
    authStorage: AuthStorage;
    account: SecurityAccountRef;
    baseUrl?: string;
    fetch?: CodexSecurityCloudFetch;
}
export interface CodexSecurityCloudConfiguration {
    id: string;
    sourceId?: string;
    repositoryId: string;
    repositoryUrl: string;
    environmentId: string;
    state?: string;
    currentStep?: string;
    scanType?: string;
    remainingScans?: number;
    totalScans?: number;
    createdAt?: string;
    updatedAt?: string;
}
export interface CodexSecurityCloudConfigurationPage {
    items: CodexSecurityCloudConfiguration[];
    nextCursor?: string;
    totalInAccount?: number;
}
export interface StartCodexSecurityCloudScanInput {
    repositoryId: string;
    repositoryUrl: string;
    environmentId: string;
    lookbackDays?: number | "all";
    maintainerAttackConcerns?: string;
    maintainerFocusAreas?: string;
    maintainerAdditionalContext?: string;
    signal?: AbortSignal;
}
export interface CodexSecurityCloudStats {
    configurationId: string;
    sourceConfigurationId?: string;
    currentStep?: string;
    pendingCommits: number;
    finishedCommits: number;
    failedCommits: number;
    findingCounts: Record<SecuritySeverityLevel, number>;
    lastScannedCommit?: string;
    lastScannedAt?: string;
    updatedAt?: string;
}
export interface PullCodexSecurityCloudResultsInput {
    client: CodexSecurityCloudClient;
    configurationId: string;
    store: SecurityStore;
    signal?: AbortSignal;
}
export declare class CodexSecurityCloudHttpError extends Error {
    readonly status: number;
    readonly endpoint: string;
    constructor(status: number, endpoint: string);
}
export declare class CodexSecurityCloudClient {
    #private;
    constructor(options: CodexSecurityCloudClientOptions);
    listConfigurations(options?: {
        limit?: number;
        cursor?: string;
        signal?: AbortSignal;
    }): Promise<CodexSecurityCloudConfigurationPage>;
    listAllConfigurations(signal?: AbortSignal): Promise<CodexSecurityCloudConfiguration[]>;
    getConfiguration(configurationId: string, signal?: AbortSignal): Promise<CodexSecurityCloudConfiguration>;
    startScan(input: StartCodexSecurityCloudScanInput): Promise<CodexSecurityCloudConfiguration>;
    getStats(configurationId: string, signal?: AbortSignal): Promise<CodexSecurityCloudStats>;
    listFindingDetails(repositoryUrl: string, configuration: CodexSecurityCloudConfiguration, signal?: AbortSignal): Promise<JsonObject[]>;
}
export declare function pullCodexSecurityCloudResults(input: PullCodexSecurityCloudResultsInput): Promise<SecurityScanBundle>;
export {};
