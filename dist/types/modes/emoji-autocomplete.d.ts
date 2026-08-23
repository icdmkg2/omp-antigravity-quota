import type { AutocompleteItem } from "@oh-my-pi/pi-tui";
export declare function getEmojiSuggestions(textBeforeCursor: string): {
    items: AutocompleteItem[];
    prefix: string;
} | null;
export declare function applyEmojiCompletion(lines: string[], cursorLine: number, cursorCol: number, item: AutocompleteItem, prefix: string): {
    lines: string[];
    cursorLine: number;
    cursorCol: number;
};
export declare function tryEmojiInlineReplace(textBeforeCursor: string): {
    replaceLen: number;
    insert: string;
} | null;
export declare function isEmojiPrefix(prefix: string): boolean;
export declare function expandEmoticons(text: string): string;
