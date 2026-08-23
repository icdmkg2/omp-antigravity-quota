/**
 * Returns true when OSC 8 hyperlinks should be emitted.
 *
 * Respects `tui.hyperlinks` setting:
 * - `"off"`: never
 * - `"auto"`: when `process.stdout.isTTY`, `NO_COLOR` is unset, and the detected terminal reports hyperlink support
 * - `"always"`: unconditionally (useful for viewers that support OSC 8 without advertising it)
 * Before settings initialization, returns false so early render paths stay plain text.
 */
export declare function isHyperlinkEnabled(): boolean;
/**
 * Wrap `displayText` in an OSC 8 hyperlink pointing at `uri`.
 *
 * Returns `displayText` unchanged when hyperlinks are disabled, `uri` contains
 * terminal control bytes, or `displayText` already contains an OSC 8 sequence.
 */
export declare function uriHyperlink(uri: string, displayText: string): string;
/**
 * Wrap `displayText` in an OSC 8 hyperlink pointing at an HTTP(S) URL.
 * `www.example.com` inputs are linked as `https://www.example.com`.
 */
export declare function urlHyperlink(url: string, displayText: string): string;
/**
 * Wrap `displayText` in an OSC 8 hyperlink pointing at an HTTP(S) URL,
 * bypassing terminal capability auto-detection. Used for auth prompts where
 * an inert "click" label blocks login on terminals whose capabilities are
 * not advertised. Still returns plain text before settings initialization or
 * when the user has explicitly opted out via `tui.hyperlinks=off`.
 */
export declare function urlHyperlinkAlways(url: string, displayText: string): string;
/**
 * Wrap `displayText` in an OSC 8 hyperlink pointing at a filesystem path.
 *
 * Returns `displayText` unchanged when hyperlinks are disabled or when
 * the text already contains an OSC 8 sequence (prevents double-wrapping).
 * Relative paths resolve against the current working directory before URI
 * encoding so the OSC 8 target is always a valid `file://` URL.
 *
 * @param filePath - Filesystem path
 * @param displayText - Text to render as the hyperlink anchor (may contain ANSI codes)
 * @param opts - Optional line/col position appended as `?line=N&col=M` query params
 */
export declare function fileHyperlink(filePath: string, displayText: string, opts?: {
    line?: number;
    col?: number;
}): string;
/**
 * Synchronously resolve a filesystem-backed internal URL (e.g. `local://foo.md`,
 * `memory://root/notes.md`) to its absolute filesystem path. Returns `undefined`
 * for inputs that aren't fs-backed, aren't resolvable in the current session
 * registry, or fail to parse.
 *
 * Used by renderers to wrap fs-backed internal URLs in OSC 8 hyperlinks even
 * when the resolved path isn't yet available from tool result details (e.g.
 * during the call/streaming phase before a result lands).
 *
 * Async-resolved schemes (`artifact://`, `agent://`, `skill://`, `rule://`,
 * `omp://`) are not handled here — those rely on `details.resolvedPath` set
 * by the read tool's router resolution.
 */
export declare function tryResolveInternalUrlSync(input: string): string | undefined;
