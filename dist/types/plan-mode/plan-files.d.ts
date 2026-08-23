import { type LocalProtocolOptions } from "../internal-urls/index.js";
/** Reads a plan from a local URL or cwd-relative filesystem path. */
export declare function readPlanFile(planFilePath: string, options: {
    localProtocolOptions: LocalProtocolOptions;
    cwd: string;
}): Promise<string | null>;
/** Lists session-local plan files from newest to oldest. */
export declare function listPlanFiles(options: {
    localProtocolOptions: LocalProtocolOptions;
}): Promise<string[]>;
