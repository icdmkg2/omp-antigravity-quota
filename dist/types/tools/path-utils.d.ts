import { glob } from "@oh-my-pi/pi-natives";
import type { Skill } from "../extensibility/skills.js";
import { type LocalProtocolOptions } from "../internal-urls/index.js";
export declare function expandTilde(filePath: string, home?: string): string;
export declare function expandPath(filePath: string): string;
export declare function normalizeWindowsDriveAliasPath(filePath: string, platform?: NodeJS.Platform): string;
/**
 * Inclusive line range describing one selector segment (e.g. `50-100`,
 * `301-`, or `50+10`). `endLine` is `undefined` for open-ended ranges.
 */
export interface LineRange {
    startLine: number;
    endLine: number | undefined;
}
/** Parse a single `N`, `N-M`, `N-`, `N+K`, or `..`-aliased (`N..M`, `N..`) chunk. Throws via {@link ToolError} on invalid bounds. */
export declare function parseLineRangeChunk(sel: string): LineRange | null;
/**
 * Parse a comma-separated list of line ranges (e.g. `5-16,960-973`). Returns
 * the ranges in ascending order with overlapping/adjacent ranges merged so
 * downstream consumers can stream the file in a single forward pass per range.
 */
export declare function parseLineRanges(sel: string): [LineRange, ...LineRange[]] | null;
/**
 * Extract the line-range component from a read-tool selector that may also
 * carry a verbatim/index display mode (`raw`, `conflicts`) — alone or compounded
 * with a range (`raw:50-100`, `50-100:raw`). Returns the parsed ranges when the
 * selector names any, otherwise `undefined` (pure `raw`/`conflicts`/none).
 *
 * Used by content search, which honors line ranges as a match filter but has no
 * use for verbatim/conflict display modes — so those selectors are accepted and
 * treated as an unfiltered, whole-resource search rather than rejected.
 */
export declare function selectorLineRanges(sel: string | undefined): [LineRange, ...LineRange[]] | undefined;
/** Return `true` when `lineNumber` (1-indexed) falls in any of the supplied ranges. */
export declare function isLineInRanges(lineNumber: number, ranges: readonly LineRange[]): boolean;
export declare function splitPathAndSel(rawPath: string): {
    path: string;
    sel?: string;
};
/**
 * Three-way probe for whether the exact filesystem entry named by `filePath`
 * exists. `stat` (used earlier) failed for reasons other than "no such file"
 * (dangling symlink, `EACCES` on a parent, transient I/O), and each of those
 * silently reinterpreted a real literal path such as `test:1-2` as `test`
 * plus selector `1-2` (issue #4618). `lstat` inspects the entry itself, so a
 * dangling symlink is still detected as present; ambiguous errors resolve to
 * `"unknown"` so callers keep the raw path instead of guessing.
 *
 * `ENAMETOOLONG` resolves to `"missing"` rather than `"unknown"`: a path whose
 * component or whole length exceeds the OS limit can never name a real single
 * entry, so it is strictly stronger evidence of non-existence than `ENOENT`.
 * Without this, a semicolon-joined `path` list long enough to trip the limit
 * (bare filenames past `NAME_MAX`, or a total past `PATH_MAX`) was read as one
 * literal path and the delimited split was suppressed (issue #7597).
 */
export declare function probeLiteralPathExists(filePath: string, cwd: string): Promise<"exists" | "missing" | "unknown">;
/**
 * Async sibling of {@link splitPathAndSel} that prefers a literal filesystem
 * path over selector interpretation. Filenames whose tail matches the selector
 * grammar (e.g. `test:1-2`, `log:raw`) are legal on POSIX; without this the
 * strict splitter peels the tail and both `read` and `grep` refuse to open the
 * real file (issue #4618). The literal wins on a confirmed `lstat`, and also
 * on `"unknown"` (`EACCES` on a parent, transient I/O), so an unreachable
 * literal is never silently reinterpreted as `path + selector`. Only a
 * definitive `ENOENT`/`ENOTDIR` falls back to the strict split.
 */
export declare function splitPathAndSelPreferringLiteral(rawPath: string, cwd: string): Promise<{
    path: string;
    sel?: string;
}>;
/**
 * Variant of {@link splitPathAndSel} for internal URLs (`scheme://...`).
 *
 * The filesystem-path splitter is intentionally conservative: it refuses to
 * peel a trailing `:<chunk>` unless that chunk matches the strict selector
 * grammar. That rule is right for filesystem paths (a file named `a:1-50` is
 * legal) but wrong for internal URLs, where any trailing `:<chunk>` after the
 * scheme is unambiguously a read-tool selector — even if malformed (e.g.
 * `artifact://3:raw:-100`).
 *
 * This function iteratively peels selector-shaped chunks (well-formed plus
 * common malformed shapes like `:-N`) so the rest of the read tool can pass a
 * clean URL to the protocol handler and surface selector errors via parseSel
 * instead of as misleading "host invalid" errors from the handler. Schemes
 * whose resource URIs may legitimately contain colons (`mcp://`) are skipped.
 *
 * Falls back to the input unchanged when nothing matches.
 */
