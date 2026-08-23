/**
 * MCP stdio transport.
 *
 * Implements JSON-RPC 2.0 over subprocess stdin/stdout.
 * Messages are newline-delimited JSON.
 */
import type { MCPRequestOptions, MCPStdioServerConfig, MCPTransport } from "../../mcp/types.js";
/** Subprocess argv and platform-derived spawn flags for an MCP stdio server. */
export interface StdioSpawnCommand {
    cmd: string[];
    /**
     * Hide the Windows console window for the direct child.
     *
     * Windows uses this only when the OMP host has no console to share. When
     * the host is running inside a terminal, `windowsHide: true` maps to
     * `CREATE_NO_WINDOW`, which strips that inheritable console from hidden
     * `cmd.exe` / PowerShell wrapper chains. Their console grandchildren then
     * allocate fresh visible conhost windows during startup or reconnects
     * (#3567).
     */
    windowsHide?: boolean;
    /**
     * Run the subprocess in its own session when the platform can safely do so.
     *
     * Linux/other POSIX: `true`. Detach → `setsid`, so the MCP process tree has
     * no controlling terminal and terminal job-control signals (Ctrl+Z SIGTSTP,
     * background-read SIGTTIN) cannot stop stdio servers such as
     * `chrome-devtools-mcp` and leave our read loop blocked on silent pipes.
     *
     * macOS: `false`. LaunchServices/TCC attributes Apple Events automation to
     * the responsible terminal process only while the child stays in the
     * inherited session; detaching via `setsid` prevents the permission prompt
     * for servers such as `xcrun mcpbridge` (#4987).
     *
     * Windows: `false`. There is no SIGTSTP/SIGTTIN to escape, and Windows
     * wrapper chains must stay in the OMP console session so nested console
     * grandchildren keep stdout routed through our pipe (#3544).
     */
    detached: boolean;
    /**
     * Pass argv to `Bun.spawn` verbatim (Windows only), suppressing the
     * default libuv backslash-quoting.
     *
     * Set when `cmd` already holds a `cmd.exe /d /e:ON /v:OFF /c "<line>"`
     * command line escaped for `cmd.exe`'s parser (see `buildCmdExeArgv`).
     * libuv's quoting targets `CommandLineToArgvW`, not `cmd.exe`, so letting
     * it re-quote a batch launch would corrupt arguments and re-open the
     * `%VAR%` / quote-injection holes the escaping closes (BatBadBut,
     * CVE-2024-24576).
     */
    windowsVerbatimArguments?: boolean;
}
/** Inputs used to resolve platform-specific stdio spawn behavior. */
export interface ResolveStdioSpawnOptions {
    cwd: string;
    env: Record<string, string | undefined>;
    hostHasInheritableConsole?: boolean;
    platform?: NodeJS.Platform;
}
/**
 * Resolve the subprocess argv used to launch an MCP stdio server.
 *
 * On Windows, our PATH/PATHEXT walk may return `null` for a bare command
 * (e.g. `npx`) — `Bun.env.PATH` empty under a restricted parent process,
 * UNC/network mounts that reject `fs.access`, locked-down shells. The
 * legacy fallback handed `Bun.spawn` the bare name, but `CreateProcess`
 * only appends `.exe` for extensionless names — `.cmd`/`.bat` are never
 * tried, so `npx` (which exists only as `npx.cmd` on Windows) crashes the
 * subprocess immediately. When the resolver can't pin the command down,
 * route through `cmd.exe` so Windows's own PATHEXT lookup runs.
 */
