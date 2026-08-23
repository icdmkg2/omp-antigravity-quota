/**
 * ExtensionList - Inventory list with Master Switch and fuzzy search.
 *
 * When viewing a specific provider (not "ALL"), Row #0 is the Master Switch
 * that toggles the entire provider. All items below are dimmed when the
 * master switch is off.
 */
import { type Component } from "@oh-my-pi/pi-tui";
import type { Extension, ExtensionKind } from "./types.js";
export interface ExtensionListCallbacks {
    /** Called when selection changes */
    onSelectionChange?: (extension: Extension | null) => void;
    /** Called when extension is toggled */
    onToggle?: (extensionId: string, enabled: boolean) => void;
    /** Called when master switch is toggled */
    onMasterToggle?: (providerId: string) => void;
    /** Provider ID for master switch (null = no master switch) */
    masterSwitchProvider?: string | null;
}
export declare class ExtensionList implements Component {
    #private;
    private extensions;
    private readonly callbacks;
    constructor(extensions: Extension[], callbacks?: ExtensionListCallbacks, maxVisible?: number);
    setMaxVisible(maxVisible: number): void;
    setExtensions(extensions: Extension[]): void;
    setFocused(focused: boolean): void;
    setMasterSwitchProvider(providerId: string | null): void;
    getSearchQuery(): string;
    resetSelection(): void;
    getSelectedExtension(): Extension | null;
    /** Get the currently selected kind header (for preview purposes) */
    getSelectedKind(): ExtensionKind | null;
    setSearchQuery(query: string): void;
    clearSearch(): void;
    invalidate(): void;
    render(width: number): readonly string[];
    /** Highlight the row under the pointer (null clears). */
    setHoverIndex(index: number | null): void;
    /**
     * Map a 0-based line within this component's render to the absolute list-item
     * index, or null when the line is the search banner, a padding row, or outside
     * the visible window. The first two lines are the search banner and a blank
     * separator; item rows follow, windowed at the current scroll offset.
     */
    hitTest(line: number): number | null;
    /** Wheel notch: move the selection (and the inspector) one row. */
    handleWheel(delta: -1 | 1): void;
    /** Click: select the row under the pointer, or activate it when already selected. */
    handleClick(line: number): void;
    handleInput(data: string): void;
}
