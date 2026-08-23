/**
 * Parsed git URL information.
 */
export type GitSource = {
    /** Always "git" for git sources */
    type: "git";
    /** Clone URL (always valid for git clone, without ref suffix) */
    repo: string;
    /** Git host domain (e.g., "github.com") */
    host: string;
    /** Repository path (e.g., "user/repo") */
    path: string;
    /** Git ref (branch, tag, commit) if specified */
    ref?: string;
    /** True if ref was specified (package won't be auto-updated) */
    pinned: boolean;
};
/**
 * Parse git source into a GitSource.
 *
 * Rules:
 * - Namespaced shorthand (`github:user/repo`, `gitlab:`, `bitbucket:`,
 *   `codeberg:`, `sourcehut:`/`srht:`) is accepted directly; installers should
 *   normalize entries that bun does not understand natively.
 * - With `git:` prefix, accept generic shorthand forms.
 * - Without `git:` prefix, only accept explicit protocol URLs.
 *
 * Handles:
 * - `github:user/repo[#ref]`-style namespaced shorthand
 * - `git:` prefixed URLs (`git:github.com/user/repo`)
 * - SSH SCP-like URLs (`git:git@github.com:user/repo`)
 * - HTTPS/HTTP/SSH/git protocol URLs
 * - Ref pinning via `@ref` suffix
 *
 * Recognizes GitHub, GitLab, Bitbucket, Sourcehut, and Codeberg natively.
 * Falls back to generic URL parsing for other hosts.
 */
export declare function parseGitUrl(source: string): GitSource | null;
/**
 * Returns true if the spec is parseable as a git source (protocol URL,
 * scp-like SSH wrapped in `git:`, plain `git:` shorthand, or namespaced
 * shorthand like `github:user/repo`). The inverse of "this is an npm spec".
 */
export declare function isGitSpec(spec: string): boolean;