export declare function resolveStdioSpawnCommand(config: MCPStdioServerConfig, options: ResolveStdioSpawnOptions): Promise<StdioSpawnCommand>;
/** Minimal write surface of `Subprocess.stdin` we need for framed sends. */
interface FrameSink {
    write(chunk: string): unknown;
    flush(): unknown;
}
/**
 * Write a newline-delimited JSON-RPC frame to the subprocess's stdin sink,
 * swallowing both synchronous throws and asynchronous rejections so the caller
 * can decide how to react.
 *
 * Bun's `FileSink.write()`/`flush()` can fail two ways once the read end of the
 * pipe has been closed by a subprocess that exited between read-loop ticks:
 *   - a synchronous throw (most reliably observed on Windows), and
 *   - a *rejected Promise* returned from `write()`/`flush()`, i.e. the EPIPE is
 *     surfaced asynchronously (note the `processTicksAndRejections` frame in the
 *     stack traces on #1710 and the follow-up report).
 *
 * A sibling `async` method's `try/catch` only catches the synchronous case; an
 * un-awaited rejected Promise escapes as a fatal unhandled rejection. So we both
 * catch the throw and neutralize any returned promise's rejection.
 *
 * Returns `true` when the frame was accepted synchronously, `false` when the
 * sink threw — callers signal transport closure on `false`. An asynchronous
 * failure cannot be reflected in the return value; it is neutralized here and
 * the dead transport is detected by the read loop / request timeout instead.
 */
export declare function writeFrame(stdin: FrameSink, frame: string): boolean;
/**
 * The subset of `Subprocess` that termination needs. Decoupled from the
 * `Subprocess<In, Out, Err>` stdio generics — `#process`'s pipes are
 * irrelevant to signaling — so tests can exercise it against a plain
 * `Bun.spawn(cmd, { stdio: "ignore" })` child without fighting the generics.
 */
interface KillableSubprocess {
    readonly pid: number;
    readonly exited: Promise<number>;
    kill(signal?: number | NodeJS.Signals): void;
}
/**
 * Terminate an MCP stdio subprocess: SIGTERM (process-group when `detached`
 * on POSIX, direct child otherwise), wait up to `termGraceMs` for a
 * cooperative exit, then escalate to SIGKILL — waiting up to `KILL_GRACE_MS`
 * more only when the leader itself hadn't already exited. A detached
 * leader's cooperative exit does not prove the whole process group is gone
 * (a grandchild can outlive it and ignore SIGTERM), so detached transports
 * always fire the group SIGKILL sweep, even after a clean SIGTERM exit.
 * Every step is a no-op-safe signal against an already-exited target, so
 * repeat calls (idempotent `close()`) never throw.
 *
 * Exported so tests can exercise group-signal escalation with an explicit
 * `detached`/`platform` pair: `StdioTransport.connect()` derives `detached`
 * from `resolveStdioSpawnCommand()`, which is tied to the host's real
 * `process.platform`, so a POSIX detached session cannot be reproduced
 * end-to-end through `connect()` on a non-Linux dev/CI host. `termGraceMs`
 * preserves the production grace by default while allowing those real
 * subprocess tests to cover the same transition without sleeping for a
 * production-length shutdown window.
 */
export declare function terminateStdioProcess(proc: KillableSubprocess, detached: boolean, platform?: NodeJS.Platform, termGraceMs?: number): Promise<void>;
/**
 * Stdio transport for MCP servers.
 * Spawns a subprocess and communicates via stdin/stdout.
 */
export declare class StdioTransport implements MCPTransport {
    #private;
    private config;
    onClose?: () => void;
    onError?: (error: Error) => void;
    onNotification?: (method: string, params: unknown) => void;
    onRequest?: (method: string, params: unknown) => Promise<unknown>;
    constructor(config: MCPStdioServerConfig);
    get connected(): boolean;
    /**
     * Start the subprocess and begin reading.
     */
    connect(): Promise<void>;
    request<T = unknown>(method: string, params?: Record<string, unknown>, options?: MCPRequestOptions): Promise<T>;
    notify(method: string, params?: Record<string, unknown>): Promise<void>;
    close(): Promise<void>;
}
/**
 * Create and connect a stdio transport.
 */
export declare function createStdioTransport(config: MCPStdioServerConfig): Promise<StdioTransport>;
export {};
