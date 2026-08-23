export interface SSHConnectionTarget {
    name: string;
    host: string;
    username?: string;
    port?: number;
    keyPath?: string;
    compat?: boolean;
}
export type SSHHostOs = "windows" | "linux" | "macos" | "unknown";
export type SSHHostShell = "cmd" | "powershell" | "bash" | "zsh" | "sh" | "unknown";
export type SshPlatform = typeof process.platform;
export declare function supportsSshControlMaster(platform?: SshPlatform): boolean;
export interface SSHHostInfo {
    version: number;
    os: SSHHostOs;
    shell: SSHHostShell;
    /**
     * Shell name OMP verified can execute the POSIX transfer snippets
     * (`head`/`cat`/`mv`/`test`/`ls`) `ssh://` uses. Probed by running
     * `sh -lc` / `bash -lc` / `zsh -lc` against the remote and keeping the
     * first one that round-trips a known marker. Independent of `shell`
     * (the self-reported login shell), which may be noisy, exotic, or simply
     * mis-classified — only `transferShell` gates ssh:// transfers.
     */
    transferShell?: "sh" | "bash" | "zsh";
    compatShell?: "bash" | "sh";
    compatEnabled: boolean;
}
/**
 * Whether `controlDir` leaves room for the whole `%C.sock` plus OpenSSH's mux
 * temp bind within `sun_path` (104 bytes on macOS, 108 elsewhere; OpenSSH
 * rejects lengths >= that). The worst case is dir + "/" + expanded `%C.sock`
 * (40-hex digest + ".sock") + the mux temp suffix.
 */
export declare function controlPathFitsBudget(controlDir: string, platform: SshPlatform): boolean;
/**
 * Deterministic, depth-bounded control directory used when the canonical
 * control directory would overflow `sun_path` (#9070). The digest keys both
 * uid and the fully resolved canonical control directory, separated by NUL so
 * their boundaries are unambiguous. This preserves isolation when the same
 * profile resolves through different XDG state roots without spending variable
 * path bytes on the decimal uid.
 */
export declare function sshControlFallbackDir(canonicalDir: string, uid: number, tmpBase?: string): string;
interface ControlDirChoice {
    dir: string;
    /** True when `dir` is the shared-temp fallback and needs owner-private hardening. */
    shared: boolean;
}
/**
 * Choose the SSH control directory. Prefers the canonical profile-rooted path
 * and only relocates to {@link sshControlFallbackDir} when the canonical path
 * cannot hold the full `%C.sock` + mux temp bind within `sun_path`. Platforms
 * without ControlMaster (Windows) or without a uid keep the canonical path.
 */
export declare function resolveSshControlDir(opts: {
    canonicalDir: string;
    platform: SshPlatform;
    uid: number | undefined;
    tmpBase?: string;
}): ControlDirChoice;
interface ControlDirGuardStat {
    isSymlink: boolean;
    isDir: boolean;
    uid: number;
    mode: number;
}
/**
 * Reject reasons for an owner-private control directory reused from a shared
 * temp base: it must be a real directory (not a symlink an attacker planted),
 * owned by us, with no group/other access. Returns `null` when the directory is
 * safe to use. Pure so the rejection matrix is testable without root.
 */
export declare function controlDirGuardError(stat: ControlDirGuardStat, expectedUid: number | undefined): string | null;
interface SSHArgsOptions {
    platform?: SshPlatform;
    /** When true, omit `-n` so the remote command can read from our piped stdin. */
    allowStdin?: boolean;
}
/**
 * Create the shared SSH ControlMaster directory and enforce its trust boundary.
 *
 * Both direct SSH connections and sshfs mounts MUST call this before launching
 * OpenSSH so the bounded `/tmp` fallback cannot bypass the symlink, owner, or
 * mode checks.
 */
export declare function ensureSshControlDir(): void;
/**
 * Harden a control directory pulled from a shared temp base ({@link CONTROL_DIR_SHARED}).
 *
 * Opens the final path component with `O_NOFOLLOW | O_DIRECTORY` so a symlink or
 * non-directory is refused atomically at open time, then inspects and normalizes
 * that one pinned inode through the fd (`fstat`/`fchmod`) — never a second
 * pathname lookup. This closes the swap window where another local user could
 * replace the entry with a symlink between two `stat`s and slip a victim-owned
 * 0700 target past the checks (#9070). Rejects a symlink, a non-directory, a
 * foreign owner, or lingering group/other access via {@link controlDirGuardError}.
 * Exported as a test seam.
 */
