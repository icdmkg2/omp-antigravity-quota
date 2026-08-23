import type { ConversionResult, Converter, StreamInfo } from "../../types.js";
/** Converts PDF buffers to Markdown through the native `pdf-inspector` bridge. */
export declare class PdfConverter implements Converter {
    name: string;
    accepts(streamInfo: StreamInfo): boolean;
    convert(input: Buffer, _streamInfo: StreamInfo): Promise<ConversionResult>;
}
