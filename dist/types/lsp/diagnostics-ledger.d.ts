import type { FileDiagnosticsResult } from "./index.js";
export declare function diagnosticIdentity(message: string): string;
export declare class DiagnosticsLedger {
    #private;
    reduce(absPath: string, result: FileDiagnosticsResult): FileDiagnosticsResult;
}
export interface DiagnosticsLedgerOwner {
    diagnosticsLedger?: DiagnosticsLedger;
}
export declare function getDiagnosticsLedger(owner: DiagnosticsLedgerOwner): DiagnosticsLedger;
