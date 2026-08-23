import type { DoctorCheck } from "./types.js";
export declare function runDoctorChecks(): Promise<DoctorCheck[]>;
export declare function formatDoctorResults(checks: DoctorCheck[]): string;
