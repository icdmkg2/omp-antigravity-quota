/**
 * Repair double-encoded JSON string arguments for the task tool.
 *
 * Models occasionally JSON-escape a string value twice when emitting a
 * `task` tool call, so a `task` field that should read
 *
 *     # Role
 *     You are a judge … "describe this" … return —
 *
 * arrives — after the one JSON decode the provider already applied — as the
 * literal text
 *
 *     # Role\nYou are a judge … \"describe this\" … return \u2014
 *
 * i.e. every newline, quote, and unicode character is still backslash-escaped.
 * The subagent then receives that garbled prompt, and the call preview renders
 * one long blob with visible `\n` / `\"` / `\uXXXX`.
 *
 * The *whole-arguments* form of this quirk (the entire `arguments` blob is a
 * JSON string) is already auto-corrected by the validator's JSON-string
 * coercion. This module handles the *per-field* form, where the object parses
 * fine but an individual string value is double-encoded — the validator never
 * fires there because a double-encoded string is still a structurally valid
 * string.
 *
 * This is deliberately scoped to the task tool's natural-language fields
 * (`task`, shared `context`); identifier fields (`name`, `agent`)
 * are never repaired. It is NOT applied to code-bearing
 * tools (write/edit/bash/search), where a backslash or quote is load-bearing
 * and a false-positive unescape would silently corrupt a file or command.
 */
import type { TaskParams } from "./types.js";
/**
 * Return the once-unescaped string when `value` is uniformly double-encoded
 * JSON (a well-formed JSON string body that decodes to a different string);
 * otherwise return `value` unchanged.
 *
 * The `JSON.parse(\`"${value}"\`)` round-trip is the safety net: it only
 * succeeds when *every* backslash begins a valid JSON escape and no bare
 * double-quote exists — exactly the signature of double-encoding. Genuine
 * prose with a Windows path (`C:\Users`), a regex (`\d+`), an embedded quote,
 * or a real (already-decoded) newline makes the parse throw, so the value is
 * returned untouched.
 */
export declare function repairDoubleEncodedJsonString(value: string): string;
/**
 * Repair double-encoded prose in task-tool params (flat `task`, shared
 * `context`, and each batch task item's `task`). Returns the same reference
 * when nothing changed so callers can cheaply skip work. Defensive against
 * partially-streamed args (missing/undefined fields, partial task arrays) so
 * it is safe on the render path as well as on execution.
 */
export declare function repairTaskParams(params: TaskParams): TaskParams;
