import type { Observation } from "../tab-protocol.js";
export interface CmuxKind {
    kind: "cmux";
    socketPath: string;
    password?: string;
    surface?: string;
}
export interface CmuxOpenSplitResult {
    surface_id?: unknown;
    url?: unknown;
    workspace_id?: unknown;
    created_split?: unknown;
    placement_strategy?: unknown;
}
export interface CmuxSnapshotRef {
    role?: unknown;
    name?: unknown;
}
export interface CmuxSnapshotPage {
    title?: unknown;
    url?: unknown;
    ready_state?: unknown;
    text?: unknown;
    html?: unknown;
}
export interface CmuxSnapshotResult {
    snapshot?: unknown;
    refs?: Record<string, CmuxSnapshotRef>;
    page?: CmuxSnapshotPage;
    url?: unknown;
    title?: unknown;
    ready_state?: unknown;
    surface_id?: unknown;
}
export interface CmuxEvalResult {
    value?: unknown;
    surface_id?: unknown;
    content_world?: unknown;
}
export interface CmuxUrlGetResult {
    url?: unknown;
    surface_id?: unknown;
    workspace_id?: unknown;
}
export interface CmuxScreenshotResult {
    png_base64?: unknown;
    path?: unknown;
    url?: unknown;
    surface_id?: unknown;
    width?: unknown;
    height?: unknown;
}
export interface CmuxGeometry {
    innerWidth: number;
    innerHeight: number;
    dpr: number;
    scrollX: number;
    scrollY: number;
    scrollWidth: number;
    scrollHeight: number;
}
export declare const GEOMETRY_SCRIPT = "(() => ({ innerWidth: window.innerWidth, innerHeight: window.innerHeight, dpr: window.devicePixelRatio||1, scrollX: window.scrollX, scrollY: window.scrollY, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight }))()";
export declare function cmuxSnapshotToObservation(result: CmuxSnapshotResult, viewport: Observation["viewport"], geometry: CmuxGeometry): Observation;
export declare function serializeEval(fn: string | ((...args: unknown[]) => unknown), args: unknown[]): string;
/**
 * Like {@link serializeEval}, but wraps the expression in a page-side
 * try/catch envelope so a throwing script surfaces its message + stack
 * instead of the daemon's opaque `js_error: A JavaScript exception occurred`,
 * and a Promise return (which the daemon cannot serialize) is flagged
 * explicitly rather than failing as "unsupported type".
 *
 * String scripts run through indirect eval to keep global-scope semantics;
 * function sources are already expressions and are invoked directly.
 * `undefined` results come back as `null` (JSON cannot carry `undefined`).
 * Decode with {@link unwrapEvalEnvelope}.
 */
export declare function serializeEvalWithEnvelope(fn: string | ((...args: unknown[]) => unknown), args: unknown[]): string;
/**
 * Decode a {@link serializeEvalWithEnvelope} result: rethrow page-side
 * exceptions as rich {@link ToolError}s, reject unserializable Promise
 * returns with an actionable message, and pass through values from daemons
 * that did not run the wrapper.
 */
export declare function unwrapEvalEnvelope<TResult>(value: unknown, label: string): TResult;
export declare function mapWaitUntil(waitUntil: string | undefined): "interactive" | "complete";
export interface ResolveCmuxKindOptions {
    surface?: string;
    settingEnabled?: boolean;
}
export declare function resolveCmuxKind(options?: ResolveCmuxKindOptions | null, env?: Record<string, string | undefined>): CmuxKind | null;
