import { type DaemonBrokerClient } from "../launch/client.js";
import { type DaemonSnapshot, type DaemonSpec, type DaemonState } from "../launch/protocol.js";
/** One broker scope: a project runtime dir or a machine-global service dir. */
export interface PsScope {
    kind: "project" | "global";
    runtimeDir: string;
    /** Canonical project dir when known; used to connect and displayed as the scope label. */
    projectDir?: string;
    /** Global service name (`kind === "global"`). */
    service?: string;
    /** Live broker PID; undefined when no broker owns the scope. */
    brokerPid?: number;
}
export interface PsDaemonRow {
    snapshot: DaemonSnapshot;
    /** Launch command from the persisted spec, when readable. */
    command?: string;
    cwd?: string;
    /** False when the snapshot came from disk with no live broker supervising it. */
    supervised: boolean;
}
export interface PsScopeReport {
    scope: PsScope;
    daemons: PsDaemonRow[];
}
/** Scope selector shared by every ps action: current project, `--dir`, or `--global`. */
export interface PsTarget {
    dir?: string;
    global?: string;
}
/** Hard SIGTERM->SIGKILL grace used by `kill`; effectively immediate. */
export declare const KILL_GRACE_MS = 100;
export declare const TERMINAL_STATES: Partial<Record<DaemonState, true>>;
/** The single scope named by `target` (defaults to the current project). */
export declare function targetScope(target: PsTarget): Promise<PsScope>;
/** Every scope on this machine: hash-keyed project scopes plus global service scopes. */
export declare function discoverScopes(): Promise<PsScope[]>;
/**
 * Connect to a scope's broker. Undefined when the scope cannot be addressed
 * (Windows pipe names derive from the project dir, which may be unknown for
 * discovered scopes). The caller owns the returned client and must close it.
 */
export declare function scopeClient(scope: PsScope): Promise<DaemonBrokerClient | undefined>;
/**
 * Collect daemons for one scope. Live brokers are authoritative; dead scopes
 * fall back to persisted snapshots, downgrading non-detached "running" records
 * to exited (their broker took them down with it) and flagging detached
 * survivors as unsupervised.
 */
export declare function collectScope(scope: PsScope): Promise<PsScopeReport>;
/** Collect the scopes selected by `all`/`target`, hiding empty dead scopes in the all view. */
export declare function collectReports(all: boolean, target: PsTarget): Promise<PsScopeReport[]>;
export declare function formatCommand(spec: DaemonSpec | undefined): string | undefined;
/** Collapse a launch command to one display line (inline scripts embed newlines/tabs). */
export declare function collapseCommand(command: string | undefined): string;
/** One-line daemon summary used by action results and detail views. */
export declare function daemonLabel(daemon: DaemonSnapshot): string;
/** Colored STATE cell, e.g. `ready`, `exited(143)`. */
export declare function stateCell(row: PsDaemonRow): string;
export declare function flagsCell(row: PsDaemonRow): string;
export declare function uptimeCell(snapshot: DaemonSnapshot): string;
export declare const TABLE_HEADER: string[];
/** Raw (possibly colored) cells for one daemon row, aligned with {@link TABLE_HEADER}. */
export declare function tableCells(row: PsDaemonRow): string[];
/** Scope heading, e.g. `project /work/pi — broker pid 1234`. */
export declare function scopeHeader(scope: PsScope): string;
