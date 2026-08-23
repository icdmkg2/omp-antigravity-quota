/** Project type detection result */
export interface ProjectType {
    type: "rust" | "typescript" | "go" | "python" | "unknown";
    command?: string[];
    description: string;
}
/**
 * Detect every project type present at the workspace root.
 *
 * Detection used to return on the first matching marker, so a polyglot root
 * (for example `Cargo.toml` alongside `tsconfig.json`) only ever ran the
 * highest-priority checker and silently skipped the rest: the workspace was
 * reported as verified while whole languages went unchecked. Every marker is
 * collected instead, in the original priority order, so single-language roots
 * keep their exact previous result while polyglot roots check everything.
 *
 * `go.work` still wins over `go.mod` and `pyproject.toml` over
 * `pyrightconfig.json` — those pairs are two markers for one toolchain, not
 * two separate languages.
 */
export declare function detectProjectTypes(cwd: string, signal?: AbortSignal): Promise<ProjectType[]>;
/** Interpret an empty checker result without mistaking a crash for a clean workspace. */
export declare function interpretEmptyDiagnosticsResult(exitCode: number, signalCode: string | null, command: readonly string[]): string;
/** Join per-language descriptions for the aggregate header. */
export declare function combineProjectDescriptions(projectTypes: readonly ProjectType[]): string;
/**
 * Label each section when more than one checker ran.
 *
 * A single detected language keeps the bare output it has always produced, so
 * existing callers and their expectations are untouched.
 */
export declare function combineDiagnosticsOutputs(sections: readonly {
    description: string;
    output: string;
}[]): string;
/** Run workspace diagnostics command and parse output */
export declare function runWorkspaceDiagnostics(cwd: string, signal?: AbortSignal): Promise<{
    output: string;
    projectType: ProjectType;
    projectTypes: ProjectType[];
}>;