export declare function splitInternalUrlSel(rawPath: string): {
    path: string;
    sel?: string;
};
/**
 * Peel a read-tool selector off an internal-URL write target so `write` resolves
 * the same file `read` does (e.g. `ssh://h/f:raw` -> `ssh://h/f`). Only the
 * whole-file display modes `raw`/`conflicts` are accepted (they do not change
 * which bytes are written); any other selector-shaped tail `splitInternalUrlSel`
 * peels — a line range, a compound like `raw:1-20`, or a malformed `:-N` — throws,
 * because `write` addresses a whole file, not a partial range, and silently
 * stripping it would write to a path the caller never named. Non-URL paths and
 * URLs without a selector pass through unchanged.
 */
export declare function peelWriteUrlSelector(rawPath: string): string;
export declare function normalizeLocalScheme(filePath: string): string;
export declare function isInternalUrlPath(filePath: string): boolean;
/**
 * Approval tier for a path that will be written through the file/internal-URL
 * routing layer. Internal resources are read-tier only when their handler is
 * read-only; writable handlers such as vault:// must retain write approval.
 */
export declare function resolveFileWriteApprovalTier(filePath: string): "read" | "write";
/**
 * True when a tool path argument references the `ssh://` scheme anywhere.
 *
 * Substring (not anchored) on purpose: it feeds the read/search/write approval
 * tier, which runs synchronously on the raw args. `search` only flattens a
 * delimited `paths: "a,ssh://h/x"` into separate entries *after* approval, so an
 * anchored check would let an embedded `ssh://` slip through at the read tier.
 * Matching the literal `ssh://` substring also tracks exactly what routes to the
 * SSH handler; over-matching only over-prompts (fail-closed).
 */
export declare function pathTargetsSsh(path: string): boolean;
/**
 * True when a path is specifically an `ssh://` URL (anchored scheme match).
 * Unlike {@link pathTargetsSsh} (substring, for the pre-expansion approval
 * scan), this is the exact per-entry check used to reject `ssh://` *before* a
 * side-effecting `InternalUrlRouter.resolve` in tools that need a local file.
 */
export declare function isSshUrl(path: string): boolean;
/**
 * True when the read tool's URL parser (`parseReadUrlTarget` in fetch.ts) would
 * recognize this path as a readable external URL: a strict `http(s)://`, a
 * collapsed `http(s):/host` (Node path normalization folds `//` → `/`), or a
 * scheme-less `www.` spelling. Keep in sync with `parseReadUrlTarget`.
 */
export declare function isReadableUrlPath(value: string): boolean;
/**
 * Resolve a path relative to the given cwd.
 * Handles ~ expansion and absolute paths.
 *
 * A bare root slash is treated as a workspace-root alias for tool inputs. Users
 * often pass `/` to mean “search from here”, and letting tools escape to the
 * filesystem root is almost never what they intended.
 */
export declare function resolveToCwd(filePath: string, cwd: string): string;
/**
 * Resolve a path that MUST stay inside `cwd`, or `null` when it would escape.
 *
 * {@link resolveToCwd} deliberately honors absolute paths, `~`, and `..` —
 * correct for a path a user typed, wrong for one a remote peer supplied.
 * Callers handling untrusted input (Cursor's `download_path`) use this instead:
 * only a non-empty relative path landing under the live cwd is accepted, so
 * neither `/etc/passwd` nor `../../escape` can be written through.
 *
 * The lexical check alone is not containment: a symlink inside the workspace
 * can point anywhere, so `out/config` under a `ws/out -> /elsewhere` link is
 * relative, `..`-free, and still writes outside. Both the target and its
 * deepest existing ancestor are therefore realpath-resolved — the ancestor
 * because a download names a file that does not exist yet, so the link in its
 * path is the only thing that can be resolved before the write.
 *
 * The cwd itself is rejected: a download names a file, never the directory.
 */
