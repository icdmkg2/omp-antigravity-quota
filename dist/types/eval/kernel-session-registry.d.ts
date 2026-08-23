import { type CancelledErrorClass, type SessionOwners } from "./executor-base.js";
interface KernelSessionRegistryOptions {
    sessionId?: string;
    kernelOwnerId?: string;
    interpreter?: string;
    reset?: boolean;
    signal?: AbortSignal;
    deadlineMs?: number;
    bridge?: unknown;
    bridgeSessionId?: string;
}
interface RegistryKernelShutdownResult {
    confirmed?: boolean;
}
interface RegistryKernel {
    isAlive(): boolean;
    shutdown(options?: {
        timeoutMs: number;
    }): Promise<RegistryKernelShutdownResult>;
}
export interface KernelSession<TKernel extends RegistryKernel> extends SessionOwners {
    sessionKey: string;
    sessionId: string;
    cwd: string;
    kernel: TKernel;
}
export interface KernelSessionRegistryContext<TKernel extends RegistryKernel, TOptions extends KernelSessionRegistryOptions, TSession extends KernelSession<TKernel>> {
    sessions: Map<string, TSession>;
    startKernel: (cwd: string, options: TOptions) => Promise<TKernel>;
    replaceSessionKernel: (session: TSession, cwd: string, options: TOptions) => Promise<TKernel>;
}
interface KernelSessionRegistryDescriptor<TKernel extends RegistryKernel, TOptions extends KernelSessionRegistryOptions, TResult, TSession extends KernelSession<TKernel>> {
    languageLabel: string;
    cancelledErrorClass: CancelledErrorClass;
    buildSessionKey: (sessionId: string, cwd: string, interpreter: string | undefined) => string;
    createSession: (session: KernelSession<TKernel>) => TSession;
    startKernel: (cwd: string, options: TOptions) => Promise<TKernel>;
    executeWithKernel: (kernel: TKernel, code: string, options: TOptions) => Promise<TResult>;
    waitForStartup?: (promise: Promise<TSession>, options: TOptions) => Promise<TSession>;
    replaceSessionKernel?: (session: TSession, cwd: string, options: TOptions, context: KernelSessionRegistryContext<TKernel, TOptions, TSession>) => Promise<TKernel>;
    acquireLiveSessionKernel?: (session: TSession, cwd: string, options: TOptions, context: KernelSessionRegistryContext<TKernel, TOptions, TSession>) => Promise<TKernel>;
    invalidateSession?: (session: TSession) => void;
    shutdownSession?: (session: TSession, resetting: boolean) => Promise<RegistryKernelShutdownResult>;
    clearResetsOnDisposeAll?: boolean;
    logBeforeReplacement?: boolean;
    isCancellation?: (error: unknown) => boolean;
    isTimedOutCancellation?: (error: unknown, signal?: AbortSignal) => boolean;
    validateKernel?: (session: TSession, kernel: TKernel) => boolean;
}
interface KernelSessionRegistry<TOptions extends KernelSessionRegistryOptions, TResult> {
    disposeAll(): Promise<void>;
    disposeByOwner(ownerId: string): Promise<void>;
    executeOnSession(code: string, cwd: string, options: TOptions): Promise<TResult>;
}
export declare function normalizeKernelSessionCwd(cwd: string): string;
export declare function requireRemainingKernelTimeoutMs(deadlineMs: number | undefined, cancelledErrorClass: CancelledErrorClass): number | undefined;
export declare function formatSessionTimeoutAnnotation(timeoutMs?: number): string;
export declare function formatSessionKernelTimeoutAnnotation(timeoutMs: number | undefined, kernelKilled: boolean): string;
export declare function createKernelSessionRegistry<TKernel extends RegistryKernel, TOptions extends KernelSessionRegistryOptions, TResult, TSession extends KernelSession<TKernel>>(descriptor: KernelSessionRegistryDescriptor<TKernel, TOptions, TResult, TSession>): KernelSessionRegistry<TOptions, TResult>;
export {};
