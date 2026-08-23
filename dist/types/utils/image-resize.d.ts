import type { ImageContent } from "@oh-my-pi/pi-ai";
export interface ImageResizeOptions {
    maxWidth?: number;
    maxHeight?: number;
    /** Smallest allowed edge length (px). Inputs below this are scaled up. */
    minDimension?: number;
    maxBytes?: number;
    jpegQuality?: number;
    excludeWebP?: boolean;
}
export interface ResizedImage {
    buffer: Uint8Array;
    mimeType: string;
    originalWidth: number;
    originalHeight: number;
    width: number;
    height: number;
    wasResized: boolean;
    decodeFailed?: boolean;
    get data(): string;
}
/**
 * Resize and recompress an image to fit within the specified max dimensions and file size.
 *
 * Strategy:
 *  1. Probe metadata. If already within all limits, return original.
 *  2. Resize to fit max dimensions and encode at high quality across PNG/JPEG (+ WebP) — return smallest.
 *  3. If still too large, walk a lossy JPEG/WebP quality ladder.
 *  4. If still too large, walk a dimension-scale ladder × quality ladder.
 *  5. If still too large, return the smallest variant produced.
 *
 * Set OMP_NO_WEBP to exclude WebP from encoding (llama.cpp STB doesn't decode it).
 *
 * Backed by `Bun.Image`: a chainable native pipeline that runs decode/transform/encode
 * off the JS thread when the terminal (`.bytes()`) is awaited.
 */
export declare function resizeImage(img: ImageContent, options?: ImageResizeOptions): Promise<ResizedImage>;
/**
 * Format a dimension note for resized images.
 * This helps the model understand the coordinate mapping.
 */
export declare function formatDimensionNote(result: ResizedImage): string | undefined;
