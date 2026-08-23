import type { ToolSession } from "../../tools/index.js";
import { type ExecutorBackendExecOptions, type ExecutorBackendResult } from "../backend.js";
export declare function namespaceSessionId(sessionId: string): string;
declare const _default: {
    id: "js";
    label: string;
    highlightLang: string;
    isAvailable(_session: ToolSession): Promise<boolean>;
    execute(code: string, opts: ExecutorBackendExecOptions): Promise<ExecutorBackendResult>;
};
export default _default;
