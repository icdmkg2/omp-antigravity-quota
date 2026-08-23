/** Handle keeping one omp process registered in a project daemon scope. */
export interface DaemonProjectPresence {
    close(): Promise<void>;
}
/** Register this omp process so project daemons survive while it remains alive. */
export declare function registerDaemonProjectPresence(projectDir: string, runtimeOverride?: string): Promise<DaemonProjectPresence>;
/** Return whether a registered omp process in this runtime directory is still alive. */
export declare function hasLiveDaemonProjectPresence(runtimeDir: string): Promise<boolean>;
/** PID recorded in the runtime dir's broker lease when that broker process is still alive; undefined otherwise. */
export declare function readLiveDaemonBrokerPid(runtimeDir: string): Promise<number | undefined>;
/**
 * Remove sibling project daemon runtime directories whose broker is dead and
 * whose client-presence set is empty, reclaiming the disk that short-lived
 * project directories leave behind (issue #8674).
 *
 * Best-effort and non-throwing: a scope is deleted only when its `broker.pid`
 * is absent/dead, no live client presence remains, and it has been untouched
 * for {@link DAEMON_RUNTIME_STALE_GRACE_MS}. The caller's own `currentRuntimeDir`
 * is always skipped, and the sweep runs only inside the {@link DAEMONS_DIR}
 * container over entries named like a {@link DAEMON_SCOPE_KEY} — so a runtime
 * dir relocated elsewhere (e.g. the smoke test under `os.tmpdir()`) never
 * reclaims unrelated neighbours (issue #8721).
 */
export declare function pruneDeadDaemonRuntimeDirs(currentRuntimeDir: string): Promise<void>;
