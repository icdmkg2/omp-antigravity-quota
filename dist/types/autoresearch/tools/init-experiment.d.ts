import type { ToolDefinition } from "../../extensibility/extensions/index.js";
import type { AutoresearchToolFactoryOptions, ExperimentState } from "../types.js";
export declare const HARNESS_FILENAME = "autoresearch.sh";
export declare const DEFAULT_HARNESS_COMMAND = "bash autoresearch.sh";
declare const initExperimentSchema: import("@oh-my-pi/omptype").FluentType<{
    constraints?: string[] | undefined;
    direction?: "higher" | "lower" | undefined;
    goal?: string | undefined;
    max_iterations?: number | undefined;
    metric_unit?: string | undefined;
    name: string;
    new_segment?: boolean | undefined;
    off_limits?: string[] | undefined;
    primary_metric: string;
    scope_paths?: string[] | undefined;
    secondary_metrics?: string[] | undefined;
}, {
    constraints?: string[] | undefined;
    direction?: "higher" | "lower" | undefined;
    goal?: string | undefined;
    max_iterations?: number | undefined;
    metric_unit?: string | undefined;
    name: string;
    new_segment?: boolean | undefined;
    off_limits?: string[] | undefined;
    primary_metric: string;
    scope_paths?: string[] | undefined;
    secondary_metrics?: string[] | undefined;
}>;
interface InitExperimentDetails {
    state: ExperimentState;
    createdSession: boolean;
    bumpedSegment: boolean;
    abandonedRuns: number;
    harnessCommitted: boolean;
    baselineCommit: string | null;
}
export declare function createInitExperimentTool(options: AutoresearchToolFactoryOptions): ToolDefinition<typeof initExperimentSchema, InitExperimentDetails>;
export {};
