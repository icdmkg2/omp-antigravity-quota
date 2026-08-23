/**
 * Hub jobs half — lifecycle control for async background jobs (bash scripts,
 * subagents) owned by the calling agent: wait/cancel/snapshot plus the
 * running-agents roster for activity with no job entry.
 */
import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { Component } from "@oh-my-pi/pi-tui";
import type { AsyncJob, AsyncJobManager, AsyncJobType } from "../../async/index.js";
import type { RenderResultOptions } from "../../extensibility/custom-tools/types.js";
import type { Theme } from "../../modes/theme/theme.js";
import type { ToolSession } from "../index.js";
import type { AgentActivitySnapshot, CancelOutcome, CoordinationDetails, HubRenderArgs, JobSnapshot } from "./types.js";
/**
 * A wait snapshot where every watched job is still running and nothing was
 * cancelled — pure "still waiting" noise once a newer wait exists. The TUI
 * keeps such a block un-finalized (displaceable) so a follow-up `hub` call
 * replaces it instead of stacking another waiting frame in the transcript.
 */
export declare function isWaitingPollDetails(details: unknown): boolean;
/** Poll window for a job-watching wait: `async.pollWaitDuration` fixed value or smart ladder. */
export declare function resolvePollWindow(session: ToolSession, manager: AsyncJobManager, ownerId: string | undefined): {
    waitMs: number;
    smart: boolean;
};
/**
 * Resolve a list of job ids to job records visible to the calling agent.
 * Drops missing ids and ids owned by other agents, so cross-agent inspection
 * via the hub is impossible.
 */
export declare function visibleJobs(manager: AsyncJobManager, ids: string[], ownerId: string | undefined): AsyncJob[];
/**
 * Running subagents from the registry that are not covered by one of the
 * caller's running jobs. Agents woken via hub messaging (idle wake / park
 * revival) and spawns owned by another agent run with no AsyncJobManager
 * entry, yet the UI's agent badge counts them — a snapshot must account for
 * that activity instead of implying the system is quiet. Existence is
 * already public via the peer roster, so listing ids here leaks nothing new;
 * job *control* stays owner-scoped.
 *
 * Reporting deliberately uses the claimed `status`, not the session-corroborated
 * `registry.isRunning` used by the wait-sustaining gates: a ref that claims
 * `running` with no live turn is exactly the stale entry an operator must see
 * here to cancel it (#8634). Hiding it would match the badge count to nothing
 * and remove the only discovery path for the id.
 */
export declare function runningAgentsOutsideJobs(session: ToolSession): AgentActivitySnapshot[];
interface TrackedJobLike {
    id: string;
    type: AsyncJobType;
    status: string;
    label: string;
    startTime: number;
    latestDetails?: Record<string, unknown>;
    resultText?: string;
    errorText?: string;
}
export declare function snapshotJobs(session: ToolSession, jobs: TrackedJobLike[]): JobSnapshot[];
export declare function buildJobResult(session: ToolSession, manager: AsyncJobManager, op: "wait" | "cancel" | "jobs", jobs: TrackedJobLike[], cancelOutcomes: CancelOutcome[], agents?: AgentActivitySnapshot[]): AgentToolResult<CoordinationDetails>;
/** `wait` with explicit ids that matched nothing visible: correct the caller, surface live agents. */
export declare function noMatchingJobsResult(session: ToolSession, ids: string[]): AgentToolResult<CoordinationDetails>;
/** Bare `wait` with no running jobs and nobody who could message: nothing to block on. */
export declare function nothingToWaitForResult(session: ToolSession): AgentToolResult<CoordinationDetails>;
/** `cancel`: kill the named jobs; returns immediately with outcomes + snapshots. */
export declare function executeCancel(session: ToolSession, manager: AsyncJobManager, ownerId: string | undefined, ids: string[]): Promise<AgentToolResult<CoordinationDetails>>;
/** `jobs`: read-only snapshot of every job plus the jobless running-agent roster. */
export declare function executeJobsSnapshot(session: ToolSession, manager: AsyncJobManager, ownerId: string | undefined): AgentToolResult<CoordinationDetails>;
/** Pending-call frame for job ops (wait/cancel/jobs). */
export declare function jobsRenderCall(args: HubRenderArgs, _options: RenderResultOptions, uiTheme: Theme): Component;
/** Result frame for job snapshots (wait/cancel/jobs and the agents roster). */
export declare function jobsRenderResult(result: {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: CoordinationDetails;
    isError?: boolean;
}, options: RenderResultOptions, uiTheme: Theme, hubArgs?: HubRenderArgs): Component;
export {};
