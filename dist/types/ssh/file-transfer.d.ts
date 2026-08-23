import { type SSHConnectionTarget } from "./connection-manager.js";
export interface RemoteFileReadOptions {
    /** Maximum bytes to materialize; the helper fetches one extra byte to detect truncation. */
    maxBytes: number;
    signal?: AbortSignal;
    timeoutMs?: number;
}
export interface RemoteFileReadResult {
    /** Raw file bytes, capped at `maxBytes`. */
    bytes: Uint8Array;
    /** True when the remote file was larger than `maxBytes` (`bytes` is the prefix). */
    truncated: boolean;
}
export interface RemoteFileWriteOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
}
/**
 * Read a remote file's raw bytes. Fetches `maxBytes + 1` so the caller can
 * distinguish an exactly-`maxBytes` file from a larger (truncated) one.
 *
 * Throws `ptree.NonZeroExitError` (carrying the remote stderr tail) when the
 * file is missing/unreadable or the host is unreachable.
 */
export declare function readRemoteFile(target: SSHConnectionTarget, remotePath: string, opts: RemoteFileReadOptions): Promise<RemoteFileReadResult>;
/**
 * Write `content` to a remote file byte-exact. Stdin is always staged first into
 * a uniquely named temp in the destination directory (so the remote never blocks
 * on an unread pipe and a dropped connection lands in the temp, never the
 * destination). The destination then dictates the commit:
 *  - a directory — or a symlink to one, since the `-d` test follows links — is
 *    refused (a plain `mv tmp dir` would move the temp INTO it).
 *  - an existing non-symlink regular file is rewritten IN PLACE from the staged
 *    temp, preserving its inode and therefore its ordinary permission bits (a
 *    `0600` secret stays `0600` on overwrite), ACLs, xattrs, and hardlinks. The
 *    setuid/setgid bits may be cleared by the write (per POSIX). This commit is
 *    not fully atomic — a remote-side failure during the local temp->dest copy
 *    (e.g. the disk filling) can truncate the destination — but the slow network
 *    transfer has already landed in the temp, and the temp is removed on failure.
 *    It also needs write permission on the file itself (a read-only file is
 *    refused, not silently replaced).
 *  - an existing special file (FIFO/socket/device) is refused, not replaced.
 *  - anything else (a new path, a symlink to a non-directory, a dangling symlink)
 *    is committed with an atomic rename, which REPLACES a symlink with a regular
 *    file rather than writing through it (resolving the link target is not
 *    portable across the macOS/Linux hosts this stack supports).
 * Throws `ptree.NonZeroExitError` when the remote path is unwritable or the host
 * is unreachable.
 */
export declare function writeRemoteFile(target: SSHConnectionTarget, remotePath: string, content: Uint8Array, opts: RemoteFileWriteOptions): Promise<void>;
/** Classification of a remote path, used by the read handler's directory dispatch. */
export type RemotePathKind = "file" | "directory" | "other" | "missing";
/**
 * Classify a remote path with POSIX `test` (portable across Linux/BSD/macOS):
 * `directory`, regular `file`, `other` (special file), or `missing`.
 */
export declare function statRemotePath(target: SSHConnectionTarget, remotePath: string, opts?: {
    signal?: AbortSignal;
    timeoutMs?: number;
}): Promise<RemotePathKind>;
/** A single entry in a remote directory listing. */
export interface RemoteDirEntry {
    /** Entry name (no path component), trailing `/` stripped. */
    name: string;
    /** True when the entry is a directory. */
    isDirectory: boolean;
}
/**
 * List a remote directory one level deep with `ls -1Ap` (one per line; all
 * entries incl. dotfiles but not `.`/`..`; trailing `/` marks directories).
 * Plain `ls` (no `| head`) so a permission/race failure surfaces as a non-zero
 * exit instead of being masked as an empty listing. Entries are returned in
 * full, sorted directories-first then by name to mirror the local
 * directory-resource contract, so the read tool can paginate the listing.
 */
export declare function listRemoteDir(target: SSHConnectionTarget, remotePath: string, opts?: {
    signal?: AbortSignal;
    timeoutMs?: number;
}): Promise<RemoteDirEntry[]>;
