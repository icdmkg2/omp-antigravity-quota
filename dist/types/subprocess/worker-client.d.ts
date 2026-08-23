import type { Subprocess } from "bun";
/**
 * Shared lifecycle scaffolding for the ONNX inference subprocess clients
 * (mnemopi embeddings, speech-to-text, tiny-model titles/completions, TTS).
 * Each runs `onnxruntime-node` inside a dedicated Bun child process so the NAPI
 * constructor/finalizer never executes in the main agent address space — those
 * destructors segfault Bun on shutdown (issues #1606 / #1607 / #3031).
 *
 * Only the genuinely identical pieces live here: the worker-handle shape, the
 * spawn-command resolution, the parent-env snapshot, the `Bun.spawn` wiring,
 * the inline "worker unavailable" stub, and the ping/pong smoke probe. Each
 * client keeps its own divergent request/response correlation, streaming, and
 * teardown semantics.
 */
/** Minimal inbound contract shared by every worker: a correlated `ping`. */
export type WorkerInboundBase = {
    type: "ping";
    id: string;
};
/** Structured log line forwarded from a worker to the parent logger. */
export type WorkerLogMessage = {
    type: "log";
    level: "debug" | "warn" | "error";
    msg: string;
    meta?: Record<string, unknown>;
};
/** Minimal outbound contract shared by every worker: `pong`, `error`, `log`. */
export type WorkerOutboundBase = {
    type: "pong";
    id: string;
} | {
    type: "error";
    id: string;
    error: string;
} | WorkerLogMessage;
/**
 * Parent-side view of a worker subprocess: send typed inbound messages,
 * subscribe to outbound messages and worker errors, and hard-terminate.
 */
export interface WorkerHandle<Inbound, Outbound> {
    send(message: Inbound): void;
    onMessage(handler: (message: Outbound) => void): () => void;
    onError(handler: (error: Error) => void): () => void;
    terminate(): Promise<void>;
}
/**
 * A {@link WorkerHandle} that can also be (un)referenced so a pending request
 * keeps the parent event loop alive while an idle worker never blocks exit.
 */
export interface RefCountedWorkerHandle<Inbound, Outbound> extends WorkerHandle<Inbound, Outbound> {
    /** Re-reference the subprocess so a pending request keeps the parent event loop alive. */
    ref(): void;
    /** Drop the reference once the worker is idle so it never blocks process exit. */
    unref(): void;
}
/** The raw spawned subprocess plus the parent-side fan-out sets. */
export interface SpawnedSubprocess<Outbound> {
    proc: Subprocess<"ignore", "ignore", number | "ignore">;
    inbound: Set<(message: Outbound) => void>;
    errors: Set<(error: Error) => void>;
    /**
     * Flipped to `true` right before the deliberate SIGKILL so `onExit` can
     * distinguish the expected hard-kill from a crash (SIGSEGV from a native
     * fault, OOM SIGKILL, operator `kill -9`). Only the latter surfaces as a
     * worker error so callers don't await forever.
     */
    intentionalExit: {
        value: boolean;
    };
    /**
     * Resolves when the file-backed stderr capture has drained after worker
     * exit. `onExit` waits on this before surfacing the crash so the exit-error
     * carries the *whole* tail, not whatever happened to be flushed before the
     * exit event fired. Tests can await it deterministically instead of racing
     * wall-clock timers.
     */
    stderrDrained: Promise<void>;
}
export interface WorkerSpawnCommand {
    cmd: string[];
    cwd?: string;
}
/**
 * Cold-starting a worker from a compiled binary (decompress + module graph
 * load) is slow on contended CI runners; the probe only proves the worker
 * spawns and ponges, so a generous bound removes flakes without weakening it.
 */
export declare const SMOKE_TEST_TIMEOUT_MS = 30000;
/**
 * Resolve the command used to relaunch the agent CLI into worker mode. In a
 * compiled binary the entry point is the binary itself; otherwise re-enter the
 * declared worker-host entry by absolute path. Workers deliberately spawn
 * without a pinned cwd there: they share the parent's foreground process
 * group, and terminal cwd heuristics (kitty's new_tab_with_cwd) read the
 * newest process in that group, so anchoring them to the install dir leaks
 * into newly opened terminal tabs. With no declared host entry (bun test, SDK
 * embedding) fall back to a cwd-relative `src/cli.ts`, which Bun subprocess
 * IPC handles more reliably under `bun test`.
 */
export declare function resolveWorkerSpawnCmd(workerArg: string): WorkerSpawnCommand;
/**
 * Snapshot the parent environment for the child. `process.env` carries
 * `undefined` slots that `Bun.spawn` rejects, so filter them out; an optional
 * `overlay` (e.g. the tiny-model device/dtype vars) wins over inherited keys.
 */
