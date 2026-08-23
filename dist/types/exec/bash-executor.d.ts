import { type MinimizerOptions } from "@oh-my-pi/pi-natives";
import { type ShellMinimizerSettings } from "../config/settings.js";
export interface BashExecutorOptions {
    cwd?: string;
    /** Milliseconds before aborting the command; 0 disables the executor deadline. */
    timeout?: number;
    onChunk?: (chunk: string) => void;
    chunkThrottleMs?: number;
    signal?: AbortSignal;
    /** Session key suffix to isolate shell sessions per agent */
    sessionKey?: string;
    /** Additional environment variables to inject */
    env?: Record<string, string>;
    /** Run through the configured user shell instead of brush parsing directly. */
    useUserShell?: boolean;
    /** Artifact path/id for full output storage */
    artifactPath?: string;
    artifactId?: string;
    /**
     * Invoked when the native minimizer rewrote the command's output, giving
     * the caller a chance to persist the lossless original capture (typically
     * via the session's `ArtifactManager`). The returned id is spliced into
     * the sink output as `artifact://<id>` so the agent can retrieve the raw
     * bytes. Return `undefined` to skip the footer.
     */
    onMinimizedSave?: (originalText: string, info: {
        filter: string;
        inputBytes: number;
        outputBytes: number;
    }) => Promise<string | undefined>;
}
export interface BashResult {
    output: string;
    exitCode: number | undefined;
    cancelled: boolean;
    /** True when the command was killed by its timeout deadline (not a user abort). */
    timedOut?: boolean;
    truncated: boolean;
    totalLines: number;
    totalBytes: number;
    outputLines: number;
    outputBytes: number;
    artifactId?: string;
    workingDir?: string;
}
export interface DirenvPreflightOptions {
    /** Caller-supplied env overlay; these values win over direnv-provided ones. */
    callerEnv?: Record<string, string>;
    signal?: AbortSignal;
    /** Full direnv-load budget (`bash.direnvLoadTimeoutMs`). A positive
     *  `callerTimeoutMs` clamps the effective load below this; `0`/undefined
     *  leaves the full budget. */
    timeoutMs?: number;
    /** The caller's command deadline (ms). A positive value clamps the direnv
     *  load so a cold `.envrc` can't outlast a short-timeout command; `0` or
     *  undefined means "no caller clamp" — the load keeps its full `timeoutMs`
     *  budget (a disabled command deadline is NOT a 0 ms load). Centralizing the
     *  clamp here keeps every backend (executeBash, ACP terminal, PTY) on one
     *  contract instead of each re-deriving it. */
    callerTimeoutMs?: number;
    /** `bash.direnv` setting — `"off"` skips the load entirely. */
    direnvSetting: "auto" | "off";
    /** Shell wrapper prefix (profiler/strace) to place *after* the unset prefix,
     *  matching `executeBash`'s ordering. Backends that apply their own shell
     *  wrapping (ACP `wrapShellLineForClientTerminal`) omit this. */
    commandPrefix?: string | undefined;
}
/**
 * Load the repo's direnv/devenv env and fold it into a `(command, env)` pair so
 * every bash backend (one-shot `executeBash`, ACP client terminal, PTY) exposes
 * the same devenv tools. Encapsulates: load the diff, merge `set` under the
 * caller's overlay (caller wins), and prepend a regex-gated `unset -v` for
 * variables the `.envrc` removes (skipping any the caller re-supplied).
 *
 * Returns the possibly-prefixed command plus the merged env, or the inputs
 * unchanged (`env` = `callerEnv`) when direnv is off, absent, or has no `.envrc`.
 * Pure transform: does NOT layer non-interactive env defaults — that stays the
 * caller's job (so interactive PTY/ACP paths keep their own env shape).
 */
export declare function applyDirenvPreflight(command: string, cwd: string, opts: DirenvPreflightOptions): Promise<{
    command: string;
    env: Record<string, string> | undefined;
}>;
/** Translate `ShellMinimizerSettings` into native `MinimizerOptions`, or `undefined` when disabled. */
export declare function buildMinimizerOptions(group: ShellMinimizerSettings): MinimizerOptions | undefined;
export declare function isPersistentShellCdCommand(command: string): boolean;
export declare function executeBash(command: string, options?: BashExecutorOptions): Promise<BashResult>;
