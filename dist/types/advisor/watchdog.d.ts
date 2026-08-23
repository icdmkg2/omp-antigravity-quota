import type { ActiveRepoContext } from "../utils/active-repo-context.js";
export declare function formatActiveRepoWatchdogPrompt(activeRepoContext: ActiveRepoContext): string;
/**
 * Render the project context files (AGENTS.md and the like) into a block for the
 * advisor's system prompt, mirroring how the primary agent receives them. Gives
 * the read-only reviewer the user's standing project instructions so it can hold
 * the driving agent to them instead of advising against project conventions it
 * cannot otherwise see. Returns undefined when there are no context files.
 */
export declare function formatAdvisorContextPrompt(contextFiles: ReadonlyArray<{
    path: string;
    content: string;
}>): string | undefined;
/**
 * A readable config candidate discovered on the watchdog/advisor search path,
 * with raw (un-expanded) content and its position metadata.
 */
export interface ConfigCandidate {
    path: string;
    content: string;
    level: "user" | "project";
    depth: number;
}
/**
 * Walk the watchdog/advisor config search path — the user agent dir plus every
 * directory from `cwd` up to the repo root (or home), probing both `<F>` and
 * `.omp/<F>` for each given filename — and return the readable candidates with
 * their raw content, sorted user-first then project ancestor→leaf (depth
 * descending, so the leaf directory is most specific/last). Shared by
 * {@link discoverWatchdogFiles} and `discoverAdvisorConfigs`. Content is returned
 * verbatim (no `@import` expansion); callers expand what they need.
 */
export declare function collectConfigCandidates(cwd: string, agentDir: string | undefined, filenames: string[]): Promise<ConfigCandidate[]>;
/**
 * Discover and load WATCHDOG.md files walking up from cwd, project .omp folder, and user agent dir.
 * Returns formatted watchdog file blocks ready to be appended to the advisor system prompt.
 */
export declare function discoverWatchdogFiles(cwd: string, agentDir?: string): Promise<string[]>;
