import type { ConversionResult, Converter, StreamInfo } from "../types.js";
/** A text value: bare string/number, or a `{ "#text" }` node when the element carries attributes. */
type XmlText = string | number | {
    "#text"?: string;
};
interface TextRun {
    "a:t"?: XmlText;
}
interface Paragraph {
    "a:r"?: TextRun | TextRun[];
}
interface TextBody {
    "a:p"?: Paragraph | Paragraph[];
}
interface CNvPr {
    "@_name": string;
}
interface Placeholder {
    "@_type": string;
}
interface NvPr {
    "p:ph"?: Placeholder;
}
interface NvSpPr {
    "p:cNvPr"?: CNvPr;
    "p:nvPr"?: NvPr;
}
interface Shape {
    "p:txBody"?: TextBody;
    "p:nvSpPr"?: NvSpPr;
}
interface TableCell {
    "a:txBody"?: TextBody;
}
interface TableRow {
    "a:tc"?: TableCell | TableCell[];
}
interface Table {
    "a:tr"?: TableRow | TableRow[];
}
interface GraphicData {
    "a:tbl"?: Table;
}
interface Graphic {
    "a:graphicData"?: GraphicData;
}
interface GraphicFrame {
    "a:graphic"?: Graphic;
}
export declare class PptxConverter implements Converter {
    name: string;
    accepts(streamInfo: StreamInfo): boolean;
    convert(input: Buffer, streamInfo: StreamInfo): Promise<ConversionResult>;
    extractText(shape: Shape): string;
    extractTable(gf: GraphicFrame): string | null;
}
export {};
