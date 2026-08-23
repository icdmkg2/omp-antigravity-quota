import type { ConversionResult, MarkitOptions, StreamInfo } from "./types.js";
/**
 * In-house document → markdown engine (replaces the `markit-ai` package).
 *
 * Only the document converters omp routes are registered (pdf, docx, pptx,
 * xlsx, epub). The first converter whose `accepts()` returns true and whose
 * `convert()` succeeds wins.
 */
export declare class Markit {
    #private;
    constructor(options?: MarkitOptions);
    convertFile(filePath: string, extra?: {
        imageDir?: string;
    }): Promise<ConversionResult>;
    convert(input: Buffer, streamInfo: StreamInfo): Promise<ConversionResult>;
}
