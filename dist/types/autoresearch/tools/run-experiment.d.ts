import type { ToolDefinition } from "../../extensibility/extensions/index.js";
import type { AutoresearchToolFactoryOptions, RunDetails, RunExperimentProgressDetails } from "../types.js";
declare const runExperimentSchema: import("@oh-my-pi/omptype").FluentType<{
    timeout_seconds?: number | undefined;
}, {
    timeout_seconds?: number | undefined;
}>;
export declare function createRunExperimentTool(options: AutoresearchToolFactoryOptions): ToolDefinition<typeof runExperimentSchema, RunDetails | RunExperimentProgressDetails>;
export {};
