/**
 * Resolution devices: staged work is finalized through plain-text writes to
 * always-available `xd://` URLs — no tool schema, no JSON protocol.
 *
 *   write xd://resolve   reason text  → APPLY the pending staged preview
 *   write xd://reject    reason text  → DISCARD the pending staged preview
 *   write xd://propose   plan <slug>  → submit the plan for approval (plan mode)
 *
 * Nothing rides the system prompt: the flows that stage work teach the call
 * shape at the moment it becomes relevant (the preview reminder for
 * resolve/reject, the plan-mode prompt for propose).
 *
 * Rendering rides the write tool's xd:// delegation: renderers.ts keys the
 * resolve renderer under `resolve` and `reject` so device writes and legacy
 * `resolve` tool transcripts draw the same block.
 */
import type { AgentToolResult, CustomMessage } from "@oh-my-pi/pi-agent-core";
import type { Component } from "@oh-my-pi/pi-tui";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import type { Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "./index.js";
import type { XdevDispatch } from "./xdev.js";
export declare const RESOLVE_DEVICE_NAME = "resolve";
export declare const REJECT_DEVICE_NAME = "reject";
export declare const PROPOSE_DEVICE_NAME = "propose";
/** The plain-text resolution device URLs (`xd://resolve`, …). */
export declare const RESOLVE_DEVICE_PATH = "xd://resolve";
export declare const REJECT_DEVICE_PATH = "xd://reject";
export declare const PROPOSE_DEVICE_PATH = "xd://propose";
/**
 * Model-visible banner prepended to a staged preview's tool result text. The
 * TUI badge (`⟨proposed⟩`) never reaches the model, and preview diffs are
 * byte-identical to applied-edit output — without this line the model reads
 * the result as an already-applied change.
 */
export declare const PREVIEW_PENDING_NOTICE = "Staged as a proposal \u2014 files NOT modified yet. To apply: write a one-sentence reason to xd://resolve. To discard: write to xd://reject.";
export type ResolutionDeviceName = typeof RESOLVE_DEVICE_NAME | typeof REJECT_DEVICE_NAME | typeof PROPOSE_DEVICE_NAME;
/** Whether an xd:// device name is one of the plain-text resolution devices. */
export declare function isResolutionDeviceName(name: string): name is ResolutionDeviceName;
/** One-line usage string returned by `read xd://<device>` — the only "docs" these devices carry. */
export declare function resolutionDeviceUsage(device: ResolutionDeviceName): string;
/**
 * Whether an assistant tool call is a `write` targeting `xd://resolve` or
 * `xd://reject`. Used as the SoftToolRequirement compliance check while a
 * preview is pending — a plain `write` elsewhere resolves nothing.
 */
export declare function isPreviewResolutionToolCall(toolCall: {
    name: string;
    arguments?: Record<string, unknown>;
}): boolean;
/** Whether an assistant tool call is a `write` targeting `xd://propose` (plan-mode decision detection). */
export declare function isProposeToolCall(toolCall: {
    name: string;
    arguments?: Record<string, unknown>;
}): boolean;
/**
 * The XdevDispatch metadata carried on a completed `write` execution result, or
 * `undefined` when the execution was not a device dispatch. Consumers check
 * `.tool` (e.g. `PROPOSE_DEVICE_NAME` for plan-mode decision tracking and the
 * event-controller's plan-approval hook).
 */
export declare function writeDeviceDispatch(toolName: string, result: unknown): XdevDispatch | undefined;
/** Handler installed by plan mode; `xd://propose` dispatches the written plan title to it. */
export type PlanProposalHandler = (title: string) => Promise<AgentToolResult<unknown>>;
type ResolveAction = "apply" | "discard";
/** Details payload carried on a resolve/reject dispatch result (`XdevDispatch.inner`). */
export interface ResolveDetails {
    action: ResolveAction;
    reason: string;
    sourceToolName?: string;
    label?: string;
    sourceResultDetails?: unknown;
}
/** Parse a completed `write` dispatch targeting `xd://resolve` or `xd://reject`. */
export declare function resolveDispatchDetails(toolName: string, result: unknown): ResolveDetails | undefined;
/** Invoker input for queued pending-preview handlers. */
interface ResolveInvocation {
    action: ResolveAction;
    reason: string;
}
/**
 * Register a non-forcing resolve-protocol handler for a staged preview. Wraps the
 * caller's apply/reject into an onInvoked closure and stores it on the tool-choice
 * queue's pending-invoker registry under a UNIQUE id. A `write` to `xd://resolve`
 * or `xd://reject` dispatches to it; the agent-loop's SoftToolRequirement
 * lifecycle injects the preview reminder and escalates to a forced `write` only
 * if the model declines — so a compliant turn pays ZERO tool_choice change (no
 * prompt-cache messages-cache invalidation).
 *
 * This is the canonical entry point for any tool that wants preview/apply
 * semantics. No session-level abstraction is needed: callers pass their
 * apply/reject functions directly. Resolution requires the `write` tool to be
 * active — the session's soft requirement names it.
 */
export declare function queueResolveHandler(session: ToolSession, options: {
    label: string;
    sourceToolName: string;
    apply(reason: string): Promise<AgentToolResult<unknown>>;
    reject?(reason: string): Promise<AgentToolResult<unknown> | undefined>;
}): void;
/**
 * The canonical preview reminder. The resolve mechanism owns the wording; the
 * agent-loop delivers it via the session's `SoftToolRequirement.reminder` (injected
 * once per pending-preview head) instead of a host-side steer, so it lands as a
 * stable mid-history append and never churns the cached prefix.
 */
export declare function buildResolveReminderMessage(sourceToolName: string): CustomMessage;
/**
 * Execute a resolution-device write. `text` is the raw plain-text body:
 * - `xd://resolve` / `xd://reject` → the reason; dispatches to the pending
 *   preview invoker (in-flight queue directive first).
 * - `xd://propose` → the plan title; dispatches to the plan-proposal handler
 *   installed by plan mode.
 */
export declare function dispatchResolutionDevice(session: ToolSession, device: ResolutionDeviceName, text: string): Promise<{
    result: AgentToolResult<unknown>;
    xdev: XdevDispatch;
}>;
/** Streaming-safe call preview for a resolution-device write: `Resolve/Reject/Propose: <text>`. */
export declare function renderResolutionDeviceCall(device: ResolutionDeviceName, content: unknown, uiTheme: Theme): Component;
export declare const resolveRenderer: {
    renderCall(args: Partial<ResolveInvocation>, _options: RenderResultOptions, uiTheme: Theme): Component;
    renderResult(result: {
        content: Array<{
            type: string;
            text?: string;
        }>;
        details?: ResolveDetails;
        isError?: boolean;
    }, _options: RenderResultOptions, uiTheme: Theme): Component;
    inline: boolean;
    mergeCallAndResult: boolean;
};
export {};
