import type { ToolSession } from "../../tools/index.js";
import { type ExecutorBackendExecOptions, type ExecutorBackendResult } from "../backend.js";
export declare function namespaceSessionId(sessionId: string): string;
declare const _default: {
    id: "python";
    label: string;
    highlightLang: string;
    isAvailable(session: ToolSession): Promise<boolean>;
    execute(code: string, opts: ExecutorBackendExecOptions): Promise<ExecutorBackendResult>;
};
export default _default;
