import type { GallerySection } from "./gallery-cli.js";
/** Nerd Font family so the gallery's icon glyphs (PUA) render instead of tofu. */
export declare const DEFAULT_SCREENSHOT_FONT = "JetBrainsMono Nerd Font";
export declare const DEFAULT_SCREENSHOT_FONT_SIZE = 18;
export interface GalleryScreenshotOptions {
    /** Gallery render width in columns (matches the ANSI line width). */
    width: number;
    /** VHS `FontFamily`. */
    font?: string;
    /** VHS `FontSize`. */
    fontSize?: number;
    /**
     * Output destination. When omitted, PNGs land in a fresh temp directory.
     * With multiple images the path is suffixed (`name-01.png`, `name-02.png`).
     */
    out?: string;
}
/**
 * Capture the gallery sections as one or more PNGs and return their absolute
 * paths. Tall galleries are split across images so no single capture exceeds
 * the terminal-canvas height limit.
 */
export declare function captureGalleryScreenshots(sections: GallerySection[], options: GalleryScreenshotOptions): Promise<string[]>;
/**
 * Resolve a chunk's PNG path. A single image keeps the bare name (or the exact
 * `out`); multiple images gain a zero-padded `-NN` suffix so they sort and never
 * collide.
 */
export declare function resolveScreenshotOutputPath(out: string | undefined, baseDir: string, index: number, total: number): string;
/**
 * Group whole tool sections into chunks that stay under `rowBudget` rows. A
 * single section larger than the budget gets its own (taller) image rather than
 * being split mid-renderer.
 */
export declare function chunkGallerySections(sections: GallerySection[], rowBudget: number): GallerySection[][];
