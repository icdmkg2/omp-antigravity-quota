import type { ToolDefinition } from "../../extensibility/extensions/index.js";
import type { AutoresearchToolFactoryOptions, LogDetails } from "../types.js";
declare const logExperimentSchema: import("@oh-my-pi/omptype").FluentType<{
    asi?: Record<string, unknown> | undefined;
    commit?: string | undefined;
    description: string;
    flag_runs?: {
        reason: string;
        run_id: number;
    }[] | undefined;
    justification?: string | undefined;
    metric: number;
    metrics?: Record<string, number> | undefined;
    status: "checks_failed" | "crash" | "discard" | "keep";
}, {
    asi?: Record<string, unknown> | undefined;
    commit?: string | undefined;
    description: string;
    flag_runs?: {
        reason: string;
        run_id: number;
    }[] | undefined;
    justification?: string | undefined;
    metric: number;
    metrics?: Record<string, number> | undefined;
    status: "checks_failed" | "crash" | "discard" | "keep";
}>;
export declare function createLogExperimentTool(options: AutoresearchToolFactoryOptions): ToolDefinition<typeof logExperimentSchema, LogDetails>;
export {};
