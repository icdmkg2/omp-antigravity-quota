/**
 * Hard cap on AGENTS.md files surfaced by `buildWorkspaceTree`. Mirrors the
 * native cap so the system-prompt builder does not need a second pass.
 */
export declare const AGENTS_MD_LIMIT = 200;
export interface DirectoryTree {
    rootPath: string;
    rendered: string;
    truncated: boolean;
    totalLines: number;
}
export interface WorkspaceTree extends DirectoryTree {
    /** AGENTS.md files beneath the root whose rules may apply to subdirectories. */
    agentsMdFiles: string[];
}
export interface BuildDirectoryTreeOptions {
    /** Directory depth below the root to include. Root itself is depth 0. Default: 1. */
    maxDepth?: number;
    /** Per-directory child cap. `null` disables the cap. Default: `null`. */
    perDirLimit?: number | null;
    /** Optional override for the root level. Defaults to `perDirLimit`. */
    rootLimit?: number | null;
    /** Hard rendered line cap. `null` disables. Default: `null`. */
    lineCap?: number | null;
}
export interface BuildWorkspaceTreeOptions {
    /** Abort the native workspace scan after this many milliseconds. */
    timeoutMs?: number;
}
/**
 * Build a generic directory tree using a single native scan. Hidden files are
 * shown, .gitignore is not consulted, and the standard non-source directories
 * (`node_modules`, `.git`, build outputs, caches…) are pruned by the native
 * walker. Used by the read tool's directory-listing path.
 */
export declare function buildDirectoryTree(cwd: string, options?: BuildDirectoryTreeOptions): Promise<DirectoryTree>;
/**
 * Build the workspace tree shown in the system prompt. Returns the rendered
 * tree plus the AGENTS.md files surfaced by the same native walk so callers
 * never need to do a second filesystem scan.
 */
export declare function buildWorkspaceTree(cwd: string, options?: BuildWorkspaceTreeOptions): Promise<WorkspaceTree>;
