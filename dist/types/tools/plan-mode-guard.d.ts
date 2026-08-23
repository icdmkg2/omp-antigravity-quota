import type { ToolSession } from "./index.js";
/** Strip the hashline `[path#TAG]` wrapper from a write/edit target so the inner
 *  filesystem path drives both authorization and resolution. Only unwraps inputs
 *  that match the strict hashline header shape (`[path]` or `[path#XXXX]` with a
 *  4-hex tag); anything else returns the original string so the downstream
 *  resolver surfaces the real error. Exported for callers (e.g. `write`) that
 *  make scheme/bridge-routing decisions before {@link resolvePlanPath} runs. */
export declare function unwrapHashlineHeaderPath(targetPath: string): string;
/** True when `targetPath` resolves into the session-local artifact sandbox.
 *  Routes through {@link resolvePlanPath} so the guard and the eventual write
 *  always agree on the absolute target (including bracketed hashline headers,
 *  `local://` URLs, and bare absolute paths). Files inside the sandbox are not
 *  part of the working tree, so plan mode treats them as freely writable
 *  scratch/plan space — and tag-based path recovery may rebind onto them. */
export declare function targetsLocalSandbox(session: ToolSession, targetPath: string): boolean;
/**
 * Resolve a write/edit target to its absolute filesystem path, honoring the
 * `local://` and `vault://` schemes. Plain paths resolve against the session cwd.
 * Bracketed hashline headers (`[path#TAG]`) are unwrapped first so the inner
 * filesystem path drives resolution — keeping the plan-mode guard and the
 * eventual write in lockstep.
 */
export declare function resolvePlanPath(session: ToolSession, targetPath: string): string;
/**
 * Plan mode keeps the working tree read-only while letting the agent draft its
 * plan. Writes and edits to the `local://` artifact sandbox are allowed (that is
 * where the plan and any scratch notes live); anything that would touch the
 * working tree — or rename/delete a file — is rejected.
 */
export declare function enforcePlanModeWrite(session: ToolSession, targetPath: string, options?: {
    move?: string;
    op?: "create" | "update" | "delete";
}): void;
