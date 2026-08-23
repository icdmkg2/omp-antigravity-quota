import { type Keybinding, type KeybindingsConfig, type KeyId, KeybindingsManager as TuiKeybindingsManager } from "@oh-my-pi/pi-tui";
/**
 * Application-level keybindings (coding agent specific).
 * Values are always `true` — used for declaration merging.
 */
interface AppKeybindings {
    "app.interrupt": true;
    "app.clear": true;
    "app.exit": true;
    "app.suspend": true;
    "app.display.reset": true;
    "app.thinking.cycle": true;
    "app.thinking.toggle": true;
    "app.model.cycleForward": true;
    "app.model.cycleBackward": true;
    "app.model.select": true;
    "app.model.selectTemporary": true;
    "app.tools.expand": true;
    "app.tools.toggleVisibility": true;
    "app.editor.external": true;
    "app.message.followUp": true;
    "app.retry": true;
    "app.message.dequeue": true;
    "app.clipboard.pasteImage": true;
    "app.clipboard.pasteTextRaw": true;
    "app.clipboard.copyLine": true;
    "app.clipboard.copyPrompt": true;
    "app.agents.hub": true;
    "app.session.new": true;
    "app.session.tree": true;
    "app.session.fork": true;
    "app.session.resume": true;
    "app.session.observe": true;
    "app.session.togglePath": true;
    "app.session.toggleSort": true;
    "app.session.rename": true;
    "app.session.delete": true;
    "app.session.deleteNoninvasive": true;
    "app.tree.foldOrUp": true;
    "app.tree.unfoldOrDown": true;
    "app.plan.toggle": true;
    "app.history.search": true;
    "app.stt.toggle": true;
    "app.live.toggle": true;
}
export type AppKeybinding = keyof AppKeybindings;
declare module "@oh-my-pi/pi-tui" {
    interface Keybindings extends AppKeybindings {
    }
}
/**
 * Resolve default image-paste shortcuts for the current terminal platform.
 */
export declare function getDefaultPasteImageKeys(platform?: NodeJS.Platform): KeyId[];
/**
 * All keybindings definitions: TUI + app-specific.
 */
