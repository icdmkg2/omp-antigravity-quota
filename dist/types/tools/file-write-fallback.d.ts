import type { BunFile } from "bun";
import type { ExtensionContext } from "../extensibility/extensions/types.js";
/** A denied write, captured for a registered fallback to retry through a privileged channel. */
export interface FileWriteFallbackRequest {
    /**
     * Absolute, symlink-resolved path to write the bytes to.
     *
     * This is where the failed in-process write would itself have landed, which is
     * not necessarily the path the tool was given: `open` follows every component,
     * so a link anywhere in that path redirects the bytes. Resolving it here is
     * what lets a handler's allowlist see the real destination instead of a
     * lexically innocent path, so a handler MUST treat this as authoritative and
     * MUST NOT re-derive the target from anything else.
     */
    dst: string;
    /**
     * Session the denied write was issued from, or `undefined` when the mutation
     * did not happen inside a tool call (an external `applyPatch` caller, a test).
     *
     * The registry is process-wide, so a handler can be consulted for a write from
     * a session other than the one whose extension registered it. Compare this with
     * `ctx.sessionManager.getSessionId()` to tell the two apart — a handler that
     * prompts through `ctx.ui` needs to, since that UI belongs to ITS session and
     * not necessarily to the one being asked about.
     */
    sessionId: string | undefined;
    /** The exact bytes the tool intended to write. */
    content: string;
    /**
     * The error that proves the write hit a permission boundary. Usually the write's
     * own `EPERM`/`EACCES`/`EROFS`; for a write into a directory the host may not
     * create, the denial raised by creating that directory, in which case `dst`'s
     * parent may not exist yet and the handler is responsible for creating it.
     */
    cause: unknown;
}
/** Extension-authored handler. Return `true` once `content` is durably on disk at `dst`. */
export type FileWriteFallbackHandler = (req: FileWriteFallbackRequest, ctx: ExtensionContext) => Promise<boolean>;
/** A handler already bound to its owning extension's live context. */
type BoundFileWriteFallbackHandler = (req: FileWriteFallbackRequest) => Promise<boolean>;
/** A denied unlink, captured for a registered fallback to perform through a privileged channel. */
export interface FileDeleteFallbackRequest {
    /**
     * Absolute, symlink-resolved path the unlink was denied for.
     *
     * Every component ABOVE the last is resolved, so a handler cannot be walked
     * outside its allowed roots through a link in the path. The last component is
     * deliberately NOT resolved, because `unlink` removes a link itself rather
     * than its target — which is also why this may still name a symlink.
     */
    dst: string;
    /** The `EPERM`/`EACCES`/`EROFS` that proves the unlink hit a permission boundary. */
    cause: unknown;
    /**
     * Whether `dst` was confirmed to be a plain regular file before diverting.
     *
     * `false` means the seam could not establish that, either because the target's
     * own metadata is behind the same boundary that denied the unlink — the common
     * sandbox case, since `unlink` on a directory also reports `EPERM` on Darwin —
     * or because `dst` is a symlink.
     *
     * A handler MUST remove `dst` with a plain unlink. It MUST NOT remove it
     * recursively, and MUST NOT resolve the path first: when this is `false` the
     * target may be a directory, and resolving a symlink would delete whatever it
     * points at instead of the link.
     */
    confirmedFile: boolean;
    /** See {@link FileWriteFallbackRequest.sessionId}. */
    sessionId: string | undefined;
}
/** Extension-authored handler. Return `true` once `dst` is gone from disk. */
export type FileDeleteFallbackHandler = (req: FileDeleteFallbackRequest, ctx: ExtensionContext) => Promise<boolean>;
/** A handler already bound to its owning extension's live context. */
type BoundFileDeleteFallbackHandler = (req: FileDeleteFallbackRequest) => Promise<boolean>;
/** True for `EPERM`, `EACCES`, and `EROFS` — the sandbox-boundary write failures this seam exists for. */
export declare function isPermissionDeniedError(error: unknown): boolean;
/** Whether any fallback is registered. Lets a caller skip work that only this seam needs. */
export declare function hasFileWriteFallback(): boolean;
/**
 * Append a fallback writer, consulted in registration order when a direct write is
 * permission-denied. Returns a disposer that removes this exact registration; the
 * runner calls it on session shutdown so no handler outlives its session.
 */
export declare function addFileWriteFallback(handler: BoundFileWriteFallbackHandler): () => void;
/** Whether any delete fallback is registered. */
export declare function hasFileDeleteFallback(): boolean;
/**
 * Append a fallback deleter, consulted in registration order when a direct unlink is
 * permission-denied. Deliberately a separate registry from
 * {@link addFileWriteFallback}: a write handler brokers `content` to `dst`, and
 * handing it a request with no content would let it "broker" an empty write and
 * truncate the file it was asked to remove. Opting in is explicit for that reason.
 */
export declare function addFileDeleteFallback(handler: BoundFileDeleteFallbackHandler): () => void;
/**
 * Name the session whose tool call is about to run, so a denied mutation inside it
 * can tell a handler where the request came from.
 *
 * Entered once per tool call by `ExtensionToolWrapper` (`extensibility/extensions/
 * wrapper.ts`), which `sdk.ts` puts around the whole tool registry whenever an
 * `ExtensionRunner` exists — so the component that owns the handlers is the one
 * naming its own session, and no caller has to thread an `AgentToolContext`
 * through for attribution to work.
 *
 * That covers the deferred LSP write batch too: a batch id belongs to one
 * assistant turn of one session, and its flush is awaited inside a tool call of
 * that same session, so a write performed during a later call of the group is
 * still attributed to the session that issued it.
 *
 * Deliberately NOT a general "current session" accessor: nothing else enters this
 * scope, so outside a tool call it is empty by design — an external `applyPatch`
 * caller reports `undefined` rather than borrowing someone else's identity.
 */
export declare function withFileMutationSession<T>(sessionId: string | undefined, fn: () => T): T;
/**
 * Remove a file, consulting registered delete fallbacks when the unlink is denied.
 *
 * Unlike the write path there is no masked-`ENOENT` case to see through: nothing is
 * created on the way, so an `ENOENT` here means the file genuinely is not there and
 * must propagate — `edit`'s `REM` turns it into a `NotFoundError`.
 */
export declare function deleteFileWithFallback(dst: string, file?: BunFile): Promise<void>;
export declare function writeFileWithFallback(dst: string, content: string, file?: BunFile): Promise<void>;
export {};
