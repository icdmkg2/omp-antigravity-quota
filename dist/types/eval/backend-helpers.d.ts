/**
 * Helpers shared by the per-language eval backend definitions (jl/js/py/rb
 * index modules): session-id namespacing, settings access, and projection of
 * executor results into the ExecutorBackend result shape.
 */
import type { ToolSession } from "../tools/index.js";
import type { ExecutorBackendResult } from "./backend.js";
import type { EvalDisplayOutput } from "./types.js";
export declare function namespaceSessionId(sessionId: string, prefix: string): string;
export declare function readSetting<T>(session: ToolSession, key: string): T | undefined;
export declare function readInterpreterSetting(session: ToolSession, key: string): string | undefined;
export declare function toExecutorBackendResult(result: {
    output: string;
    exitCode: number | undefined;
    cancelled: boolean;
    truncated: boolean;
    artifactId?: string | undefined;
    totalLines: number;
    totalBytes: number;
    outputLines: number;
    outputBytes: number;
    displayOutputs: EvalDisplayOutput[];
}): ExecutorBackendResult;