export declare function assertOwnerPrivateDir(dir: string): void;
declare function runSshSync(args: string[], timeoutMs?: number): Promise<{
    exitCode: number | null;
    stderr: string;
}>;
declare function runSshCaptureSync(args: string[], timeoutMs?: number): Promise<{
    exitCode: number | null;
    stdout: string;
    stderr: string;
}>;
/**
 * Test-only surface for exercising the pre-command SSH helpers against a
 * fake `ssh` binary with a shortened timeout. External code MUST NOT depend
 * on this — call `ensureConnection` / `ensureHostInfo` instead.
 * @internal
 */
export declare const _sshHelpersForTests: {
    runSshSync: typeof runSshSync;
    runSshCaptureSync: typeof runSshCaptureSync;
};
/**
 * Parse a raw cache-file value (or any unknown) into a normalized
 * {@link SSHHostInfo}, dropping fields that don't pass the per-field guards.
 * Exported so cache-layer round-tripping (incl. the new `transferShell`
 * field, #3719) is testable without touching disk.
 */
export declare function parseHostInfo(value: unknown): SSHHostInfo | null;
/**
 * Frame marker emitted by the remote OS/shell probe. The probe wraps its
 * payload in this prefix so the parser can ignore startup-file noise (banners,
 * `motd`, login messages, `Last login: …`) instead of trusting only the first
 * line of stdout. See #3719.
 */
export declare const HOST_PROBE_MARKER = "PI_HOST_PROBE=";
/** Marker for the transfer-shell capability probe. */
export declare const TRANSFER_PROBE_MARKER = "PI_TRANSFER_OK|";
/**
 * Find the first line of `stdout`/`stderr` that begins with `marker` and
 * return everything after it. Used by the SSH host probe so noisy login
 * dotfiles can't corrupt OS/shell classification by emitting text on the
 * first line of `ssh` output.
 *
 * Returns `null` when no marker line is found in either stream.
 */
export declare function extractProbePayload(stdout: string, stderr: string, marker?: string): string | null;
/**
 * Find `marker` anywhere in `stdout` or `stderr` and return everything that
 * follows it, scanning stdout first. Returns `null` when the marker is in
 * neither stream.
 *
 * Used by the transfer-shell capability probe. Some remotes have broken
 * login dotfiles that swap fd 1/2, so the marker can land on stderr even
 * though the probe ran the printf successfully (matches the host-info
 * probe's stderr fallback). See #3719.
 */
export declare function findProbeMarker(stdout: string, stderr: string, marker: string): string | null;
/** Classify a POSIX-ish `uname -s` payload from the transfer-shell probe. */
export declare function osFromUname(value: string): SSHHostOs | undefined;
export declare function getHostInfo(hostName: string): Promise<SSHHostInfo | undefined>;
export declare function getHostInfoForHost(host: SSHConnectionTarget): Promise<SSHHostInfo | undefined>;
/**
 * Synchronous, probe-free host info lookup for startup paths.
 *
 * Checks the in-memory cache, then falls back to a synchronous read of the
 * persisted host-info cache file. Never opens a connection or probes the
 * remote host — callers get `undefined` when nothing is cached yet.
 */
export declare function getCachedHostInfoSync(host: SSHConnectionTarget): SSHHostInfo | undefined;
export declare function ensureHostInfo(host: SSHConnectionTarget): Promise<SSHHostInfo>;
export declare function buildRemoteCommand(host: SSHConnectionTarget, command: string, options?: SSHArgsOptions): Promise<string[]>;
export declare function ensureConnection(host: SSHConnectionTarget): Promise<void>;
export declare function invalidateHostMetadata(hostNames: Iterable<string>): Promise<void>;
export declare function closeConnection(hostName: string): Promise<void>;
export declare function closeAllConnections(): Promise<void>;
export declare function getControlPathTemplate(): string;
export declare function getControlDir(): string;
export {};
