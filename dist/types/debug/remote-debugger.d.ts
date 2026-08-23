/**
 * Bun JavaScriptCore remote inspector control.
 *
 * Wraps `bun:jsc`'s `startRemoteDebugger`, which exposes JavaScriptCore's
 * built-in WebKit RemoteInspectorServer over a raw socket. The API is one-shot
 * and rough around the edges (Bun documents it as untested, "may not be
 * supported yet on macOS"):
 *   - it returns `void` and has no stop handle, so we track the live endpoint
 *     at module scope and make starting idempotent;
 *   - it rejects port `0`, so "let the OS pick" is implemented by reserving a
 *     free port via `node:net` and handing the concrete number to Bun;
 *   - on macOS (Bun 1.3.x) it throws a spurious "port already in use" error
 *     even when the server binds fine, so success is decided by a loopback
 *     probe rather than by whether the call threw.
 */
export interface RemoteDebuggerInfo {
    host: string;
    port: number;
}
/** Underlying starter signature; tests inject a disposable listener in its place. */
export type RemoteDebuggerStarter = (host: string, port: number) => void;
export interface StartRemoteDebuggerOptions {
    /** Explicit port; when omitted a free port is reserved automatically. */
    port?: number;
    /** Override the JSC starter. Defaults to `bun:jsc`'s `startRemoteDebugger`. */
    start?: RemoteDebuggerStarter;
}
/** The live inspector endpoint for this process, or `null` if not started. */
export declare function getRemoteDebugger(): RemoteDebuggerInfo | null;
/**
 * Start the JavaScriptCore remote inspector for this process and return its
 * endpoint. Idempotent: the underlying API cannot be stopped or rebound, so a
 * second call returns the existing endpoint instead of starting again. When
 * `port` is omitted a free port is reserved automatically.
 *
 * Throws only when the socket never comes up; Bun's spurious bind error is
 * swallowed and overridden by the loopback probe.
 */
export declare function startRemoteDebuggerServer(options?: StartRemoteDebuggerOptions): Promise<RemoteDebuggerInfo>;
/**
 * Test-only: forget the tracked endpoint so a fresh start can be exercised.
 * Does not (and cannot) stop a real JSC inspector — callers in tests own the
 * disposable listener they injected.
 */
export declare function __resetRemoteDebuggerForTests(): void;
