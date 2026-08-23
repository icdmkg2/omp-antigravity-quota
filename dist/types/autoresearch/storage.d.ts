import type { ASIData, ExperimentStatus, MetricDirection, NumericMetricMap } from "./types.js";
export interface SessionRow {
    id: number;
    name: string;
    goal: string | null;
    primaryMetric: string;
    metricUnit: string;
    direction: MetricDirection;
    preferredCommand: string | null;
    branch: string | null;
    baselineCommit: string | null;
    currentSegment: number;
    maxIterations: number | null;
    scopePaths: string[];
    offLimits: string[];
    constraints: string[];
    secondaryMetrics: string[];
    notes: string;
    createdAt: number;
    closedAt: number | null;
}
export interface RunRow {
    id: number;
    sessionId: number;
    segment: number;
    command: string;
    startedAt: number;
    completedAt: number | null;
    durationMs: number | null;
    exitCode: number | null;
    timedOut: boolean;
    parsedPrimary: number | null;
    parsedMetrics: NumericMetricMap | null;
    parsedAsi: ASIData | null;
    preRunDirtyPaths: string[];
    logPath: string;
    status: ExperimentStatus | null;
    description: string | null;
    metric: number | null;
    metrics: NumericMetricMap | null;
    asi: ASIData | null;
    commitHash: string | null;
    confidence: number | null;
    modifiedPaths: string[] | null;
    scopeDeviations: string[] | null;
    justification: string | null;
    flagged: boolean;
    flaggedReason: string | null;
    loggedAt: number | null;
    abandonedAt: number | null;
}
export interface OpenSessionParams {
    name: string;
    goal: string | null;
    primaryMetric: string;
    metricUnit: string;
    direction: MetricDirection;
    preferredCommand: string | null;
    branch: string | null;
    baselineCommit: string | null;
    maxIterations: number | null;
    scopePaths: string[];
    offLimits: string[];
    constraints: string[];
    secondaryMetrics: string[];
}
export interface UpdateSessionParams {
    goal?: string | null;
    preferredCommand?: string | null;
    maxIterations?: number | null;
    scopePaths?: string[];
    offLimits?: string[];
    constraints?: string[];
    secondaryMetrics?: string[];
    primaryMetric?: string;
    metricUnit?: string;
    direction?: MetricDirection;
    branch?: string | null;
    baselineCommit?: string | null;
    notes?: string;
}
export interface InsertRunParams {
    sessionId: number;
    segment: number;
    command: string;
    logPath: string;
    preRunDirtyPaths: string[];
    startedAt: number;
}
export interface MarkRunCompletedParams {
    runId: number;
    completedAt: number;
    durationMs: number;
    exitCode: number | null;
    timedOut: boolean;
    parsedPrimary: number | null;
    parsedMetrics: NumericMetricMap | null;
    parsedAsi: ASIData | null;
}
export interface MarkRunLoggedParams {
    runId: number;
    status: ExperimentStatus;
    description: string;
    metric: number;
    metrics: NumericMetricMap;
    asi: ASIData | null;
    commitHash: string | null;
    confidence: number | null;
    modifiedPaths: string[];
    scopeDeviations: string[];
    justification: string | null;
    loggedAt: number;
}
export declare class AutoresearchStorage {
    #private;
    constructor(dbPath: string, projectDir: string);
    get dbPath(): string;
    get projectDir(): string;
    close(): void;
    getActiveSession(): SessionRow | null;
    getActiveSessionForBranch(branch: string | null): SessionRow | null;
    getSessionById(sessionId: number): SessionRow | null;
    openSession(params: OpenSessionParams): SessionRow;
    updateSession(sessionId: number, updates: UpdateSessionParams): SessionRow;
    bumpSegment(sessionId: number): SessionRow;
    closeSession(sessionId: number): void;
    insertRun(params: InsertRunParams): RunRow;
    updateRunLogPath(runId: number, logPath: string): RunRow;
    updateRunConfidence(runId: number, confidence: number | null): RunRow;
    markRunCompleted(params: MarkRunCompletedParams): RunRow;
    markRunLogged(params: MarkRunLoggedParams): RunRow;
    flagRun(runId: number, reason: string): RunRow;
    abandonPendingRuns(sessionId: number): number;
    getPendingRun(sessionId: number): RunRow | null;
    getRunById(runId: number): RunRow | null;
    getRunByIdRequired(runId: number): RunRow;
    listRuns(sessionId: number): RunRow[];
    listLoggedRuns(sessionId: number): RunRow[];
}
export declare function openAutoresearchStorage(cwd: string): Promise<AutoresearchStorage>;
export declare function openAutoresearchStorageIfExists(cwd: string): Promise<AutoresearchStorage | null>;
export declare function closeAllAutoresearchStorages(): void;
