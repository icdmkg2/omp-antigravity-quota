import type { ConversionResult, Converter, StreamInfo } from "../types.js";
/** A text value: bare string/number, or a `{ "#text" }` node when the element carries attributes. */
type XmlText = string | number | {
    "#text"?: string;
};
interface RichTextRun {
    t?: XmlText;
}
interface StringItem {
    t?: XmlText;
    r?: RichTextRun | RichTextRun[];
}
interface Cell {
    "@_t"?: string;
    v?: string | number;
    is?: StringItem;
}
export declare class XlsxConverter implements Converter {
    name: string;
    accepts(streamInfo: StreamInfo): boolean;
    convert(input: Buffer, _streamInfo: StreamInfo): Promise<ConversionResult>;
    getCellValue(cell: Cell, shared: StringItem[]): string;
    getSharedString(shared: StringItem[], idx: number): string;
}
export {};
