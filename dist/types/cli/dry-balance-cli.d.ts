import type { Api, AssistantMessageEventStream, AuthCredentialSnapshotEntry, Context, Model, OAuthAccess, OAuthAccessResolution, SimpleStreamOptions } from "@oh-my-pi/pi-ai";
import { Settings } from "../config/settings.js";
export interface DryBalanceCommandArgs {
    model?: string;
    flags: {
        model?: string;
        count?: number;
        concurrency?: number;
        json?: boolean;
        bench?: boolean;
    };
}
export interface DryBalanceAuthOptions {
    baseUrl?: string;
    modelId?: string;
    signal?: AbortSignal;
}
export interface DryBalanceAuthStorage {
    getOAuthAccess(provider: string, sessionId?: string, options?: DryBalanceAuthOptions): Promise<OAuthAccess | undefined>;
    getOAuthAccesses?(provider: string, options?: DryBalanceAuthOptions): Promise<OAuthAccessResolution[]>;
    /**
     * Force-refresh a single credential by id (step (b) of the auth-retry
     * policy). The bench re-mints the failing account's token in place on a
     * 401 rather than rotating accounts — it is measuring each account.
     */
    forceRefreshCredentialById?(id: number, signal?: AbortSignal): Promise<AuthCredentialSnapshotEntry>;
}
export interface DryBalanceModelRegistry {
    authStorage: DryBalanceAuthStorage;
    getAll(): Model<Api>[];
    getAvailable(): Model<Api>[];
    getApiKey(model: Model<Api>, sessionId?: string): Promise<string | undefined>;
}
export interface DryBalanceRuntime {
    modelRegistry: DryBalanceModelRegistry;
    settings?: Settings;
    close?: () => void;
}
export interface DryBalanceAccountStat {
    account: string;
    count: number;
    percent: number;
}
export interface DryBalanceFailureStat {
    reason: string;
    count: number;
    percent: number;
}
export interface DryBalanceBenchSuccessResult {
    ok: true;
    account: string;
    ttftMs: number;
    durationMs: number;
    outputTokens: number;
    tokensPerSecond: number;
}
export interface DryBalanceBenchFailureResult {
    ok: false;
    account?: string;
    error: string;
}
export type DryBalanceBenchResult = DryBalanceBenchSuccessResult | DryBalanceBenchFailureResult;
export interface DryBalanceBenchSummary {
    total: number;
    success: {
        total: number;
        averageTtftMs: number | null;
        averageTokensPerSecond: number | null;
    };
    failure: {
        total: number;
        reasons: DryBalanceFailureStat[];
    };
    results: DryBalanceBenchResult[];
}
export interface DryBalanceSummary {
    model: string;
    provider: string;
    samples: number;
    concurrency: number;
    success: {
        total: number;
        accounts: DryBalanceAccountStat[];
    };
    failure: {
        total: number;
        reasons: DryBalanceFailureStat[];
    };
    bench?: DryBalanceBenchSummary;
}
type DryBalanceStreamSimple = (model: Model<Api>, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStream;
export interface DryBalanceDependencies {
    createRuntime?: () => Promise<DryBalanceRuntime>;
    randomSessionId?: () => string;
    writeStdout?: (text: string) => void;
    writeStderr?: (text: string) => void;
    setExitCode?: (code: number) => void;
    streamSimple?: DryBalanceStreamSimple;
    now?: () => number;
    stdoutIsTTY?: boolean;
    stderrIsTTY?: boolean;
    stdoutColumns?: number;
    stderrColumns?: number;
}
interface DryBalanceBenchProgressSink {
    markRunning(index: number, account: string): void;
    complete(index: number, result: DryBalanceBenchResult): void;
    close(): void;
}
export declare function createBenchProgressSink(total: number, write: (text: string) => void, interactive: boolean, columns: number): DryBalanceBenchProgressSink;
export declare function formatDryBalanceText(summary: DryBalanceSummary): string;
export declare function runDryBalanceCommand(command: DryBalanceCommandArgs, deps?: DryBalanceDependencies): Promise<DryBalanceSummary>;
export {};