export declare function confineToWorkspace(filePath: string, cwd: string): string | null;
/**
 * Resolve the path a syscall on `filePath` would really act on, or `null` when
 * that cannot be established.
 *
 * A lexical path is not a destination. The kernel follows every component above
 * the last, so `ws/link/file` under a `ws/link -> /elsewhere` link lands outside
 * `ws` while still looking relative and `..`-free. Handing such a path to a
 * privileged helper defeats the defence a helper author reaches for first — a
 * prefix allowlist passes, because the link sits inside the allowed root while
 * its target does not. Callers that hand a path to something more privileged
 * than the syscall that just failed resolve it here first.
 *
 * Rejecting symlinked components outright is not an option: `/var` and `/tmp`
 * are links on macOS, so every path under `os.tmpdir()` traverses one. They are
 * resolved instead, and only a path whose real destination cannot be established
 * is refused, because "where would this land" then has no answer to hand over.
 * {@link confineToWorkspace} refuses an unresolvable link for the same reason.
 *
 * @param followFinal `true` for a syscall that follows a link at the final
 *   component (`open`, so every write), `false` for one that acts on the link
 *   itself (`unlink`) and therefore needs it left alone.
 */
export declare function resolveSyscallTarget(filePath: string, followFinal: boolean): Promise<string | null>;
export declare function formatPathRelativeToCwd(filePath: string, cwd: string, options?: {
    trailingSlash?: boolean;
}): string;
/**
 * Strip matching surrounding double quotes from a path string.
 * Common when users paste quoted paths from Windows Explorer or shell copy-paste.
 * Only double quotes — single quotes are valid POSIX filename characters.
 * Tradeoff: a POSIX path literally starting AND ending with " would also be unquoted.
 * Accepted because such names are virtually nonexistent in practice.
 */
export declare function stripOuterDoubleQuotes(input: string): string;
export declare function normalizePathLikeInput(input: string): string;
/**
 * Normalize a path argument that may arrive as a single string, a JSON-encoded
 * string array (`'["a.ts"]'`), or an actual array into a flat `string[]`.
 * Delimited single strings (`"a.ts b.ts"`) are left for
 * {@link expandDelimitedPathEntries} to split.
 */
export declare function toPathList(input: string | string[] | undefined): string[];
export declare function hasGlobPathChars(filePath: string): boolean;
type PathEntrySplitter = (item: string) => {
    basePath: string;
};
/**
 * Split one path-like entry whose multiple targets were flattened into one
 * string. Existing paths are kept intact, so real filenames containing spaces,
 * commas, or semicolons win over delimiter recovery.
 */
export declare function splitDelimitedPathEntry(entry: string, cwd: string, options?: {
    splitter?: PathEntrySplitter;
    routedUrlPredicate?: (entry: string) => boolean;
}): Promise<string[] | null>;
/** Expand delimited entries in-place while preserving unsplit entries. */
export declare function expandDelimitedPathEntries(entries: readonly string[], cwd: string, options?: {
    splitter?: PathEntrySplitter;
}): Promise<string[]>;
export interface ParsedSearchPath {
    basePath: string;
    glob?: string;
}
export interface ParsedFindPattern {
    basePath: string;
    globPattern: string;
    hasGlob: boolean;
}
export interface ResolvedSearchTarget {
    basePath: string;
    glob?: string;
}
export interface ResolvedMultiSearchPath {
    basePath: string;
    glob?: string;
    scopePath: string;
    exactFilePaths?: string[];
    targets?: ResolvedSearchTarget[];
}
export interface ResolvedFindTarget {
    basePath: string;
    globPattern: string;
    hasGlob: boolean;
}
export interface ResolvedMultiFindPattern {
    targets: ResolvedFindTarget[];
    scopePath: string;
}
export declare function parseSearchPath(filePath: string): ParsedSearchPath;
/**
 * Async sibling of {@link parseSearchPath} that prefers literal interpretation
 * when a path containing glob metacharacters resolves to an existing entry on
 * disk. Disambiguates Next.js/SvelteKit routes like `apps/[id]/page.tsx` —
 * without this, `[id]` is parsed as a glob character class and silently
 * matches nothing.
 */
export declare function parseSearchPathPreferringLiteral(filePath: string, cwd: string): Promise<ParsedSearchPath>;
export declare function parseFindPattern(pattern: string): ParsedFindPattern;
export declare function combineSearchGlobs(prefixGlob?: string, suffixGlob?: string): string | undefined;
export declare function resolveExplicitSearchPaths(pathItems: string[], cwd: string, suffixGlob?: string, fanOutFileItems?: boolean): Promise<ResolvedMultiSearchPath | undefined>;
export declare function resolveExplicitFindPatterns(patternItems: string[], cwd: string): Promise<ResolvedMultiFindPattern | undefined>;
/**
 * Result of partitioning a list of user-supplied paths/globs into entries whose
 * base directory currently exists on disk versus those that do not.
 *
 * Used by multi-path tools (search, find, ast_grep, ast_edit) to tolerate one
 * or more missing entries in a multi-path call: the surviving entries should
 * still be searched, with the missing entries surfaced as a non-fatal warning.
 */
