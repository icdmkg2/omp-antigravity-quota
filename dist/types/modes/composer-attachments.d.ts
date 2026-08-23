/** Attachment chip kinds staged in the composer: pasted images and large text pastes. */
export type ChipKind = "image" | "paste";
/** Compact atomic composer token for attachment `n` in the active symbol preset. */
export declare function chipLabel(kind: ChipKind, n: number): string;
/** Infers an attachment kind from a chip label emitted by any configured symbol preset. */
export declare function chipLabelKind(label: string): ChipKind;
/** Stable RGB color assigned to attachment `n`; image and paste sequences use different offsets. */
export declare function attachmentRgb(kind: ChipKind, n: number): readonly [number, number, number];
/** ANSI truecolor foreground sequence for the color assigned by {@link attachmentRgb}. */
export declare function attachmentSgr(kind: ChipKind, n: number): string;
/** Matches expanded image and paste markers, including optional marker metadata. */
export declare const PLACEHOLDER_REGEX: RegExp;
/** Matches either an expanded attachment marker or a compact composer chip token. */
export declare const COMPOSER_TOKEN_REGEX: RegExp;
/** Offsets image marker indices, including matching `attachment://` references. */
export declare function shiftImageMarkers(text: string, offset: number): string;
/**
 * Replaces valid expanded image markers with compact tokens and registers each
 * token's original marker as its atomic editor expansion.
 */
export declare function collapseImageMarkers(text: string, imageCount: number, register: (label: string, expansion: string) => void): string;
/**
 * Drops unreferenced images from a submission and densely remaps retained image
 * markers. Returns `null` when no compaction is needed.
 */
export declare function compactImageMarkers(text: string, imageCount: number): {
    text: string;
    keep: number[];
} | null;
/** Attachment kinds understood by placeholder renderers. */
export type PlaceholderKind = "image" | "paste";
/** Rendering callbacks for plain text and parsed attachment references. */
export interface PlaceholderRenderers {
    /** Renders text outside attachment references. */
    renderText: (text: string) => string;
    /** Renders one parsed marker or compact chip token. */
    renderReference: (label: string, kind: PlaceholderKind, index: number, form: "marker" | "chip") => string;
}
/** Renders text while treating expanded markers and compact chips as distinct references. */
export declare function renderPlaceholders(text: string, renderers: PlaceholderRenderers): string;
