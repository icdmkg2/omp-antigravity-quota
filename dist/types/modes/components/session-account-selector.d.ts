import { type SgrMouseEvent } from "@oh-my-pi/pi-tui";
import type { SessionPinAccount } from "../../slash-commands/helpers/session-pin.js";
import { OverlayPanel } from "./overlay-box.js";
/** Account picker opened by `/session pin` for the current model provider. */
export declare class SessionAccountSelectorComponent extends OverlayPanel {
    #private;
    constructor(providerName: string, accounts: readonly SessionPinAccount[], onSelect: (account: SessionPinAccount) => void, onCancel: () => void);
    /** Forward keyboard navigation and cancellation when the wrapper owns focus. */
    handleInput(keyData: string): void;
    /** Route mouse selection through the title rows into the account list. */
    routeMouse(event: SgrMouseEvent, line: number, col: number): void;
}
