import type { CleanseDiagnostic, CleanseFileIssues } from "./types.js";
/** Estimate repair burden from severity and available location/fix evidence. */
export declare function diagnosticWeight(diagnostic: CleanseDiagnostic): number;
/** Group diagnostics by file while keeping project-level failures together. */
export declare function groupDiagnosticsByFile(diagnostics: readonly CleanseDiagnostic[]): CleanseFileIssues[];
