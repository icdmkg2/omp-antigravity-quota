export * from "@oh-my-pi/pi-tui";
export { decodePrintableKey as decodeKittyPrintable } from "@oh-my-pi/pi-tui";
/** Report canonical terminal capabilities through the legacy Pi TUI shape. */
export declare function getCapabilities(): {
    images: "kitty" | "iterm2" | null;
    trueColor: boolean;
    hyperlinks: boolean;
};
/**
 * Delete one Kitty graphics image by id, matching the legacy Pi TUI helper.
 *
 * Returns the bare control sequence exactly like upstream Pi: legacy callers
 * (e.g. pi-sprite) apply their own tmux passthrough wrapping, so wrapping here
 * would double-wrap under tmux and the outer terminal would drop the command.
 */
export declare function deleteKittyImage(imageId: number): string;
/** Delete every Kitty graphics image using the legacy Pi TUI bare sequence. */
export declare function deleteAllKittyImages(): string;
