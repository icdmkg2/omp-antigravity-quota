import type { ToolSession } from "./index.js";
export interface EvalBackendsAllowance {
    python: boolean;
    js: boolean;
    ruby: boolean;
    julia: boolean;
}
/** Read per-backend allowance from settings (py/js default on; rb/jl opt-in, default off). */
export declare function readEvalBackendsAllowance(session: ToolSession): EvalBackendsAllowance;
/**
 * Materialize the active eval backend allowance: PI_PY / PI_JS / PI_RB / PI_JL
 * env flags override the per-key settings; otherwise settings win (py/js default
 * on, rb/jl default off).
 */
export declare function resolveEvalBackends(session: ToolSession): EvalBackendsAllowance;
