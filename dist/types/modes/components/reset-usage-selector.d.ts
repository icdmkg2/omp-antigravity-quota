import type { ResetUsageAccount } from "../../slash-commands/helpers/reset-usage.js";
import { OverlayPanel } from "./overlay-box.js";
/**
 * Account picker for `/usage reset`. Lists Codex accounts with their saved
 * rate-limit reset counts; selecting one redeems a reset. Because a reset is a
 * scarce, irreversible credit, Enter requires a second press to confirm.
 */
export declare class ResetUsageSelectorComponent extends OverlayPanel {
    #private;
    constructor(accounts: ResetUsageAccount[], onSelect: (account: ResetUsageAccount) => void, onCancel: () => void);
    handleInput(keyData: string): void;
}
