/**
 * Filesystem workspace of a session: one current/default directory plus a
 * non-empty ordered list of workspace directories.
 *
 * `cwd` remains the default directory for relative-path resolution and
 * backward compatibility. `directories` always contains `cwd` first, followed
 * by any additional directories in their supplied order (deduplicated).
 * Directory order is stable but carries no semantic hierarchy.
 *
 * Workspace directories come from the platform (ACP/editor), CLI, or config —
 * never from filesystem walk-up discovery.
 */
export interface SessionWorkspace {
    /** Current/default directory for compatibility and relative path resolution. */
    cwd: string;
    /** Non-empty ordered list of absolute normalized directories; `cwd` is always first. */
    directories: string[];
}
/** Expand a leading `~`/`~/` and resolve to an absolute path (relative input resolves against `base`). */
export declare function normalizeWorkspaceDirectory(directory: string, base?: string): string;
/**
 * Build a normalized {@link SessionWorkspace} from a cwd and optional
 * additional directories. Additional entries are normalized (relative entries
 * resolve against the normalized cwd), deduplicated, and appended after `cwd`
 * preserving their supplied order.
 */
export declare function normalizeSessionWorkspace(args: {
    cwd: string;
    directories?: string[];
}): SessionWorkspace;
/** The workspace directories beyond `cwd`, in order (ACP `additionalDirectories` shape). */
export declare function additionalWorkspaceDirectories(workspace: SessionWorkspace): string[];
