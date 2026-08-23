import type { CleanseCheckResult, CleanseDiagnostic, CleanseDiagnosticReport, SkippedCleanseCheck } from "./types.js";
/** Optional checker families enabled for a cleanse run. */
export interface CleanseDiagnosticSuiteOptions {
    includeTests?: boolean;
}
/** Identity and display metadata for one runnable checker. */
export interface CleanseCheckerDescriptor {
    id: string;
    label: string;
    language: string;
    /** Project-relative working directory the checker command runs in. */
    cwd: string;
    command: string;
}
/** Lifecycle notifications for one {@link CleanseDiagnosticSuite.run} pass, used by the CLI status board. */
export interface CleanseCheckerRunEvents {
    onCheckerStart?(checker: CleanseCheckerDescriptor): void;
    /**
     * New diagnostics parsed from streaming or final checker output. Each
     * diagnostic is delivered exactly once per run; partial-output batches for
     * long-running checkers arrive before {@link onCheckerEnd}.
     */
    onDiagnostics?(checker: CleanseCheckerDescriptor, diagnostics: readonly CleanseDiagnostic[]): void;
    onCheckerEnd?(check: CleanseCheckResult, durationMs: number): void;
}
/** Inputs for one {@link CleanseDiagnosticSuite.run} pass. */
export interface CleanseSuiteRunOptions {
    signal?: AbortSignal;
    events?: CleanseCheckerRunEvents;
    /** Interval between partial-output parses for streaming checkers; default 5s. */
    flushMs?: number;
}
/** Re-runnable checker set discovered from one project snapshot. */
export interface CleanseDiagnosticSuite {
    /** Every discovered checker; unaffected by {@link CleanseDiagnosticSuite.select}. */
    readonly checkers: readonly CleanseCheckerDescriptor[];
    /** Checkers the next {@link CleanseDiagnosticSuite.run} will execute; narrowed by {@link CleanseDiagnosticSuite.select}. */
    readonly selected: readonly CleanseCheckerDescriptor[];
    readonly skipped: readonly SkippedCleanseCheck[];
    /** Narrow subsequent {@link CleanseDiagnosticSuite.run} calls to the named checker ids. */
    select(ids: readonly string[]): void;
    run(options?: CleanseSuiteRunOptions): Promise<CleanseDiagnosticReport>;
}
/** Discover configured language checkers without installing missing tools. */
export declare function discoverCleanseDiagnosticSuite(projectCwd: string, options?: CleanseDiagnosticSuiteOptions): Promise<CleanseDiagnosticSuite>;
/** One checker proposed by the prompted discovery agent. */
export interface CustomCleanseCheckerSpec {
    label: string;
    language?: string;
    cwd?: string;
    command: string[];
    parser?: string;
}
/** Build a runnable suite from discovery-agent checker specs, dropping unrunnable entries into `skipped`. */
export declare function buildCustomCleanseSuite(projectCwd: string, specs: readonly CustomCleanseCheckerSpec[]): Promise<CleanseDiagnosticSuite>;
/** Identity key matching {@link deduplicateProjectDiagnostics}; used for exactly-once streaming emission. */
export declare function diagnosticKey(diagnostic: CleanseDiagnostic): string;
