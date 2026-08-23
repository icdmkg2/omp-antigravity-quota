/**
 * Render file listings with optional icons and metadata.
 */
import type { Theme } from "../modes/theme/theme.js";
export interface FileEntry {
    path: string;
    /** Absolute filesystem path. When provided together with {@link FileListOptions.hyperlinkFn}, the
     * rendered path text is wrapped in an OSC 8 hyperlink. */
    absPath?: string;
    isDirectory?: boolean;
    meta?: string;
}
export interface FileListOptions {
    files: FileEntry[];
    expanded?: boolean;
    maxCollapsed?: number;
    showIcons?: boolean;
    /** When provided, called with the entry's absolute path and the ANSI-styled display string to
     * optionally wrap the path in an OSC 8 hyperlink. Only invoked when {@link FileEntry.absPath} is set. */
    hyperlinkFn?: (absPath: string, displayText: string) => string;
}
export declare function renderFileList(options: FileListOptions, theme: Theme): string[];
