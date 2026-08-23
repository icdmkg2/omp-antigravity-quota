import type { Skill } from "../extensibility/skills.js";
import { type LocalProtocolOptions } from "../internal-urls/index.js";
import type { InternalResource, ResolveContext } from "../internal-urls/types.js";
import type { ImageAttachmentEntry } from "./index.js";
interface InternalUrlResolver {
    canHandle(input: string): boolean;
    resolve(input: string, context?: ResolveContext): Promise<InternalResource>;
}
export interface InternalUrlExpansionOptions {
    skills: readonly Skill[];
    attachments?: readonly ImageAttachmentEntry[];
    noEscape?: boolean;
    internalRouter?: InternalUrlResolver;
    localOptions?: LocalProtocolOptions;
    cwd?: string;
    ensureLocalParentDirs?: boolean;
}
/**
 * Resolve a single skill:// URL to its absolute filesystem path.
 * Does NOT read file content or verify existence.
 */
export declare function resolveSkillUrlToPath(url: string, skills: readonly Skill[]): string;
/**
 * Expand all skill:// URIs in a bash command string.
 * Returns the command with URIs replaced by shell-escaped absolute paths.
 * Throws ToolError if any URI cannot be resolved.
 */
export declare function expandSkillUrls(command: string, skills: readonly Skill[]): string;
/**
 * Expand supported internal URLs in a bash command string to shell-escaped absolute paths.
 * Unresolvable URLs and literal mentions inside larger quoted text are left unchanged.
 * Supported schemes: skill://, agent://, artifact://, memory://, rule://, local://, attachment://
 */
export declare function expandInternalUrls(command: string, options: InternalUrlExpansionOptions): Promise<string>;
export {};
