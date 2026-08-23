import type { InternalResource, InternalUrl, ProtocolHandler, ResolveContext, UrlCompletion } from "./types.js";
/**
 * Validate that a path is safe (no traversal, no absolute paths).
 */
export declare function validateRelativePath(relativePath: string): void;
/**
 * Handler for skill:// URLs.
 */
export declare class SkillProtocolHandler implements ProtocolHandler {
    readonly scheme = "skill";
    readonly immutable = true;
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
    complete(): Promise<UrlCompletion[]>;
}
