import type { AssistantMessage, ImageContent } from "@oh-my-pi/pi-ai";
import { Container, type ImageBudget } from "@oh-my-pi/pi-tui";
import type { AssistantThinkingRenderer } from "../../extensibility/extensions/types.js";
import { type CacheInvalidation } from "./cache-invalidation-marker.js";
/** Test-only: clear the shared gauge so observations don't leak across cases. */
export declare function resetThinkingSpeedTracker(): void;
/**
 * Component that renders a complete assistant message
 */
export declare class AssistantMessageComponent extends Container {
    #private;
    private hideThinkingBlock;
    private readonly onImageUpdate?;
    private readonly thinkingRenderers;
    private readonly imageBudget?;
    private proseOnlyThinking;
    setTextColorTransform(transform?: (text: string) => string): void;
    constructor(message?: AssistantMessage, hideThinkingBlock?: boolean, onImageUpdate?: (() => void) | undefined, thinkingRenderers?: readonly AssistantThinkingRenderer[], imageBudget?: ImageBudget | undefined, proseOnlyThinking?: boolean);
    /**
     * Show or clear the slim cache-invalidation divider above this turn. Set at
     * `message_end` (live) or during rebuild, once the turn's usage is known and
     * compared against the previous turn's cache footprint. Bumps the transcript
     * block version so the change repaints even after content finalized.
     */
    setCacheInvalidation(info: CacheInvalidation | undefined): void;
    invalidate(): void;
    setHideThinkingBlock(hide: boolean): void;
    setProseOnlyThinking(proseOnly: boolean): void;
    dispose(): void;
    /**
     * Toggle suppression of the inline `Error: …` line while the same error is
     * pinned in the banner above the editor. Re-renders so the change is visible.
     */
    setErrorPinned(pinned: boolean): void;
    /**
     * Expand or collapse the inline turn-ending error block so Ctrl+O
     * (tool-output expansion) can reveal a long provider error's hidden tail.
     * Only re-renders when the current message carries a truncatable error, so
     * toggling expansion across the transcript skips ordinary turns. Works even
     * while the error is pinned in the banner: the inline block is drawn (in full)
     * when expanded so the complete body is reachable without sending a message.
     */
    setExpanded(expanded: boolean): void;
    isTranscriptBlockFinalized(): boolean;
    getTranscriptBlockVersion(): number;
    markTranscriptBlockFinalized(): void;
    applyRetryRecovery(retryRecovery: AssistantMessage["retryRecovery"]): void;
    messagePersistenceKey(): string | undefined;
    /** Toggle rendering for assistant-native and tool-result images. */
    setImagesVisible(visible: boolean): void;
    /** Toggle only images produced by tool results; assistant-native images remain governed by setImagesVisible. */
    setToolResultImagesVisible(visible: boolean): void;
    setToolResultImages(toolCallId: string, images: ImageContent[]): void;
    updateContent(message: AssistantMessage, opts?: {
        transient?: boolean;
    }): void;
}
