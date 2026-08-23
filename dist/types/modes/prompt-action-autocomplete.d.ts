import { type AutocompleteItem, type AutocompleteProvider, type SlashCommand } from "@oh-my-pi/pi-tui";
import { type KeybindingsManager } from "../config/keybindings.js";
interface PromptActionDefinition {
    id: string;
    label: string;
    description: string;
    keywords: string[];
    execute: (prefix: string) => void;
}
interface PromptActionAutocompleteOptions {
    commands: SlashCommand[];
    basePath: string;
    /** Usage count per command name for frequency-ranked slash completions. */
    commandUsage?: (name: string) => number;
    keybindings: KeybindingsManager;
    copyCurrentLine: () => void;
    copyPrompt: () => void;
    undo: (prefix: string) => void;
    moveCursorToMessageEnd: () => void;
    moveCursorToMessageStart: () => void;
    moveCursorToLineStart: () => void;
    moveCursorToLineEnd: () => void;
}
export declare class PromptActionAutocompleteProvider implements AutocompleteProvider {
    #private;
    constructor(commands: SlashCommand[], basePath: string, actions: PromptActionDefinition[], commandUsage?: (name: string) => number);
    getSuggestions(lines: string[], cursorLine: number, cursorCol: number, signal?: AbortSignal): Promise<{
        items: AutocompleteItem[];
        prefix: string;
    } | null>;
    applyCompletion(lines: string[], cursorLine: number, cursorCol: number, item: AutocompleteItem, prefix: string): {
        lines: string[];
        cursorLine: number;
        cursorCol: number;
        onApplied?: () => void;
    };
    getInlineHint(lines: string[], cursorLine: number, cursorCol: number): string | null;
    trySyncSlashCompletion(textBeforeCursor: string): {
        items: AutocompleteItem[];
        prefix: string;
    } | null;
    trySyncInlineReplace(textBeforeCursor: string): {
        replaceLen: number;
        insert: string;
    } | null;
}
export declare function createPromptActionAutocompleteProvider(options: PromptActionAutocompleteOptions): PromptActionAutocompleteProvider;
export {};
