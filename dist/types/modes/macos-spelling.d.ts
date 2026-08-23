import * as native from "@oh-my-pi/pi-natives";
import type { EditorInlineReplacement, EditorTextAssistProvider, EditorWordReplacements } from "@oh-my-pi/pi-tui/components/editor";
/** Independently switchable macOS prose-assistance features. */
export interface SpellingFeatures {
    typoDetection: boolean;
    autocomplete: boolean;
    autocorrect: boolean;
}
/** Logical source location for one rendered editor segment. */
export interface SpellingDecorationContext {
    editorText: string;
    lines: readonly string[];
    line: number;
    startCol: number;
}
/** Native spelling operations used by {@link MacOSSpellingProvider}. */
export interface SpellingBackend {
    isAvailable(): boolean;
    checkSpelling(text: string): Promise<readonly native.SpellingRange[]>;
    completeWord(text: string, start: number, length: number): Promise<readonly string[]>;
    autocorrectWord(text: string, start: number, length: number): Promise<string | null>;
    spellingGuesses(text: string, start: number, length: number): Promise<readonly string[]>;
}
/**
 * Bridges Apple's spelling service into the editor's separate typo,
 * word-completion, and autocorrection paths.
 */
export declare class MacOSSpellingProvider implements EditorTextAssistProvider {
    #private;
    private readonly backend;
    /** Invoked when an asynchronous spelling result can change rendered output. */
    onUpdate: (() => void) | undefined;
    constructor(backend?: SpellingBackend);
    /** Apply all three independent feature gates and invalidate rendered typo ranges. */
    setFeatures(features: SpellingFeatures): void;
    /** Add red undercurls to misspellings while preserving visible text width. */
    decorateTypos(text: string, context: SpellingDecorationContext, decorate?: (span: string) => string): string;
    /** Return the cached macOS completion suffix for the word ending at the cursor. */
    getWordCompletion(lines: string[], cursorLine: number, cursorCol: number): string | null;
    /** Return the confident macOS correction after a completed prose word. */
    tryAutocorrect(lines: string[], cursorLine: number, cursorCol: number): Promise<EditorInlineReplacement | null>;
    /** Return macOS replacement guesses for the misspelled word at the cursor. */
    getWordReplacements(lines: string[], cursorLine: number, cursorCol: number): Promise<EditorWordReplacements | null>;
}
