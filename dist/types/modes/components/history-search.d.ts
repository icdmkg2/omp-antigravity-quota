import type { HistoryStorage } from "../../session/history-storage.js";
import { OverlayPanel } from "./overlay-box.js";
export declare class HistorySearchComponent extends OverlayPanel {
    #private;
    constructor(historyStorage: HistoryStorage, onSelect: (prompt: string) => void, onCancel: () => void);
    handleInput(keyData: string): void;
}
