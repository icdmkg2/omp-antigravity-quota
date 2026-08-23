import type { InternalResource, InternalUrl, ProtocolHandler, ResolveContext, UrlCompletion } from "./types.js";
/**
 * Snapshot of memory roots for every registered session, deduped.
 * Each session has its own cwd (possibly a worktree), so subagents and main
 * may see different roots.
 */
export declare function memoryRootsFromRegistry(): string[];
export interface MemoryGlobPattern {
    baseUrl: string;
    globPattern: string;
}
/**
 * Split a memory:// glob at its first wildcard after validating the complete
 * decoded path. The suffix is validated before filesystem globbing so `..`
 * cannot escape a safely resolved base directory.
 */
export declare function splitMemoryGlobPattern(input: string): MemoryGlobPattern;
/**
 * Resolve a memory:// URL to an absolute filesystem path under memory root.
 */
export declare function resolveMemoryUrlToPath(url: InternalUrl, memoryRoot: string): string;
/**
 * Protocol handler for memory:// URLs.
 * Resolves file-backed roots against the calling session cwd when provided.
 * Contextless callers fall back to the live-session registry for legacy
 * cross-session lookups.
 */
export declare class MemoryProtocolHandler implements ProtocolHandler {
    readonly scheme = "memory";
    readonly immutable = true;
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
    complete(_query?: string, context?: ResolveContext): Promise<UrlCompletion[]>;
}
