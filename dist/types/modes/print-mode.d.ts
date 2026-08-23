import type { ImageContent } from "@oh-my-pi/pi-ai";
import { type AgentSession, type AgentSessionEvent } from "../session/agent-session.js";
/**
 * Options for print mode.
 */
export interface PrintModeOptions {
    /** Output mode: "text" for final response only, "json" for all events */
    mode: "text" | "json";
    /** Array of additional prompts to send after initialMessage */
    messages?: string[];
    /** First message to send (may contain @file content) */
    initialMessage?: string;
    /** Images to attach to the initial message */
    initialImages?: ImageContent[];
    /** If true, include thinking blocks in text output */
    printThoughts?: boolean;
    /** Whether the caller explicitly started the headless plan flow. */
    planYolo?: boolean;
}
/** Matches the longest built-in provider request deadline while bounding tool-loop stalls. */
export declare const PRINT_MODE_ADVISOR_DRAIN_TIMEOUT_MS: number;
/** Error exits cannot hold automation for the full normal drain budget. */
export declare const PRINT_MODE_ERROR_ADVISOR_DRAIN_TIMEOUT_MS = 30000;
/**
 * Shape an event for `--mode json` output.
 *
 * Removes two classes of bloat so transcripts grow linearly with conversation
 * size instead of quadratically (a single long turn used to re-serialize its
 * whole in-progress message on every streamed delta, producing multi-GB logs):
 * - `message_update` snapshots (`message`, `assistantMessageEvent.partial`,
 *   and the `done`/`error` payloads) are dropped; only the incremental delta
 *   is printed. The authoritative message follows in `message_end`.
 * - `providerPayload` is transport-native replay state, opaque and useless
 *   outside this process.
 */
export declare function printableEvent(event: AgentSessionEvent): unknown;
/**
 * Run in print (single-shot) mode.
 * Sends prompts to the agent and outputs the result.
 */
export declare function runPrintMode(session: AgentSession, options: PrintModeOptions): Promise<void>;
