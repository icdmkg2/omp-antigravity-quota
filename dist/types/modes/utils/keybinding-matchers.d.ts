/**
 * Match the coding-agent interrupt key.
 *
 * Interactive mode installs a keybinding manager that exposes `app.interrupt`
 * globally, but some isolated component tests still run with only TUI
 * keybindings registered. In that case, fall back to raw Escape matching.
 */
export declare function matchesAppInterrupt(data: string): boolean;
/** Match the generic selector cancel keybinding. */
export declare function matchesSelectCancel(data: string): boolean;
/** Match the generic selector up-navigation keybinding. */
export declare function matchesSelectUp(data: string): boolean;
/** Match the generic selector down-navigation keybinding. */
export declare function matchesSelectDown(data: string): boolean;
/** Match the generic selector page-up keybinding. */
export declare function matchesSelectPageUp(data: string): boolean;
/** Match the generic selector page-down keybinding. */
export declare function matchesSelectPageDown(data: string): boolean;
export declare function matchesAppExternalEditor(data: string): boolean;
/**
 * Match the "submit multi-line text input" keybinding (`app.message.followUp`).
 *
 * Used by forms where plain Enter inserts a newline and a modified-Enter chord
 * submits — the main editor's follow-up handler, the agent dashboard's new-agent
 * description, and the hook editor's hook-style mode. The keybinding defaults to
 * `["ctrl+q", "ctrl+enter"]` so Windows Terminal (which can't deliver a distinct
 * Ctrl+Enter event; #1903) still has a working chord without user remapping.
 *
 * Also recognizes modifier-tagged LF as Ctrl+Enter only when Ctrl+Enter is an
 * effective follow-up binding.
 */
export declare function matchesAppFollowUp(data: string): boolean;
