import type { ImageContent } from "@oh-my-pi/pi-ai";
import { Editor, type EditorTextDecorationContext, type KeyId, TUI } from "@oh-my-pi/pi-tui";
import type { AppKeybinding } from "../../config/keybindings.js";
import { type SpellingFeatures } from "../macos-spelling.js";
type ConfigurableEditorAction = Extract<AppKeybinding, "app.interrupt" | "app.clear" | "app.exit" | "app.suspend" | "app.display.reset" | "app.thinking.cycle" | "app.model.cycleForward" | "app.model.cycleBackward" | "app.model.select" | "app.model.selectTemporary" | "app.tools.toggleVisibility" | "app.thinking.toggle" | "app.editor.external" | "app.history.search" | "app.message.dequeue" | "app.retry" | "app.clipboard.pasteImage" | "app.clipboard.pasteTextRaw" | "app.clipboard.copyPrompt">;
/** Max gap (ms) between two spaces for the later one to count as OS key auto-repeat rather than a
 *  deliberate press. OS auto-repeat is fast; a deliberate tap (even a fast one) is slower. */
export declare const SPACE_REPEAT_MAX_GAP_MS = 120;
/** Two consecutive inter-space gaps are "mechanical" (machine-driven auto-repeat) when both are
 *  within {@link SPACE_REPEAT_MAX_GAP_MS} and differ by no more than this — an absolute jitter floor
 *  or, for slower repeat rates, {@link SPACE_REPEAT_JITTER_RATIO} of the smaller gap. OS key-repeat
 *  is metronomic; a human smashing the bar is fast but irregular, so its deltas never stay this
 *  steady. */
export declare const SPACE_REPEAT_JITTER_MS = 18;
export declare const SPACE_REPEAT_JITTER_RATIO = 0.35;
/** Consecutive mechanical (fast + steady) deltas that confirm the space bar is held and start
 *  recording. Needs a sustained metronomic cadence, so jittery smashing and deliberate taps never
 *  reach it. */
export declare const SPACE_HOLD_MECHANICAL_RUN = 2;
/** Idle gap (ms) after the last repeated space that counts as the space bar being released, ending
 *  the push-to-talk recording. Must comfortably exceed the OS key-repeat interval. */
export declare const SPACE_HOLD_RELEASE_MS = 250;
/**
 * Extract image-or-other file paths from plain (un-bracketed) clipboard text.
 * Mirrors {@link extractBracketedPastePaths} for terminals/handlers that
 * already stripped the `\x1b[200~`…`\x1b[201~` markers (e.g. clipboard text
 * read directly via `pbpaste`/PowerShell).
 */
export declare function extractPastePathsFromText(text: string): string[] | undefined;
/**
 * Same shape as {@link extractBracketedImagePastePaths} but operates on a
 * payload that has already been stripped of the `\x1b[200~` / `\x1b[201~`
 * markers — used by the assembled-paste router in {@link CustomEditor.handleInput}
 * so split bracketed pastes get the same image-path detection as single-chunk ones.
 *
 * When the segment splitter fails (an unescaped space in a real path breaks
 * its every-segment-is-a-path invariant), falls back to
 * {@link extractWholeTextImagePath}, so a dropped macOS screenshot
 * (`Screenshot 2026-06-25 at 1.23.45 PM.png`) attaches as an image instead of
 * degrading to literal text (#6578).
 */
export declare function extractImagePastePathsFromText(text: string): string[] | undefined;
export declare function extractBracketedPastePaths(data: string): string[] | undefined;
export declare function extractBracketedImagePastePaths(data: string): string[] | undefined;
export declare function extractBracketedImagePastePath(data: string): string | undefined;
/**
 * Return a single image file path when `text` is exactly one explicit path
 * pointing at a supported image extension (`.png`, `.jpg`/`.jpeg`, `.gif`,
 * `.webp`). Used by the keybind-driven clipboard image paste path so a
 * clipboard whose only payload is an image file (e.g. Finder `Cmd+C` on
 * macOS) attaches the image instead of pasting the path as literal text.
 *
 * Two-stage detection:
 *
 * 1. Splitter pass (shared with the bracketed-paste handler) — handles
 *    quoted paths, shell-escaped spaces, and unambiguous single tokens.
 *    Returns the single image path when it parses cleanly; explicitly
 *    returns `undefined` when the splitter found multiple segments (so
 *    ambiguous multi-path clipboard text like `/tmp/a.png /tmp/b.png`
 *    still falls through to the text fallback instead of being mis-loaded
 *    as one giant path).
 * 2. {@link extractWholeTextImagePath} — only reached when the splitter
 *    failed (every segment must look like an explicit path; an unescaped
 *    space in a real path breaks that). This is what recovers macOS
 *    screenshot filenames like
 *    `/Users/me/Desktop/Screenshot 2026-06-25 at 1.23.45 PM.png`.
 */