export declare function workerEnvFromParent(overlay?: Record<string, string>): Record<string, string>;
/**
 * `LD_LIBRARY_PATH` overlay that lets a dlopen'd native addon find its C++
 * runtime. The ONNX addons installed on demand under `~/.omp/agent/cache/**`
 * are `process.dlopen`'d and need `libstdc++.so.6` / `libgcc_s.so.1`; because
 * each addon carries its own `DT_RUNPATH`, an RPATH on our executable cannot
 * satisfy them, so the path has to come from the environment. On distros where
 * those libraries are outside the loader's default search path (NixOS) the
 * packaged build exports `OMP_NATIVE_LIBRARY_PATH` (see `nix/package.nix`).
 * Appended last so an inherited `LD_LIBRARY_PATH` keeps precedence.
 * Pure for testability; see {@link inferenceWorkerEnv} for the spawn-time glue.
 */
export declare function nativeLibraryPathOverlay(env: Record<string, string | undefined>, platform: NodeJS.Platform): Record<string, string>;
/**
 * Env for an ONNX inference worker: the parent env plus the native library
 * path. Only these workers get it — the daemon broker spawns user PTY sessions
 * and eval kernels through {@link workerEnvFromParent}, and rewriting the
 * loader search path of arbitrary user commands risks a `GLIBCXX` mismatch.
 */
export declare function inferenceWorkerEnv(overlay?: Record<string, string>): Record<string, string>;
/**
 * Spawn an inference worker subprocess and wire its IPC fan-out. Stdio is
 * captured (stderr redirected to a temp file, stdout ignored) so native
 * runtimes can't corrupt the chat scrollback while the crash reason still
 * reaches the parent. The file-backed capture deliberately avoids Bun
 * `ReadableStream` pipes: even an unref'd child with a piped stderr stream can
 * keep the parent event loop alive. After the worker exits, the last
 * {@link STDERR_TAIL_LIMIT_BYTES} are appended to the `onExit` error so
 * `tts/mnemopi/…: worker error` lines carry the actual stack instead of a bare
 * exit code (issue #4324). The child is `unref`'d outside `bun test` so an idle
 * worker never blocks process exit. `exitLabel` prefixes the worker-error
 * message surfaced for an unexpected (non-intentional) exit.
 */
export declare function createWorkerSubprocess<Outbound>(options: {
    spawnCommand: WorkerSpawnCommand;
    env: Record<string, string>;
    exitLabel: string;
    /** Start the child as a new process-group/session leader where Bun supports it. */
    detached?: boolean;
    /** Treat exit code 0 as unexpected; eval cells can call process.exit(0). */
    reportCleanExit?: boolean;
    /** Whether an idle worker should stop keeping the parent event loop alive. */
    unref?: boolean;
}): SpawnedSubprocess<Outbound>;
/**
 * Wrap a {@link SpawnedSubprocess} as a {@link WorkerHandle}. The `send`
 * strategy is injected so each client keeps its exact IPC-send behaviour (e.g.
 * `safeSend` vs an inline guarded `proc.send`). `terminate()` SIGKILLs: the
 * point of subprocess isolation is that the parent never runs
 * `onnxruntime-node`'s NAPI finalizer (it crashes Bun on Windows), so the OS
 * reclaims the model memory instead. The intentional-exit flag is flipped
 * *before* the kill so `onExit` can tell it apart from a native crash.
 */
export declare function createWorkerHandle<Inbound, Outbound>(spawned: SpawnedSubprocess<Outbound>, send: (message: Inbound) => void): WorkerHandle<Inbound, Outbound>;
/**
 * A stand-in handle used when the worker subprocess cannot be spawned. It
 * ponges `ping` (so the smoke probe and readiness checks still resolve) and
 * answers every other request with the spawn error so callers fail fast
 * instead of awaiting forever.
 */
export declare function createUnavailableWorker<Inbound extends {
    type: string;
    id: string;
}, Outbound extends {
    type: string;
}>(error: unknown): WorkerHandle<Inbound, Outbound>;
/**
 * Spawn a worker handle, falling back to {@link createUnavailableWorker} (after
 * a warning) when the subprocess cannot be created so the feature degrades
 * gracefully instead of throwing into callers.
 */
export declare function spawnWorkerOrUnavailable<Handle>(spawn: () => Handle, unavailable: (error: unknown) => Handle, warnMessage: string): Handle;
/** Forward a worker's structured `log` message to the matching logger level. */
export declare function logWorkerMessage(message: WorkerLogMessage): void;
/**
 * Drive the ping/pong readiness probe wired into `omp --smoke-test`: send one
 * `ping`, resolve on the first `pong` (ignoring `log` chatter), and reject on
 * any other message, a worker error, or the timeout. Always tears the handle
 * down on the way out. `label` prefixes the failure messages.
 */
export declare function smokeTestWorker<Inbound extends {
    type: string;
    id: string;
}, Outbound extends {
    type: string;
}>(handle: WorkerHandle<Inbound, Outbound>, label: string, timeoutMs: number): Promise<void>;
