/**
 * Language id for syntax highlighting and UI (icons, read tool), or undefined if unknown.
 */
export declare function getLanguageFromPath(filePath: string): string | undefined;
export declare function isMarkdownPath(filePath: string): boolean;
/**
 * LSP language identifier; falls back to `plaintext`.
 */
export declare function detectLanguageId(filePath: string): string;