export declare const KEYBINDINGS: {
    readonly "tui.editor.cursorUp": {
        readonly defaultKeys: "up";
        readonly description: "Move cursor up";
    };
    readonly "tui.editor.cursorDown": {
        readonly defaultKeys: "down";
        readonly description: "Move cursor down";
    };
    readonly "tui.editor.cursorLeft": {
        readonly defaultKeys: ["left", "ctrl+b"];
        readonly description: "Move cursor left";
    };
    readonly "tui.editor.cursorRight": {
        readonly defaultKeys: ["right", "ctrl+f"];
        readonly description: "Move cursor right";
    };
    readonly "tui.editor.cursorWordLeft": {
        readonly defaultKeys: ["alt+left", "ctrl+left", "alt+b"];
        readonly description: "Move cursor word left";
    };
    readonly "tui.editor.cursorWordRight": {
        readonly defaultKeys: ["alt+right", "ctrl+right", "alt+f"];
        readonly description: "Move cursor word right";
    };
    readonly "tui.editor.cursorLineStart": {
        readonly defaultKeys: ["home", "ctrl+a"];
        readonly description: "Move to line start";
    };
    readonly "tui.editor.cursorLineEnd": {
        readonly defaultKeys: ["end", "ctrl+e"];
        readonly description: "Move to line end";
    };
    readonly "tui.editor.jumpForward": {
        readonly defaultKeys: "ctrl+]";
        readonly description: "Jump forward to character";
    };
    readonly "tui.editor.jumpBackward": {
        readonly defaultKeys: "ctrl+alt+]";
        readonly description: "Jump backward to character";
    };
    readonly "tui.editor.pageUp": {
        readonly defaultKeys: "pageUp";
        readonly description: "Page up";
    };
    readonly "tui.editor.pageDown": {
        readonly defaultKeys: "pageDown";
        readonly description: "Page down";
    };
    readonly "tui.editor.deleteCharBackward": {
        readonly defaultKeys: "backspace";
        readonly description: "Delete character backward";
    };
    readonly "tui.editor.deleteCharForward": {
        readonly defaultKeys: ["delete", "ctrl+d"];
        readonly description: "Delete character forward";
    };
    readonly "tui.editor.deleteWordBackward": {
        readonly defaultKeys: ["ctrl+w", "alt+backspace", "ctrl+backspace", "super+alt+backspace"];
        readonly description: "Delete word backward";
    };
    readonly "tui.editor.deleteWordForward": {
        readonly defaultKeys: ["alt+delete", "alt+d", "super+alt+delete", "super+alt+d"];
        readonly description: "Delete word forward";
    };
    readonly "tui.editor.deleteToLineStart": {
        readonly defaultKeys: "ctrl+u";
        readonly description: "Delete to line start";
    };
    readonly "tui.editor.deleteToLineEnd": {
        readonly defaultKeys: "ctrl+k";
        readonly description: "Delete to line end";
    };
    readonly "tui.editor.yank": {
        readonly defaultKeys: "ctrl+y";
        readonly description: "Yank";
    };
    readonly "tui.editor.yankPop": {
        readonly defaultKeys: "alt+y";
        readonly description: "Yank pop";
    };
    readonly "tui.editor.undo": {
        readonly defaultKeys: ["ctrl+-", "ctrl+_"];
        readonly description: "Undo";
    };
    readonly "tui.editor.spellingSuggestions": {
        readonly defaultKeys: "ctrl+.";
        readonly description: "Show spelling replacements";
    };
    readonly "tui.input.newLine": {
        readonly defaultKeys: ["shift+enter", "ctrl+j"];
        readonly description: "Insert newline";
    };
    readonly "tui.input.submit": {
        readonly defaultKeys: "enter";
        readonly description: "Submit input";
    };
    readonly "tui.input.tab": {
        readonly defaultKeys: "tab";
        readonly description: "Tab / autocomplete";
    };
    readonly "tui.input.copy": {
        readonly defaultKeys: "ctrl+c";
        readonly description: "Copy selection";
    };
    readonly "tui.select.up": {
        readonly defaultKeys: "up";
        readonly description: "Move selection up";
    };
    readonly "tui.select.down": {
        readonly defaultKeys: "down";
        readonly description: "Move selection down";
    };
    readonly "tui.select.pageUp": {
        readonly defaultKeys: "pageUp";
        readonly description: "Selection page up";
    };
    readonly "tui.select.pageDown": {
        readonly defaultKeys: "pageDown";
        readonly description: "Selection page down";
    };
    readonly "tui.select.confirm": {
        readonly defaultKeys: "enter";
        readonly description: "Confirm selection";
    };
    readonly "tui.select.cancel": {
        readonly defaultKeys: ["escape", "ctrl+c"];
        readonly description: "Cancel selection";
    };
    readonly "app.interrupt": {
        readonly defaultKeys: "escape";
        readonly description: "Interrupt current operation";
    };
    readonly "app.clear": {
        readonly defaultKeys: "ctrl+c";
        readonly description: "Clear screen or cancel";
    };
    readonly "app.exit": {
        readonly defaultKeys: "ctrl+d";
        readonly description: "Exit application";
    };
    readonly "app.suspend": {
        readonly defaultKeys: "ctrl+z";
        readonly description: "Suspend application";
    };
    readonly "app.display.reset": {
        readonly defaultKeys: "alt+l";
        readonly description: "Reset terminal display";
    };
    readonly "app.thinking.cycle": {
        readonly defaultKeys: "shift+tab";
        readonly description: "Cycle thinking level";
    };
    readonly "app.thinking.toggle": {
        readonly defaultKeys: "ctrl+t";
        readonly description: "Toggle thinking mode";
    };
    readonly "app.model.cycleForward": {
        readonly defaultKeys: "ctrl+p";
        readonly description: "Cycle to next model";
    };
    readonly "app.model.cycleBackward": {
        readonly defaultKeys: "shift+ctrl+p";
        readonly description: "Cycle to previous model";
    };
    readonly "app.model.select": {
        readonly defaultKeys: "alt+m";
        readonly description: "Select model";
    };
    readonly "app.model.selectTemporary": {
        readonly defaultKeys: "alt+p";
        readonly description: "Select temporary model for current session";
    };
    readonly "app.tools.expand": {
        readonly defaultKeys: "ctrl+o";
        readonly description: "Expand tools";
    };
    readonly "app.tools.toggleVisibility": {
        readonly defaultKeys: "ctrl+shift+o";
        readonly description: "Show or hide tool activity";
    };
    readonly "app.editor.external": {
        readonly defaultKeys: "ctrl+g";
        readonly description: "Open external editor";
    };
    readonly "app.message.followUp": {
        readonly defaultKeys: ["ctrl+q", "ctrl+enter"];
        readonly description: "Send follow-up message";
    };
    readonly "app.retry": {
        readonly defaultKeys: "alt+r";
        readonly description: "Retry last failed assistant turn";
    };
    readonly "app.message.dequeue": {
        readonly defaultKeys: ["alt+up", "shift+up"];
        readonly description: "Dequeue message";
    };
    readonly "app.clipboard.pasteImage": {
        readonly defaultKeys: KeyId[];
        readonly description: "Paste image or text from clipboard";
    };
    readonly "app.clipboard.pasteTextRaw": {
        readonly defaultKeys: ["ctrl+shift+v", "alt+shift+v"];
        readonly description: "Paste text from clipboard as raw text (no collapse)";
    };
    readonly "app.clipboard.copyLine": {
        readonly defaultKeys: "alt+shift+l";
        readonly description: "Copy current line";
    };
    readonly "app.clipboard.copyPrompt": {
        readonly defaultKeys: "alt+shift+c";
        readonly description: "Copy prompt";
    };
    readonly "app.session.new": {
        readonly defaultKeys: [];
        readonly description: "Create new session";
    };
    readonly "app.session.tree": {
        readonly defaultKeys: [];
        readonly description: "Show session tree";
    };
    readonly "app.session.fork": {
        readonly defaultKeys: [];
        readonly description: "Fork session";
    };
    readonly "app.session.resume": {
        readonly defaultKeys: [];
        readonly description: "Resume session";
    };
    readonly "app.agents.hub": {
        readonly defaultKeys: "alt+a";
        readonly description: "Open the agent hub";
    };
    readonly "app.session.observe": {
        readonly defaultKeys: "ctrl+s";
        readonly description: "Open the agent hub";
    };
    readonly "app.session.togglePath": {
        readonly defaultKeys: "ctrl+p";
        readonly description: "Toggle session path display";
    };
    readonly "app.session.toggleSort": {
        readonly defaultKeys: "ctrl+s";
        readonly description: "Toggle session sort order";
    };
    readonly "app.session.rename": {
        readonly defaultKeys: "ctrl+r";
        readonly description: "Rename session";
    };
    readonly "app.session.delete": {
        readonly defaultKeys: "ctrl+d";
        readonly description: "Delete session";
    };
    readonly "app.session.deleteNoninvasive": {
        readonly defaultKeys: "ctrl+backspace";
        readonly description: "Delete session (non-invasive)";
    };
    readonly "app.tree.foldOrUp": {
        readonly defaultKeys: ["ctrl+left", "alt+left"];
        readonly description: "Fold or move up";
    };
    readonly "app.tree.unfoldOrDown": {
        readonly defaultKeys: ["ctrl+right", "alt+right"];
        readonly description: "Unfold or move down";
    };
    readonly "app.plan.toggle": {
        readonly defaultKeys: "alt+shift+p";
        readonly description: "Toggle plan mode";
    };
    readonly "app.history.search": {
        readonly defaultKeys: "ctrl+r";
        readonly description: "Search history";
    };
    readonly "app.stt.toggle": {
        readonly defaultKeys: [];
        readonly description: "Toggle speech-to-text (default gesture: hold Space)";
    };
    readonly "app.live.toggle": {
        readonly defaultKeys: "ctrl+l";
        readonly description: "Start or stop live voice mode (/live)";
    };
};
/** Controls inherited keybinding lookup when creating a manager for a named profile. */
export interface KeybindingsCreateOptions {
    /** Default-profile agent directory whose keybindings are merged before profile-specific bindings. */
    inheritedAgentDir?: string;
}
declare function migrateKeybindingsConfigFile(agentDir: string): void;
/**
 * Manages all keybindings (app + TUI).
 * Extends the TUI KeybindingsManager with app-specific functionality.
 */
