import type { Component } from "@oh-my-pi/pi-tui";
/** Minimal component surface the reveal pushes frames into. */
type ToolArgsRevealComponent = Component & {
    updateArgs(args: unknown, toolCallId?: string): void;
};
/** String fields the streamed-args decode reads incrementally for `toolName`. */
export declare function streamingStringKeysForTool(toolName: string, rawInput: boolean): readonly string[] | undefined;
type ToolArgsRevealControllerOptions = {
    getSmoothStreaming(): boolean;
    /** Called after each reveal tick with the component whose subtree changed;
     *  callers scope the render to that subtree instead of forcing a full-tree
     *  walk at 30fps (issue #4377). */
    requestRender(component: Component): void;
};
type ToolArgsRevealTarget = {
    rawInput: boolean;
    exposeRawPartialJson: boolean;
    streamingStringKeys?: readonly string[];
};
type StreamedToolArgsSource = {
    /** Custom-tool raw text stream (`customWireName` tools): never JSON-parsed. */
    rawInput: boolean;
    /** Provider-parsed arguments, spread UNDER the fresh decode: a dialect
     *  projector may carry keys a raw re-parse cannot recover, but any key the
     *  fresh parse does recover wins — provider parses lag the stream by up to
     *  STREAMING_JSON_PARSE_MIN_GROWTH bytes mid-stream. */
    fullArgs?: Record<string, unknown>;
    /** See {@link streamingStringKeysForTool}. */
    streamingStringKeys?: readonly string[];
};
/**
 * One-shot decode of a streamed tool-call argument buffer into display args —
 * the same decode the live reveal applies frame-by-frame, for paths that see
 * the buffer once (transcript rebuilds on theme change, settings, focus
 * replay). Keeps a rebuilt preview identical to the live preview: parsed
 * fields come from a fresh parse of the full buffer, `streamingStringKeys`
 * fields from the incremental string decoder (which also wins ties in the
 * live path), never from the provider's throttled `arguments`.
 */
export declare function decodeStreamedToolArgs(partialJson: string, source: StreamedToolArgsSource): Record<string, unknown>;
/**
 * Paces streamed tool-call arguments the same way StreamingRevealController
 * paces assistant text: providers that deliver `partialJson` in large batches
 * (or throttle their partial parses) would otherwise make write/edit/bash
 * streaming previews jump in chunks. Each pending tool call reveals its raw
 * argument stream at the shared 30fps cadence with the same adaptive
 * catch-up step. JSON prefixes are parsed only when enough new bytes arrive to
 * change renderer-visible fields, while raw-prefix consumers still receive
 * fresh `__partialJson` on every reveal frame.
 *
 * Reveal units are UTF-16 code units of the raw stream, not graphemes —
 * the prefix goes through a JSON parser rather than straight to the screen,
 * so only surrogate-pair integrity matters (see {@link clampSliceEnd}).
 */
export declare class ToolArgsRevealController {
    #private;
    constructor(options: ToolArgsRevealControllerOptions);
    /**
     * Record the latest streamed argument text for a tool call and return the
     * args to render right now. With smoothing disabled nothing is paced — the
     * full received buffer decodes in one step — but the entry still runs the
     * incremental string decoder + parse throttle, so streamed text fields
     * (write `content`, edit bodies, eval `code`) stay fresh between the
     * provider's own throttled full-JSON parses instead of lagging up to
     * STREAMING_JSON_PARSE_MIN_GROWTH bytes behind.
     */
    setTarget(id: string, partialJson: string, target: ToolArgsRevealTarget): Record<string, unknown>;
    /** Attach the component future ticks push frames into. */
    bind(id: string, component: ToolArgsRevealComponent): void;
    /** Final arguments arrived (the JSON closed): drop the reveal so the
     *  caller's final-args render wins immediately, mirroring how assistant
     *  text snaps to the full message at message_end. */
    finish(id: string): void;
    /** Snap every live entry to its full received stream and clear. Used at
     *  message_end (abort/error mid-stream) so sealed components freeze showing
     *  everything that arrived rather than a mid-reveal prefix. */
    flushAll(): void;
    /** Clear without pushing (teardown). */
    stop(): void;
}
export {};
