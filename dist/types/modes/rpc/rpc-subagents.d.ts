import { type SubagentEventPayload, type SubagentLifecyclePayload, type SubagentProgressPayload } from "../../task/index.js";
import type { EventBus } from "../../utils/event-bus.js";
import type { RpcSubagentFrame, RpcSubagentMessagesResult, RpcSubagentSnapshot, RpcSubagentSubscriptionLevel } from "./rpc-types.js";
export interface RpcSubagentTranscriptSelector {
    subagentId?: string;
    sessionFile?: string;
    fromByte?: number;
}
type RpcSubagentOutput = (frame: RpcSubagentFrame) => void;
export declare function readRpcSubagentTranscript(sessionFile: string, fromByte?: number): Promise<RpcSubagentMessagesResult>;
export declare class RpcSubagentRegistry {
    #private;
    constructor(eventBus: EventBus, output: RpcSubagentOutput);
    dispose(): void;
    clear(): void;
    setSubscriptionLevel(level: RpcSubagentSubscriptionLevel): void;
    getSubscriptionLevel(): RpcSubagentSubscriptionLevel;
    getSubagents(): RpcSubagentSnapshot[];
    handleLifecycle(payload: SubagentLifecyclePayload): void;
    handleProgress(payload: SubagentProgressPayload): void;
    handleEvent(payload: SubagentEventPayload): void;
    resolveSessionFile(selector: RpcSubagentTranscriptSelector): string;
}
export {};