export declare function extractImagePathFromText(text: string): string | undefined;
/** A large text paste staged as a composer chip. `content` feeds the band card's snippet and
 *  captions; the submit-time expansion (verbatim content or a wrapped block) lives in the
 *  editor's atom table under `label`. */
export interface TextAttachment {
    n: number;
    label: string;
    content: string;
    lineCount: number;
    charCount: number;
}
/** One visible composer attachment, in band order (images first, then text pastes). */
export type ComposerChipDescriptor = {
    kind: "image";
    n: number;
    image: ImageContent;
    link: string | undefined;
} | {
    kind: "paste";
    n: number;
    text: TextAttachment;
};
/**
 * Custom editor that handles configurable app-level shortcuts for coding-agent.
 */
export declare class CustomEditor extends Editor {
    #private;
    imageLinks?: readonly (string | undefined)[];
    /** Draft images pasted into the composer, consumed on submit. Co-located with
     *  {@link imageLinks} so every piece of draft-image state lives on the editor. */
    pendingImages: ImageContent[];
    /** Per-image source links (file:// targets) parallel to {@link pendingImages};
     *  `undefined` entries are images without a backing reference yet. */
    pendingImageLinks: (string | undefined)[];
    /** Large text pastes staged as compact chip tokens; expansion lives in the atom table.
     *  Numbered by a per-draft monotonic counter so a deleted chip never recycles its number
     *  (labels key the atom table). */
    pendingTexts: TextAttachment[];
    /** Host-wired producer of per-image `file://` links (session blob store); drives clickable
     *  chip tokens for restored drafts (esc-esc, `/tree`, branch). */
    draftImageLinkMaterializer?: (images: readonly ImageContent[]) => Promise<(string | undefined)[] | undefined>;
    /**
     * The host {@link TUI}, captured when a plugin constructs this editor through
     * the upstream-pi `(tui, theme, keybindings)` convention. Undefined for omp's
     * own `new CustomEditor(theme)` callers (they drive repaints through the
     * interactive-mode wiring instead). Plugins that call `this.tui.requestRender()`
     * in their overrides read it here (issue #4766).
     */
    tui?: TUI;
    /**
     * Accept both the omp constructor convention — `new CustomEditor(theme)` —
     * and the upstream-pi `Editor` convention — `new Editor(tui, theme, keybindings)`
     * — that {@link ExtensionUIContext.setEditorComponent}'s factory contract
     * advertises `(tui, theme, keybindings)`. Plugins written against upstream pi
     * subclass `CustomEditor`/`Editor` and forward `super(tui, theme, keybindings)`;
     * without this shim the `TUI` lands in the `theme` slot and every render throws
     * `undefined is not an object (evaluating 'this.#theme.symbols.boxRound')`
     * (issue #4766). We locate the real {@link EditorTheme} among the args by shape
     * (it carries `symbols`/`borderColor`) rather than by position, and capture a
     * leading {@link TUI} so plugin overrides calling `this.tui.requestRender()`
     * keep working.
     */
    constructor(...args: readonly unknown[]);
    /** Independently configure typo detection, word autocomplete, and autocorrect. */
    setSpellingFeatures(features: SpellingFeatures): void;
    /** Clear the composer draft: optionally commit `historyText` to history, then
     *  reset the editor text and all pending draft-image state. The shared tail of
     *  every "message submitted" path; pass no argument for a plain discard. */
    clearDraft(historyText?: string): void;
    /** Replace the composer draft with a restored historical prompt: re-attaches the message's
     *  images, collapses stored `[Image #N, WxH]` markers back into compact chip tokens (so the
     *  chips band and atomic deletion return), and re-materializes `file://` links so the tokens
     *  are clickable again instead of degrading to dead text (esc-esc branch, `/tree`). */
    setDraft(text: string, images?: readonly ImageContent[]): void;
    /** Set the buffer text with bracketed `[Image #N]` markers collapsed into chip tokens and
     *  registered in the atom table (queued-message dequeue, failed-submit restore). Leaves the
     *  pending image/text state untouched — callers own that. */
    setCollapsedText(text: string): void;
    /** Stage `content` as a text-attachment chip: inserts the compact token at the cursor and
     *  registers `expansion` (default: the content itself) in the atom table for submit. */
    insertTextAttachment(content: string, expansion?: string): void;
    /** Attachments whose chip token (or legacy bracketed marker) is still present in the buffer —
     *  deleting the inline token hides the chip and drops the attachment from the submission. */
    composerChips(): ComposerChipDescriptor[];
    /** Treat image/paste references — compact chip tokens and bracketed markers alike — as
     *  indivisible: a stray backspace deletes the whole token instead of corrupting it. */
    atomicTokenPattern: RegExp;
    /** Magic-keyword shimmer cadence — drives one editor repaint every 70 ms while
     *  a keyword is on screen and the prompt is focused. ~14 frames/s is smooth
     *  without flooding the renderer. */
    static readonly SHIMMER_FRAME_MS = 70;
    /** Time for the gradient to sweep one full cycle across each keyword. */
    static readonly SHIMMER_PERIOD_MS = 1800;
    /** Decorate magic keywords, attachments, and the queue-composer header/list markers.
     *  Queue shorthand reserves its first logical line as a dim `Queueing` label; sequential
     *  item markers use the accent color so separate follow-ups remain visible while composing. */
    decorateText: (text: string, context: EditorTextDecorationContext) => string;
    /** Optional test override for the magic-keyword shimmer gate. */
    magicKeywordsEnabledOverride: boolean | undefined;
    /**
     * Host-owned setting reader. Startup defaults to enabled without loading the
     * settings graph; InteractiveMode replaces this with the live session setting.
     */
    magicKeywordsEnabled: () => boolean;
    /**
     * Late-bound OSC hyperlink renderer. Startup stays plain until the full
     * interactive graph supplies the settings-aware implementation.
     */
    imageReferenceHyperlink: (label: string, index: number, imageLinks: readonly (string | undefined)[] | undefined, renderLabel: (text: string) => string) => string;
    /** Bind the host's render request callback. Idempotent — the host wires this
     *  once after construction (and again after `setEditorComponent` swaps the
     *  editor). Passing `undefined` clears any pending frame. */
    setShimmerRepaintHandler(handler: (() => void) | undefined): void;
    onEscape?: () => void;
    onClear?: () => void;
    onExit?: () => void;
    onDisplayReset?: () => void;
    onCycleThinkingLevel?: () => void;
    onCycleModelForward?: () => void;
    onCycleModelBackward?: () => void;
    onSelectModel?: () => void;
    onToggleToolActivity?: () => void;
    onToggleThinking?: () => void;
    onExternalEditor?: () => void;
    onHistorySearch?: () => void;
    onSuspend?: () => void;
    onSelectModelTemporary?: () => void;
    /** Called when the configured copy-prompt shortcut is pressed. */
    onCopyPrompt?: () => void;
    /** Called when the configured image-paste shortcut is pressed. */
    onPasteImage?: () => Promise<boolean>;
    /** Called when a bracketed paste contains one or more image-file paths. */
    onPasteImagePath?: (path: string) => void | Promise<void>;
    /** Called when the configured raw text-paste shortcut is pressed. */
    onPasteTextRaw?: () => void;
    /** Called when the configured dequeue shortcut is pressed. */
    onDequeue?: () => void;
    /** Called when the configured retry shortcut is pressed. */
    onRetry?: () => void;
    /** Called when Caps Lock is pressed. */
    onCapsLock?: () => void;
    /** Called when left-arrow is pressed while the editor is empty (cursor necessarily at start). */
    onLeftAtStart?: () => void;
    /** Fired when a sustained space-bar hold is recognized — the push-to-talk STT start. The
     *  optimistically-typed spaces have already been deleted by the time this runs. */
    onSpaceHoldStart?: () => void;
    /** Fired when the held space bar is released (detected as an idle gap with no further repeated
     *  spaces) — the push-to-talk STT stop. */
    onSpaceHoldEnd?: () => void;
    /** Gate for the space-hold gesture. Returns false to keep the space bar inserting spaces
     *  normally; wired to `stt.enabled` so disabling STT restores plain space behavior. */
    sttHoldEnabled?: () => boolean;
    setActionKeys(action: ConfigurableEditorAction, keys: KeyId[]): void;
    /**
     * Register a custom key handler. Extensions use this for shortcuts.
     */
    setCustomKeyHandler(key: KeyId, handler: () => void): void;
    /**
     * Remove a custom key handler.
     */
    removeCustomKeyHandler(key: KeyId): void;
    /**
     * Clear all custom key handlers.
     */
    clearCustomKeyHandlers(): void;
    handleInput(data: string): void;
    /**
     * Route a keystroke through the base text-editor pipeline only, skipping the
     * app-level shortcut interception in {@link handleInput} (Agent Hub, model
     * selector, history search, external editor, …). Used when the editor is
     * mounted for draft editing beneath another focused surface — e.g. an Ask
     * dialog opened over a non-empty prompt — so finishing or submitting the
     * draft can never fire an editor-slot shortcut that clears `editorContainer`
     * and orphans the overlay. Only text editing, cursor movement, submission,
     * and the clear action reach the buffer.
     */
    handleDraftEdit(data: string): void;
}
export {};