export interface PartitionedPaths {
    /** Raw input strings whose resolved base path exists. */
    valid: string[];
    /** Raw input strings whose resolved base path is missing (ENOENT). */
    missing: string[];
}
/**
 * Stat each input's base path concurrently; return entries split by existence.
 *
 * `splitter` is expected to be {@link parseFindPattern} or
 * {@link parseSearchPath}: both return a `basePath` field that this helper
 * resolves against `cwd` and stats. ENOENT is the only swallowed error — every
 * other stat failure (permission, IO, etc.) propagates so callers do not silently
 * skip paths that exist but are unreadable.
 *
 * Order of `valid` and `missing` follows the input order, so callers can rely
 * on `valid[0]` matching the first surviving user-supplied entry.
 */
export declare function partitionExistingPaths(items: string[], cwd: string, splitter: (item: string) => {
    basePath: string;
}): Promise<PartitionedPaths>;
export declare function resolveReadPath(filePath: string, cwd: string): string;
/**
 * Find a unique workspace entry whose trailing path matches a missing authored path.
 * Returns `null` for no match, ambiguity, timeout, or scan failure.
 */
export declare function findUniqueWorkspaceSuffix(rawPath: string, cwd: string, signal?: AbortSignal): Promise<{
    absolutePath: string;
    displayPath: string;
} | null>;
/** Exercise the post-native cancellation boundary without a real filesystem walk. */
export declare function findUniqueWorkspaceSuffixWithGlobForTest(rawPath: string, cwd: string, signal: AbortSignal | undefined, globImpl: typeof glob): Promise<{
    absolutePath: string;
    displayPath: string;
} | null>;
/** Local file materialized from a readable external URL for shared tool-scope resolution. */
export interface ResolvedExternalSearchUrl {
    /** Absolute or cwd-relative file path to search. */
    sourcePath: string;
    /** True when the materialized file must not mint editable anchors. */
    immutable?: boolean;
}
export interface ToolScopeOptions {
    rawPaths: string[];
    cwd: string;
    /** Verb used in the "Cannot {action} internal URL without a backing file: …" message. */
    internalUrlAction: string;
    /** Collect absolute paths flagged immutable by their internal-URL handler. */
    trackImmutableSources?: boolean;
    /** Honor `exactFilePaths` from {@link resolveExplicitSearchPaths} (search-only). */
    surfaceExactFilePaths?: boolean;
    /** Fan plain-file entries out into per-target scans instead of folding them
     * into a directory walk's glob union (search-only: the caller must dedupe
     * matches from overlapping targets). */
    fanOutFileTargets?: boolean;
    /** Extra hint appended to "Path not found" when stat fails and the user supplied multiple paths. */
    multipathStatHint?: string;
    /** Calling session's settings — forwarded to the internal-URL router so caller-aware handlers (issue://, pr://) honor it. */
    settings?: unknown;
    /** Caller's abort signal — forwarded to the internal-URL router. */
    signal?: AbortSignal;
    /** Calling session's `local://` root mapping — pins resolutions to the calling session. */
    localProtocolOptions?: LocalProtocolOptions;
    /** Calling session's loaded skills — lets skill:// resolve without process-global state. */
    skills?: readonly Skill[];
    /** Materialize readable external URLs to local text files before scope derivation. */
    resolveExternalUrl?: (rawPath: string) => Promise<ResolvedExternalSearchUrl | undefined>;
}
export interface ToolScopeResolution {
    searchPath: string;
    scopePath: string;
    globFilter: string | undefined;
    isDirectory: boolean;
    multiTargets?: ResolvedSearchTarget[];
    exactFilePaths?: string[];
    missingPaths: string[];
    immutableSourcePaths: Set<string>;
}
/**
 * Shared path-input pipeline for `search`, `ast_grep`, and `ast_edit`:
 *  1. normalize + reject empty paths,
 *  2. resolve internal URLs through {@link InternalUrlRouter} to backing files,
 *  3. partition existing vs missing when multiple paths are supplied,
 *  4. derive a single search base path / glob, or a multi-target list,
 *  5. stat the resolved base path so callers can branch on directory vs file scope.
 */
export declare function resolveToolSearchScope(opts: ToolScopeOptions): Promise<ToolScopeResolution>;
export {};
