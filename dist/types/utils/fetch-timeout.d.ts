/** Create an abort signal that fires after a timeout and preserves caller cancellation. */
export declare function withTimeoutSignal(timeoutMs: number, signal?: AbortSignal): AbortSignal;
/** Detect a timeout raised by an abortable fetch. */
export declare function isTimeoutError(error: unknown): boolean;
/**
 * Detect Bun's `UnsupportedProxyProtocol` fetch rejection, raised when a proxy
 * env var (`HTTPS_PROXY`, `ALL_PROXY`, …) points at a scheme it cannot drive —
 * most commonly a SOCKS proxy (`socks5://`, `socks5h://`). The raw error tells
 * the caller to "pass `verbose: true` in the second argument to fetch()", which
 * is meaningless from a CLI, so callers translate it into
 * {@link unsupportedProxyMessage}.
 */
export declare function isUnsupportedProxyError(error: unknown): boolean;
/**
 * Build an actionable CLI message for an {@link isUnsupportedProxyError} failure,
 * naming any set proxy env var whose scheme is not `http(s)://` so the user can
 * see exactly which variable to change.
 */
export declare function unsupportedProxyMessage(env?: Record<string, string | undefined>): string;
