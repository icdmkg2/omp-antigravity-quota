import type { SecurityScanBundle } from "../contracts/index.js";
export interface CodexSecurityImportOptions {
    repositoryRoot: string;
    createdAt?: string;
    createScanId?: () => string;
}
export declare function importCodexSecurityBundle(bundleDirectory: string, options: CodexSecurityImportOptions): Promise<SecurityScanBundle>;
