import type { Settings } from "../../config/settings.js";
import { type AgentRef } from "../../registry/agent-registry.js";
import type { ObservableSession } from "../session-observer-registry.js";
import type { AgentMetrics } from "./agent-hub-projection.js";
export interface RosterRender {
    lines: string[];
    hitRows: Array<number | undefined>;
}
/** Compute the max content width for the current terminal, accounting for chrome. */
export declare function contentWidth(): number;
/** Remove terminal controls and normalize a value before it reaches the TUI. */
export declare function sanitizeDisplayText(text: string): string;
/** Sanitize a line for TUI display and truncate it to the viewport width. */
export declare function sanitizeLine(text: string, maxWidth?: number): string;
export declare function clampHubLine(line: string, width: number): string;
/** Status glyph, colored per theme status conventions. The title-line counts spell out the words. */
export declare function statusGlyph(status: AgentRef["status"]): string;
export declare function statusText(status: AgentRef["status"], text: string): string;
/** Textual model-role tag; color reinforces (but never replaces) the label. */
export declare function formatRoleBadge(role: string, settings: Settings): string;
/**
 * Resolved model + reasoning level for a hub row. Exact executor progress is
 * authoritative (and survives completion); direct live sessions are the
 * fallback for agents without an observer snapshot — the main session has no
 * snapshot at all, so its row is read straight off the live session.
 *
 * Every source reports the model that produced the row's work, never the one
 * the session merely points at: an armed fallback that has not served yet stays
 * attributed to whichever model last actually spoke.
 */
export declare function modelBadge(ref: AgentRef, observed: ObservableSession | undefined): string | undefined;
export declare function formatMetricDuration(metrics: AgentMetrics): string | undefined;
export declare function formatCost(cost: number): string;
export declare function formatMetrics(metrics: AgentMetrics): string;
export declare function contextGauge(tokens: number, window: number): string;
/** Fit a child-id preview without joining an arbitrarily large child set. */
export declare function formatChildIds(children: readonly AgentRef[], width: number): string;
/** Bash `tree`-style ancestry prefix, clipped from the left on pathological depth. */
export declare function treeBranch(ref: AgentRef, maxWidth: number, depthById: ReadonlyMap<string, number>, parentById: ReadonlyMap<string, string>, lastSiblingById: ReadonlyMap<string, boolean>): string;
