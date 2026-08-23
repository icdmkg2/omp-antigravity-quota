import { type MarkitConversionCacheStatus } from "./markit-cache.js";
/**
 * File extensions markit can actually convert to markdown — one per registered
 * converter in `src/markit/registry.ts` (pdf, docx, pptx, xlsx, epub). This is
 * the single source of truth shared by the read, fetch, and CLI file tools so
 * the advertised set never drifts from the converters that back it. Legacy
 * binary formats (`.doc`, `.ppt`, `.xls`, `.rtf`) are intentionally absent:
 * markit has no converter for them, so routing them here only produced an
 * `Unsupported format` error instead of letting them fall through to the
 * binary-file handling.
 */
export declare const CONVERTIBLE_EXTENSIONS: ReadonlySet<string>;
export interface MarkitConversionResult {
    content: string;
    ok: boolean;
    error?: string;
    cache?: MarkitConversionCacheStatus;
}
export interface MarkitFileConversionOptions {
    /**
     * Directory converters may use for extracted image or diagram files. Since
     * those files are conversion side effects, conversions using this option
     * bypass the markdown cache.
     */
    imageDir?: string;
}
export declare function convertFileWithMarkit(filePath: string, signal?: AbortSignal, options?: MarkitFileConversionOptions): Promise<MarkitConversionResult>;
export declare function convertBufferWithMarkit(buffer: Uint8Array, extension: string, signal?: AbortSignal, options?: {
    useCache?: boolean;
}): Promise<MarkitConversionResult>;
