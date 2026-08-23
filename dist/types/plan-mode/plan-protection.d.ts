import { type ProtectedToolContext } from "@oh-my-pi/pi-agent-core/compaction/tool-protection";
/**
 * Build a compaction protection matcher that keeps `read` results for the active
 * plan file intact through prune/shake — the plan analog of skill-read
 * protection. Matches both the canonical `local://PLAN.md` alias and the
 * session's current plan reference path (the agent-chosen `local://<slug>-plan.md`),
 * so the plan survives compaction whether the agent reads it by alias or by name.
 *
 * `getPlanReferencePath` is evaluated at match time so the plan path set on
 * approval is honored immediately.
 */
export declare function createPlanReadMatcher(getPlanReferencePath: () => string): (context: ProtectedToolContext) => boolean;
