import { type Component } from "@oh-my-pi/pi-tui";
import type { TreeFilterMode } from "../../config/settings-schema.js";
import type { SessionTreeNode } from "../../session/session-entries.js";
import { OverlayPanel } from "./overlay-box.js";
/** Filter mode for tree display */
type FilterMode = TreeFilterMode;
declare class TreeList implements Component {
    #private;
    private readonly currentLeafId;
    private readonly maxVisibleLines;
    onSelect?: (entryId: string, options: {
        summarize: boolean;
    }) => void;
    onCancel?: () => void;
    onLabelEdit?: (entryId: string, currentLabel: string | undefined) => void;
    constructor(tree: SessionTreeNode[], currentLeafId: string | null, maxVisibleLines: number, initialFilterMode?: FilterMode, initialSelectedId?: string);
    invalidate(): void;
    getSearchQuery(): string;
    getSelectedNode(): SessionTreeNode | undefined;
    updateNodeLabel(entryId: string, label: string | undefined): void;
    render(width: number): readonly string[];
    handleInput(keyData: string): void;
}
/**
 * Component that renders a session tree selector for navigation
 */
export declare class TreeSelectorComponent extends OverlayPanel {
    #private;
    private readonly onLabelChangeCallback?;
    constructor(tree: SessionTreeNode[], currentLeafId: string | null, terminalHeight: number, onSelect: (entryId: string, options: {
        summarize: boolean;
    }) => void, onCancel: () => void, onLabelChangeCallback?: ((entryId: string, label: string | undefined) => void) | undefined, initialFilterMode?: FilterMode);
    handleInput(keyData: string): void;
    getTreeList(): TreeList;
}
export {};
