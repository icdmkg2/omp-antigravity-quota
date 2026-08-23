import type { ToolSession } from "../../tools/index.js";
import { type EvalBudgetResult } from "../budget-bridge.js";
import { type EvalConcurrencyResult } from "../concurrency-bridge.js";
import type { JsStatusEvent } from "./shared/types.js";
export type { JsStatusEvent } from "./shared/types.js";
interface ToolBridgeOptions {
    session: ToolSession;
    signal?: AbortSignal;
    emitStatus?: (event: JsStatusEvent) => void;
}
type ToolValue = string | EvalBudgetResult | EvalConcurrencyResult | {
    text: string;
    details?: unknown;
    images?: Array<{
        mimeType: string;
        data: string;
    }>;
    hasError?: boolean;
};
export declare function callSessionTool(name: string, args: unknown, options: ToolBridgeOptions): Promise<ToolValue>;
