import type { ImageContent } from "@oh-my-pi/pi-ai";
export interface ProcessedFiles {
    text: string;
    images: ImageContent[];
}
export interface ProcessFileOptions {
    /** Whether to auto-resize images to 2000x2000 max. Default: true */
    autoResizeImages?: boolean;
}
/** Process @file arguments into text, document content, and image attachments */
export declare function processFileArguments(fileArgs: string[], options?: ProcessFileOptions): Promise<ProcessedFiles>;
