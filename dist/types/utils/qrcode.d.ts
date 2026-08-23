/**
 * Self-contained QR Code generator (byte mode, versions 1-40, EC levels
 * L/M/Q/H) with a half-block ANSI terminal renderer.
 *
 * Pure TypeScript, zero dependencies: the collab `/collab qrcode` command uses
 * it to print scannable browser-join codes without pulling a runtime QR
 * package into the bundle. The algorithm follows ISO/IEC 18004; the two
 * error-correction tables below are direct transcriptions of that spec.
 */
export type QrEcLevel = "L" | "M" | "Q" | "H";
export interface QrEncodeOptions {
    /** Lowest version to consider (default 1). */
    minVersion?: number;
    /** Highest version to consider (default 40). */
    maxVersion?: number;
    /** Force a mask 0-7; -1 (default) auto-selects the lowest-penalty mask. */
    mask?: number;
}
/**
 * A finished QR symbol: a square grid of dark/light modules plus the chosen
 * version, EC level, and mask. `module(x, y)` is the only access path the
 * renderers need.
 */
export declare class QrCode {
    #private;
    readonly version: number;
    readonly ecLevel: QrEcLevel;
    readonly size: number;
    /** Selected mask pattern (0-7). */
    readonly mask: number;
    private constructor();
    module(x: number, y: number): boolean;
    /** Encode a string in byte mode (UTF-8). Throws if it exceeds version 40. */
    static encodeText(text: string, ecLevel?: QrEcLevel, options?: QrEncodeOptions): QrCode;
    /** Encode raw bytes in byte mode. Throws if they exceed version 40 at this EC level. */
    static encodeBytes(data: Uint8Array, ecLevel?: QrEcLevel, options?: QrEncodeOptions): QrCode;
}
export interface QrRenderOptions {
    /** Quiet-zone width in modules on every side (default 4, per spec). */
    margin?: number;
}
/**
 * Render a QR symbol as ANSI half-block rows: each text row packs two module
 * rows via `▀`/`▄`/`█`, drawn black-on-white so a phone camera reads dark
 * modules as data and the quiet zone as the light margin. The leading margin
 * makes the symbol scannable regardless of the terminal's own background.
 */
export declare function renderQrHalfBlocks(qr: QrCode, options?: QrRenderOptions): string[];
