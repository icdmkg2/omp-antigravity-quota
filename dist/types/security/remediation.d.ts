import type { IsoBackendKind } from "@oh-my-pi/pi-natives";
import type { IsolationContext } from "../task/isolation-runner.js";
import type { IsolationHandle, WorktreeBaseline } from "../task/worktree.js";
export interface SecurityRemediationRequest {
    cwd: string;
    findingIds: string[];
    isolationId?: string;
    preferredBackend?: IsoBackendKind;
}
export interface SecurityRemediationWorkspace {
    id: string;
    repositoryRoot: string;
    worktreePath: string;
    findingIds: string[];
    backend: IsoBackendKind;
    fellBack: boolean;
    fallbackReason: string | null;
    cleanup(): Promise<void>;
}
export interface SecurityRemediationDependencies {
    prepareContext?: (cwd: string) => Promise<IsolationContext>;
    createIsolation?: (repositoryRoot: string, id: string, preferred?: IsoBackendKind) => Promise<IsolationHandle>;
    cleanupIsolation?: (handle: IsolationHandle) => Promise<void>;
    createId?: () => string;
}
export declare function assertSecurityRemediationBaselineClean(baseline: WorktreeBaseline): void;
export declare function prepareSecurityRemediationWorkspace(request: SecurityRemediationRequest, dependencies?: SecurityRemediationDependencies): Promise<SecurityRemediationWorkspace>;