export declare class KeybindingsManager extends TuiKeybindingsManager {
    #private;
    constructor(userBindings?: KeybindingsConfig, configPath?: string, inheritedConfigPath?: string);
    /**
     * Create from config files at agentDir/keybindings.yml and the default profile.
     * Legacy keybindings.json is migrated to keybindings.yml on load.
     */
    static create(agentDir?: string, options?: KeybindingsCreateOptions): KeybindingsManager;
    /**
     * Create an in-memory keybindings manager without file persistence.
     */
    static inMemory(userBindings?: KeybindingsConfig): KeybindingsManager;
    /**
     * Reload keybindings from the config files.
     */
    reload(): void;
    setUserBindings(userBindings: KeybindingsConfig): void;
    getKeys(keybinding: Keybinding): KeyId[];
    getResolvedBindings(): KeybindingsConfig;
    /**
     * Get the effective resolved bindings (defaults + user overrides).
     */
    getEffectiveConfig(): KeybindingsConfig;
    /**
     * Get display string for a keybinding (e.g., "ctrl+c/escape").
     */
    getDisplayString(keybinding: Keybinding): string;
}
/** Pin the platform used to render modifier labels (test seam). */
export declare function setKeyHintPlatform(platform: NodeJS.Platform | undefined): void;
/** Platform currently used for key-hint rendering. */
export declare function keyHintPlatform(): NodeJS.Platform;
type Modifier = "ctrl" | "shift" | "alt" | "super";
/**
 * Human label for a modifier, using each platform's own key names. `ctrl` and
 * `shift` are the same everywhere; `alt`/`super` become `Option`/`Cmd` on macOS.
 */
export declare function modifierLabel(mod: Modifier, platform?: NodeJS.Platform): string;
export declare function formatKeyHint(key: KeyId): string;
export declare function formatKeyHints(keys: KeyId | KeyId[]): string;
export type { Keybinding, KeybindingsConfig, KeyId };
export { migrateKeybindingsConfigFile };
