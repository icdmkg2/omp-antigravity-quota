import type { ImageContent, TextContent } from "@oh-my-pi/pi-ai";
import type { JsDisplayOutput } from "../../eval/js/shared/types.js";
/**
 * Accumulates a browser run's result entries: explicit `display()` payloads,
 * screenshot captions/images, and buffered stream text (`console.*`, `print`,
 * `display()` of strings/primitives — `JsRuntime.displayValue` emits those via
 * `onText`). Stream text is buffered and flushed as one entry before the next
 * display/screenshot (and on `finish()`) so it reaches the tool result in
 * order instead of vanishing into the debug log.
 */
export declare class RunOutput {
    #private;
    /** Buffer a stream-text chunk; it joins the entries at the next push or on finish(). */
    pushText(chunk: string): void;
    /** Append a `display()` payload (image/json/status), flushing buffered text first. */
    pushDisplay(output: JsDisplayOutput): void;
    /** Append a pre-built entry (e.g. a screenshot caption/image), flushing buffered text first. */
    push(entry: TextContent | ImageContent): void;
    /** Flush any remaining stream text and return the ordered entries. */
    finish(): Array<TextContent | ImageContent>;
}
/** JSON.stringify that never throws (cycles/BigInt → String(value)). */
export declare function safeJsonStringify(value: unknown): string;
/** Pass a return value across the run boundary: structured-cloneable as-is, else JSON round-trip, else String. */
export declare function cloneSafe(value: unknown): unknown;
