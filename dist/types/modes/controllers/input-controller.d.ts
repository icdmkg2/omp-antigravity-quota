import { type AutocompleteProvider, type SlashCommand } from "@oh-my-pi/pi-tui";
import type { InteractiveModeContext } from "../../modes/types.js";
import { readImageFromClipboard, readMacFileUrlsFromClipboard, readTextFromClipboard } from "../../utils/clipboard.js";
/**
 * Slash commands that may carry secrets in their arguments should never be
 * persisted to history.
 *
 * - /login accepts three callback forms (redirect URL, query string, raw auth
 *   code) — all can contain OAuth code=/state= params.
 * - /join <link> carries a 32-byte room key and optional write token.
 * - /mcp add --token <token> carries a bearer token.
 *
 * The command name is extracted the same way as parseSlashCommand() — splitting
 * on the earliest whitespace or colon — so /login:?code=... is correctly matched.
 */
export declare function shouldSkipHistory(slashText: string): boolean;
export declare class InputController {
    #private;
    private ctx;
    /** Injectable clipboard reads so tests can drive paste flows without a real clipboard. */
    private clipboard;
    constructor(ctx: InteractiveModeContext, 
    /** Injectable clipboard reads so tests can drive paste flows without a real clipboard. */
    clipboard?: {
        readImage: typeof readImageFromClipboard;
        readText: typeof readTextFromClipboard;
        readMacFileUrls?: typeof readMacFileUrlsFromClipboard;
    });
    /** Session-level title starts (user `/skill:` via promptCustomMessage) reuse this UI. */
    notifyTitleGenerationStart(): void;
    /** Return the last full editor snapshot delivered by its change contract. */
    getDraftText(): string;
    setupKeyHandlers(): void;
    setupEditorSubmitHandler(): void;
    handleCtrlC(): void;
    handleCtrlD(): void;
    handleCtrlZ(): void;
    handleDequeue(): void;
    handleRetry(): Promise<void>;
    /** Queue `/queue` input behind an active turn, or start it immediately when idle. */
    handleQueueCommand(text: string): Promise<void>;
    /** Send editor text as a follow-up message (queued behind current stream). */
    handleFollowUp(): Promise<void>;
    restoreQueuedMessagesToEditor(options?: {
        abort?: boolean;
        currentText?: string;
    }): number;
    handleImagePathPaste(path: string): Promise<void>;
    handleImagePaste(): Promise<boolean>;
    handleClipboardTextRawPaste(): Promise<void>;
    /**
     * Editor `onLargePaste` hook: gate a marker-sized paste behind the large-paste menu. Returns
     * `true` to intercept (the editor skips its default `[Paste]` marker) once the paste reaches the
     * configured `paste.largeMenuThreshold` line count; otherwise `false` for default collapse-to-marker
     * behavior. The async menu is fired and forgotten — the editor only needs the synchronous verdict.
     */
    handleLargePaste(text: string, lineCount: number): boolean;
    /**
     * Present the large-paste menu and apply the chosen action: wrap in `<attachment>` tags (collapsed
     * to a `[Paste]` marker that expands on submit), save the text to a file and reference its path so
     * the agent can `read` it on demand, or paste inline. Cancelling (Esc) falls back to the default
     * inline paste marker, so the pasted content is never lost.
     */
    presentLargePasteMenu(text: string, lineCount: number): Promise<void>;
    createAutocompleteProvider(commands: SlashCommand[], basePath: string): AutocompleteProvider;
    /** Copy the current editor line to the system clipboard. */
    handleCopyCurrentLine(): void;
    /** Copy current prompt text to system clipboard. */
    handleCopyPrompt(): void;
    cycleThinkingLevel(): void;
    cycleRoleModel(direction?: "forward" | "backward"): Promise<void>;
    toggleToolOutputExpansion(): void;
    toggleToolActivityVisibility(): void;
    setToolsExpanded(expanded: boolean): void;
    toggleThinkingBlockVisibility(): void;
    openExternalEditor(): Promise<void>;
    registerExtensionShortcuts(): void;
}
