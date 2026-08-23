import { Container, type ImageBudget, type TextSizingScale } from "@oh-my-pi/pi-tui";
/**
 * Encode raw 8-bit RGB pixels (`width * height * 3` bytes, row-major) as a PNG
 * (color type 2, no interlacing). The IDAT payload is a real zlib stream from
 * {@link zlib.deflateSync}, so the output is a fully valid PNG that every image
 * protocol — including Sixel, which decodes the bytes natively — accepts.
 */
export declare function encodeRgbPng(width: number, height: number, rgb: Uint8Array): Uint8Array;
export interface SampleImage {
    base64: string;
    mimeType: string;
    dimensions: {
        widthPx: number;
        heightPx: number;
    };
}
/** Build a deterministic RGB gradient PNG (red across, green down, constant blue). */
export declare function buildSampleImage(width?: number, height?: number): SampleImage;
/**
 * OSC 66 text-sizing sample lines, one scaled span per requested scale. Each
 * scaled row is followed by `scale - 1` blank rows that reserve the vertical
 * cells its multi-cell glyphs occupy — mirroring the markdown H1 renderer so
 * the next line does not paint over the bottom of the glyphs.
 */
export declare function buildLargeTextLines(scales?: readonly TextSizingScale[]): string[];
export interface ProtocolProbeOptions {
    image: SampleImage;
    imageBudget: ImageBudget;
    /** Whether the desktop notification was suppressed (e.g. `PI_NOTIFICATIONS=off`). */
    notificationSuppressed: boolean;
}
/**
 * Self-contained panel that renders one sample of every special terminal
 * protocol into the chat transcript.
 */
export declare class ProtocolProbeComponent extends Container {
    constructor(options: ProtocolProbeOptions);
}
