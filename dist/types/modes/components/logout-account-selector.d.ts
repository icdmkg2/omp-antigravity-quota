import type { LogoutAccount } from "../../slash-commands/helpers/logout.js";
import { OverlayPanel } from "./overlay-box.js";
/** Account picker for `/logout` after the provider has been selected. */
export declare class LogoutAccountSelectorComponent extends OverlayPanel {
    #private;
    constructor(providerName: string, accounts: LogoutAccount[], onSelect: (account: LogoutAccount) => void, onCancel: () => void);
    handleInput(keyData: string): void;
}
