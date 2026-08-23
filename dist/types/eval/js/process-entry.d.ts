import { type RejectionInterceptor } from "./worker-core.js";
import type { WorkerInbound, WorkerOutbound } from "./worker-protocol.js";
/** Start the JavaScript evaluator inside a subprocess IPC transport. */
export declare function startJsEvalProcess(transport: {
    send(message: WorkerOutbound): void;
    onMessage(handler: (message: WorkerInbound) => void): () => void;
}, interceptUnhandledRejections: RejectionInterceptor): void;
