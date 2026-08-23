/**
 * Bash intent interceptor - redirects common shell patterns to proper tools.
 *
 * When an LLM calls bash with patterns like `grep`, `cat`, `find`, etc.,
 * this interceptor provides helpful error messages directing them to use
 * the specialized tools instead.
 */
import { type BashInterceptorRule } from "../config/settings-schema.js";
export interface InterceptionResult {
    /** If true, the bash command should be blocked */
    block: boolean;
    /** Error message to return instead of executing */
    message?: string;
    /** Suggested tool to use instead */
    suggestedTool?: string;
}
/**
 * Check if a bash command should be intercepted.
 *
 * @param command The bash command to check
 * @param availableTools Set of tool names that are available
 * @returns InterceptionResult indicating if the command should be blocked
 */
export declare function checkBashInterception(command: string, availableTools: string[], rules?: BashInterceptorRule[], originalCommand?: string): InterceptionResult;
