import type { DapAttachSessionOptions, DapBreakpointRecord, DapCapabilities, DapContinueOutcome, DapDataBreakpointInfoResponse, DapDataBreakpointRecord, DapDisassembledInstruction, DapEvaluateArguments, DapEvaluateResponse, DapFunctionBreakpointRecord, DapInstructionBreakpointRecord, DapLaunchSessionOptions, DapModule, DapSessionSummary, DapSource, DapStackFrame, DapThread } from "./types.js";
export interface DapOutputSnapshot {
    snapshot: DapSessionSummary;
    output: string;
}
export declare class DapSessionManager {
    #private;
    constructor();
    getActiveSession(): DapSessionSummary | null;
    listSessions(): DapSessionSummary[];
    getCapabilities(): DapCapabilities | null;
    launch(options: DapLaunchSessionOptions, signal?: AbortSignal, timeoutMs?: number): Promise<DapSessionSummary>;
    attach(options: DapAttachSessionOptions, signal?: AbortSignal, timeoutMs?: number): Promise<DapSessionSummary>;
    setBreakpoint(file: string, line: number, condition?: string, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        breakpoints: DapBreakpointRecord[];
        sourcePath: string;
    }>;
    removeBreakpoint(file: string, line: number, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        breakpoints: DapBreakpointRecord[];
        sourcePath: string;
    }>;
    setFunctionBreakpoint(name: string, condition?: string, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        breakpoints: DapFunctionBreakpointRecord[];
    }>;
    removeFunctionBreakpoint(name: string, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        breakpoints: DapFunctionBreakpointRecord[];
    }>;
    setInstructionBreakpoint(instructionReference: string, offset?: number, condition?: string, hitCondition?: string, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        breakpoints: DapInstructionBreakpointRecord[];
    }>;
    removeInstructionBreakpoint(instructionReference: string, offset?: number, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        breakpoints: DapInstructionBreakpointRecord[];
    }>;
    dataBreakpointInfo(name: string, variablesReference?: number, frameId?: number, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        info: DapDataBreakpointInfoResponse;
    }>;
    setDataBreakpoint(dataId: string, accessType?: "read" | "write" | "readWrite", condition?: string, hitCondition?: string, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        breakpoints: DapDataBreakpointRecord[];
    }>;
    removeDataBreakpoint(dataId: string, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        breakpoints: DapDataBreakpointRecord[];
    }>;
    disassemble(memoryReference: string, instructionCount: number, offset?: number, instructionOffset?: number, resolveSymbols?: boolean, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        instructions: DapDisassembledInstruction[];
    }>;
    readMemory(memoryReference: string, count: number, offset?: number, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        address: string;
        data?: string;
        unreadableBytes?: number;
    }>;
    writeMemory(memoryReference: string, data: string, offset?: number, allowPartial?: boolean, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        offset?: number;
        bytesWritten?: number;
    }>;
    modules(startModule?: number, moduleCount?: number, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        modules: DapModule[];
    }>;
    loadedSources(signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        sources: DapSource[];
    }>;
    customRequest(command: string, args?: Record<string, unknown>, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        body: unknown;
    }>;
    continue(signal?: AbortSignal, timeoutMs?: number): Promise<DapContinueOutcome>;
    pause(signal?: AbortSignal, timeoutMs?: number): Promise<DapSessionSummary>;
    stepIn(signal?: AbortSignal, timeoutMs?: number): Promise<DapContinueOutcome>;
    stepOut(signal?: AbortSignal, timeoutMs?: number): Promise<DapContinueOutcome>;
    stepOver(signal?: AbortSignal, timeoutMs?: number): Promise<DapContinueOutcome>;
    threads(signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        threads: DapThread[];
    }>;
    stackTrace(frameCount: number | undefined, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        stackFrames: DapStackFrame[];
        totalFrames?: number;
    }>;
    scopes(frameId: number | undefined, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        scopes: import("./types.js").DapScope[];
    }>;
    variables(variableReference: number, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        variables: import("./types.js").DapVariable[];
    }>;
    evaluate(expression: string, context: DapEvaluateArguments["context"], frameId: number | undefined, signal?: AbortSignal, timeoutMs?: number): Promise<{
        snapshot: DapSessionSummary;
        evaluation: DapEvaluateResponse;
    }>;
    getOutput(limitBytes?: number): DapOutputSnapshot;
    terminate(signal?: AbortSignal, timeoutMs?: number): Promise<DapSessionSummary | null>;
}
export declare const dapSessionManager: DapSessionManager;
