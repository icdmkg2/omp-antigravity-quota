import type { ToolSession } from "../tools/index.js";
export type EvalSessionSource = Pick<ToolSession, "cwd" | "getSessionFile">;
export declare function defaultEvalSessionId(session: EvalSessionSource): string;
