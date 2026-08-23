export type TtsrAction = "test" | "list" | "scan";
export declare const TTSR_ACTIONS: TtsrAction[];
export declare const TTSR_SOURCES: TtsrMatchSource[];
export type TtsrMatchSource = "text" | "thinking" | "tool";
export interface TtsrTestArgs {
    /** Inline snippet text. */
    snippet?: string;
    /** Snippet file path, or `-` for stdin. */
    file?: string;
    /** Path to a rule markdown file to test in isolation (skips project loading). */
    rule?: string;
    /** TTSR match source; when omitted, inferred from --file (tool for source files, text otherwise). */
    source?: TtsrMatchSource;
    /** Tool name when `source === "tool"` (e.g. "edit", "write"). */
    tool?: string;
    /** Candidate file path used for scope/glob matching and AST language inference. */
    filePath?: string;
    /** Show every evaluated rule, not just triggered ones. */
    verbose?: boolean;
}
export interface TtsrScanArgs {
    /** Directory to glob and scan files in. */
    directory?: string;
    /** Path to a rule markdown file to test in isolation (skips project loading). */
    rule?: string;
    /** Respect gitignore files while discovering scan candidates. Defaults to true. */
    gitignore?: boolean;
    /** Maximum file size to scan in bytes; 0 disables the limit. */
    maxBytes?: number;
    /** Show details. */
    verbose?: boolean;
}
export interface TtsrCommandArgs {
    action: TtsrAction;
    test?: TtsrTestArgs;
    scan?: TtsrScanArgs;
    json?: boolean;
}
export declare function runTtsrCommand(cmd: TtsrCommandArgs): Promise<void>;
