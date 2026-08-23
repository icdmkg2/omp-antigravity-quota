import type { SecurityScanBundle } from "../contracts/index.js";
export interface SarifImportOptions {
    repositoryRoot: string;
    sourcePath?: string;
    createdAt?: string;
    createScanId?: () => string;
}
export declare function importSarif(input: unknown, options: SarifImportOptions): Promise<SecurityScanBundle>;
export declare function importSarifFile(filePath: string, options: Omit<SarifImportOptions, "sourcePath">): Promise<SecurityScanBundle>;
