/**
 * Shared rendering for extension/hook custom message frames.
 *
 * Both `CustomMessageComponent` and `HookMessageComponent` wrap a
 * `Spacer(1) + Box` layout, try a user-supplied renderer first, and fall
 * back to a label + markdown body when the renderer returns nothing or
 * throws. The only meaningful difference is that hook messages collapse to
 * the first N lines when not expanded; extension messages render in full.
 */
import type { TextContent } from "@oh-my-pi/pi-ai";
import type { Box, Component } from "@oh-my-pi/pi-tui";
import { type Theme, type ThemeColor } from "../../modes/theme/theme.js";
/** Message shape consumed by the shared frame. */
export interface FramedMessage {
    customType: string;
    content: string | (TextContent | {
        type: string;
    })[];
}
/**
 * Callable signature shared by `MessageRenderer` (extensions) and
 * `HookMessageRenderer` (hooks). Both narrow `message` to their own type;
 * this signature is the structural intersection callers can hand off here.
 */
export type FramedRenderer<M extends FramedMessage> = (message: M, options: {
    expanded: boolean;
}, theme: Theme) => Component | undefined;
export interface RebuildFrameOptions<M extends FramedMessage> {
    message: M;
    box: Box;
    expanded: boolean;
    /** Icon glyph shown before the customType in the default header (e.g. a hook/extension icon). */
    icon?: string;
    /** Hide the default type header while retaining the message body. */
    hideHeader?: boolean;
    /** Semantic color for the outline, defaulting to the muted border. */
    borderColor?: ThemeColor;
    /** Collapse the markdown body to this many lines when `expanded` is false. Omit to never collapse. */
    collapseAfterLines?: number;
    customRenderer?: FramedRenderer<M>;
}
/**
 * Attempt the custom renderer; on failure or undefined return, populate `box`
 * with the configured outline, optional type header, and markdown body. When
 * the custom renderer succeeds, return its Component so the caller can mount
 * it and skip the default box.
 */
export declare function renderFramedMessage<M extends FramedMessage>(opts: RebuildFrameOptions<M>): Component | undefined;
