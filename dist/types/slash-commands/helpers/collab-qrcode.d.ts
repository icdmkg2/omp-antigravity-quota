import { type Component } from "@oh-my-pi/pi-tui";
/**
 * One-shot transcript block that prints a collab browser-join URL as a
 * scannable QR code. The symbol is encoded once at construction (byte mode,
 * EC level M) and rendered as ANSI half-blocks; on terminals too narrow for
 * the symbol it degrades to a one-line hint pointing at the printed URL.
 */
export declare class CollabQrCodeComponent implements Component {
    #private;
    readonly url: string;
    constructor(url: string);
    render(width: number): readonly string[];
}
