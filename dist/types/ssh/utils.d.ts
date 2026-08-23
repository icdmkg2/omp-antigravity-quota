export declare function sanitizeHostName(name: string): string;
export declare function buildSshTarget(username: string | undefined, host: string): string;
/**
 * Single-quote a path for a POSIX remote shell, escaping embedded single quotes.
 * Mirrors the private `quoteRemotePath` in `tools/ssh.ts`; shared here for the
 * `ssh://` file-transfer helpers.
 */
export declare function quotePosixPath(value: string): string;
/**
 * Wrap a POSIX command in `<shell> -c '<command>'` so it runs under the
 * named shell rather than whatever `$SHELL` happens to be on the remote.
 *
 * Used by the `ssh://` transfer helpers and the Windows compat dispatch:
 * OpenSSH passes our snippets to `<login-shell> -c`, so a remote whose
 * login shell is fish/csh/tcsh (or cmd/powershell on Windows compat)
 * can't parse `if [ … ]; then …`. Wrapping forces parsing under the
 * shell OMP actually verified can run the snippet.
 *
 * `-c` (not `-lc`): the transfer snippets only call absolute POSIX
 * builtins (`head`/`cat`/`mv`/`test`/`ls`/`mkdir`/`rm`/`dirname`) and
 * don't need login-profile setup. Capability *probing* still uses
 * `-lc` to mirror the user's real environment.
 */
export declare function wrapInPosixShell(shell: "sh" | "bash" | "zsh", command: string): string;
