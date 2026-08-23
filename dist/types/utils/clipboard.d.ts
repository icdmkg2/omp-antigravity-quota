import { type ClipboardImage } from "@oh-my-pi/pi-natives/clipboard";
/**
 * Read file paths from the macOS pasteboard's `public.file-url` representation.
 *
 * Used to reach the Finder `Cmd+C` pasteboard (which exposes only file URLs,
 * no plain text or raw image bytes) so an image-file clipboard can be attached
 * via {@link handleImagePathPaste} instead of falling through to "Clipboard is
 * empty". Returns an empty array on non-darwin platforms, when AppleScript is
 * unavailable, or when the pasteboard holds no file URLs.
 */
export declare function readMacFileUrlsFromClipboard(): Promise<string[]>;
/**
 * Copy text to the system clipboard.
 *
 * Emits OSC 52 first when running in a real terminal (works over SSH/mosh),
 * then attempts native clipboard copy as best-effort for local sessions.
 * On Termux, tries `termux-clipboard-set` before native.
 *
 * @param text - UTF-8 text to place on the clipboard.
 */
export declare function copyToClipboard(text: string): Promise<void>;
/**
 * Read an image from the system clipboard.
 *
 * Returns null on Termux (no image clipboard support) or when no display
 * server is available (headless/SSH without forwarding). Under native Windows
 * and WSL, the Windows clipboard is also reached through `powershell.exe`
 * because terminal clipboard paths can leave image payloads invisible to the
 * native bridge.
 *
 * @returns A supported image payload or null when no image is available.
 */
export declare function readImageFromClipboard(): Promise<ClipboardImage | null>;
/**
 * Read plain text from the system clipboard.
 */
export declare function readTextFromClipboard(): Promise<string>;
