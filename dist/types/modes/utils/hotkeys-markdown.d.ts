import { type KeybindingsManager } from "../../config/keybindings.js";
export interface HotkeysMarkdownBindings {
    keybindings: Pick<KeybindingsManager, "getDisplayString">;
}
export declare function buildHotkeysMarkdown(bindings: HotkeysMarkdownBindings): string;
