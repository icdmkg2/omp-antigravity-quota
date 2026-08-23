import type { Model } from "@oh-my-pi/pi-ai";
import type { AsyncJobManager } from "../async/job-manager.js";
import type { ModelRegistry } from "../config/model-registry.js";
import type { Settings } from "../config/settings.js";
import type { ToolDefinition } from "../extensibility/extensions/index.js";
import type { AuthStorage } from "../session/auth-storage.js";
import { SessionManager } from "../session/session-manager.js";
import type { SecurityScanPlan } from "./contracts/index.js";
import type { SecurityGitAdapter, SecurityTargetRequest } from "./preflight.js";
import { SecurityStore } from "./store.js";
export type SecurityOperationPhase = "queued" | "preparing" | "reviewing" | "publishing" | "completed" | "partial" | "cancelled" | "failed";
export interface SecurityOperationSnapshot {
    operationId: string;
    planId: string;
    scanId: string;
    phase: SecurityOperationPhase;
    createdAt: string;
    updatedAt: string;
    jobId?: string;
    sessionFile?: string;
    findingCount: number;
    error?: string;
}
export interface SecurityCoordinatorHost {
    cwd: string;
    settings: Settings;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
    activeModel?: Model;
    sessionId?: string;
    agentId?: string;
    asyncJobManager?: AsyncJobManager;
}
export interface SecurityPreflightInput {
    target?: SecurityTargetRequest;
    knowledgeBasePaths?: string[];
    outputRoot?: string;
    archiveExisting?: boolean;
    credentialId?: number;
    model?: Model;
    thinkingLevel?: string;
    signal?: AbortSignal;
}
export interface SecurityStartInput {
    planId: string;
}
export interface SecurityScanSession {
    prompt(text: string, options?: {
        expandPromptTemplates?: boolean;
        synthetic?: boolean;
        userInitiated?: boolean;
    }): Promise<boolean>;
    waitForIdle(): Promise<void>;
    getSessionStats?(): {
        tokens: {
            input: number;
            output: number;
            reasoning: number;
            cacheRead: number;
            cacheWrite: number;
            total: number;
        };
        cost: number;
        premiumRequests: number;
    };
    abort(options?: {
        reason?: string;
    }): Promise<void>;
    dispose(): Promise<void>;
    readonly sessionFile?: string;
}
export interface SecurityScanSessionFactoryInput {
    host: SecurityCoordinatorHost;
    plan: SecurityScanPlan;
    executionRoot: string;
    scanId: string;
    model: Model;
    publicationTool: ToolDefinition;
    sessionManager: SessionManager;
}
export type SecurityScanSessionFactory = (input: SecurityScanSessionFactoryInput) => Promise<SecurityScanSession>;
export interface SecurityCoordinatorDependencies {
    createSession?: SecurityScanSessionFactory;
    openStore?: (repositoryRoot: string) => Promise<SecurityStore>;
    gitAdapter?: SecurityGitAdapter;
    now?: () => Date;
    createOperationId?: () => string;
}
export declare class SecurityCoordinator {
    #private;
    constructor(host: SecurityCoordinatorHost, dependencies?: SecurityCoordinatorDependencies);
    preflight(input?: SecurityPreflightInput): Promise<SecurityScanPlan>;
    start(input: SecurityStartInput): Promise<SecurityOperationSnapshot>;
    status(operationId: string): Promise<SecurityOperationSnapshot | null>;
    listOperations(): Promise<SecurityOperationSnapshot[]>;
    cancel(operationId: string): Promise<boolean>;
    wait(operationId: string): Promise<SecurityOperationSnapshot>;
}
export declare function getSecurityCoordinator(host: SecurityCoordinatorHost): SecurityCoordinator;
export declare function resetSecurityCoordinatorsForTests(): void;
