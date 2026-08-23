import type { LoadContext } from "../capability/types.js";
interface UserPathCandidateOptions {
    platform?: NodeJS.Platform;
    env?: NodeJS.ProcessEnv;
    windowsUserProfile?: () => string | undefined;
    wslPath?: (windowsPath: string) => string | undefined;
}
/**
 * Run a best-effort discovery probe and return its trimmed stdout, or
 * `undefined` when the command fails, produces no output, or exceeds the
 * timeout. On timeout the child is killed with SIGKILL so a wedged interop pipe
 * cannot hang startup; the killed/non-zero exit is then reported as
 * "unavailable" and discovery falls back to the Linux `$HOME`/`~/.omp`
 * candidates.
 */
export declare function runHostProbe(cmd: string[], timeoutMs?: number): string | undefined;
/** Resolve the Windows host profile home exposed to WSL, if available. */
export declare function getWslWindowsHomeCandidate(options?: UserPathCandidateOptions): string | undefined;
/** User-level paths: ~/.agent[s]/<segments>, plus the Windows host profile under WSL. */
export declare function getUserPathCandidates(ctx: LoadContext, ...segments: string[]): string[];
/**
 * Project-level paths: walk up from cwd to repoRoot, returning `.agent/<segments>`
 * and `.agents/<segments>` at each ancestor.
 *
 * The user home directory is skipped: `~/.agent[s]/` is by definition
 * user-level config and is already enumerated by {@link getUserPathCandidates}.
 * Without this guard, any cwd under `$HOME` (with no closer git repoRoot) would
 * walk up to home and yield duplicate project+user entries for the same
 * directory — see https://github.com/can1357/oh-my-pi/issues/1116.
 */
export declare function getProjectPathCandidates(ctx: LoadContext, ...segments: string[]): string[];
export {};
