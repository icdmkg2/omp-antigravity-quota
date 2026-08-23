import type { Agent } from "@oh-my-pi/pi-agent-core";
import type { Settings } from "../config/settings.js";
import { type BashResult } from "../exec/bash-executor.js";
import type { ExtensionRunner } from "../extensibility/extensions/index.js";
import type { SessionManager } from "./session-manager.js";
/** Destination that owns a bash result after a session or branch transition. */
export type BashAppendDestination = {
    kind: "current";
    manager: SessionManager;
} | {
    kind: "detached";
    manager: SessionManager;
} | {
    kind: "branch";
    manager: SessionManager;
    parentId: string | null;
};
/** Reference-counted session target captured when a bash execution starts. */
export interface BashSessionTarget {
    sessionId: string;
    refs: number;
    destination?: BashAppendDestination;
    pending?: Promise<BashAppendDestination>;
}
/** Ownership snapshot spanning a session or branch transition. */
export interface BashSessionTransition {
    oldTarget: BashSessionTarget;
    newTarget: BashSessionTarget;
    oldSessionId: string;
    oldSessionFile: string | undefined;
    oldLeafId: string | null;
    detachedManager: SessionManager | undefined;
    resolveOld: ((destination: BashAppendDestination) => void) | undefined;
    resolveNew: (destination: BashAppendDestination) => void;
}
/** Capabilities the bash runner borrows from its owning session. */
export interface BashRunnerHost {
    agent: Agent;
    sessionManager: SessionManager;
    settings: Settings;
    extensionRunner(): ExtensionRunner | undefined;
    isStreaming(): boolean;
}
/** Owns bash execution and preserves result ownership across transcript transitions. */
export declare class BashRunner {
    #private;
    constructor(host: BashRunnerHost);
    /** Executes a bash command while retaining the session and branch that owned its start. */
    executeBash(command: string, onChunk?: (chunk: string) => void, options?: {
        excludeFromContext?: boolean;
        useUserShell?: boolean;
    }): Promise<BashResult>;
    /** Records a bash result supplied outside executeBash in the current ownership scope. */
    recordBashResult(command: string, result: BashResult, options?: {
        excludeFromContext?: boolean;
    }): void;
    /** Cancels every running bash command. */
    abort(): void;
    /** Whether a bash command is currently running. */
    get isRunning(): boolean;
    /** Whether bash results are waiting for a safe persistence boundary. */
    get hasPendingMessages(): boolean;
    /** Flushes deferred bash results without changing their captured ownership. */
    flushPending(): Promise<void>;
    /** Runs a leaf rewrite while retaining in-flight bash on its originating branch. */
    withBranchTransition<T>(mutate: () => T): T;
    /** Snapshots the owner of in-flight bash before a session or branch transition. */
    beginSessionTransition(options?: {
        persistDetached?: boolean;
    }): BashSessionTransition;
    /** Adopts a transition's new target as the live bash owner. */
    markSessionTransition(transition: BashSessionTransition): void;
    /** Resolves destinations opened by beginSessionTransition. */
    finishSessionTransition(transition: BashSessionTransition, success: boolean): void;
}
