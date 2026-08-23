import { Container } from "@oh-my-pi/pi-tui";
/**
 * A persistent error banner pinned above the editor. Unlike the transcript
 * "Error: …" line (which scrolls away as the conversation grows), this stays in
 * the fixed region directly above the input so a turn that ended on a provider
 * error — e.g. Anthropic's "Output blocked by content filtering policy" — cannot
 * be missed. It is cleared when the next turn starts.
 */
export declare class ErrorBannerComponent extends Container {
    constructor(message: string);
}
