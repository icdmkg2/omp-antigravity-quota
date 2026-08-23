import type { ConversionResult, Converter, StreamInfo } from "../types.js";
/** A metadata value: a bare string, or a node carrying `#text` and/or array children. */
type MetaValue = string | MetaNode;
interface MetaNode {
    "#text"?: string;
    [index: number]: MetaValue;
}
export declare class EpubConverter implements Converter {
    name: string;
    accepts(streamInfo: StreamInfo): boolean;
    convert(input: Buffer, _streamInfo: StreamInfo): Promise<ConversionResult>;
    getText(node: MetaValue | undefined): string | undefined;
    getTextArray(node: MetaValue | undefined): (string | undefined)[];
}
export {};
