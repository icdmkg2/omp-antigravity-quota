/**
 * Internal URL parser that handles colons in the host segment.
 *
 * Standard `new URL()` interprets colons as port separators, which breaks
 * namespaced internal URLs like `skill://plugin:name`. This parser extracts
 * components via regex first, then falls back to a minimal URL-like object
 * when `new URL()` fails.
 *
 * All code that parses internal URLs (router, protocol handlers, tools)
 * MUST use this function instead of calling `new URL()` directly.
 */
import type { InternalUrl } from "./types.js";
/**
 * Extract the lowercased scheme from a URI-shaped input, or `undefined` when
 * the input does not look like a URI.
 *
 * Accepts both hierarchical (`scheme://…`) and opaque (`scheme:rest`) forms —
 * MCP resource URIs may be opaque (`urn:example:document`, `custom:item`).
 * The opaque form is guarded against path-like false positives:
 * - Windows drive paths (`C:\…`, `C:/…`, `C:foo`) — single-letter scheme.
 * - Filenames with extensions (`foo.ts:50`) — dot in the scheme segment.
 * - Read-tool selector tails (`Makefile:12`, `README:raw:1-20`).
 */
export declare function extractUriScheme(input: string): string | undefined;
/**
 * Parse an internal URL into an InternalUrl.
 *
 * Handles URLs where `new URL()` would fail (e.g., `skill://plugin:name`
 * where the colon is not a port separator).
 */
export declare function parseInternalUrl(input: string): InternalUrl;
