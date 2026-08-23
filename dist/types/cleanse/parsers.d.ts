import type { CleanseDiagnostic } from "./types.js";
/** Machine and fallback output formats understood by cleanse. */
export declare const CLEANSE_PARSER_KINDS: readonly ["rust", "rust-test", "go", "go-test", "staticcheck", "golangci", "ruff", "pyright", "mypy", "pylint", "flake8", "ty", "eslint", "biome", "oxlint", "deno-lint", "stylelint", "rubocop", "phpstan", "psalm", "swiftlint", "dart", "credo", "shellcheck", "hlint", "terraform", "tflint", "actionlint", "generic"];
/** One machine or fallback output format understood by cleanse. */
export type CleanseParserKind = (typeof CLEANSE_PARSER_KINDS)[number];
/** Captured checker process output passed to a format parser. */
export interface CleanseParserInput {
    checker: string;
    projectCwd: string;
    checkerCwd: string;
    stdout: string;
    stderr: string;
}
/** Parse one checker invocation into normalized, project-relative diagnostics. */
export declare function parseCleanseDiagnostics(kind: CleanseParserKind, input: CleanseParserInput): CleanseDiagnostic[];
