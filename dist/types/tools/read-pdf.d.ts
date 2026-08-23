import type { ToolSession } from "../sdk.js";
import type { ScreenshotResult } from "./browser/tab-protocol.js";
/** A legacy PDF image-member path interpreted as a page screenshot request. */
export interface PdfImageReadTarget {
    /** PDF path before the member delimiter. */
    pdfPath: string;
    /** Original member text after the delimiter. */
    member: string;
    /** One-indexed page inferred from names such as `p2-img0.png`; defaults to page 1. */
    page: number;
}
/** Parse a former PDF image-member path as a Chromium page screenshot request. */
export declare function splitPdfImageReadPath(readPath: string): PdfImageReadTarget | null;
/** Render one PDF page through the browser tool's shared headless Chromium. */
export declare function renderPdfPageScreenshot(session: ToolSession, absolutePdfPath: string, page: number, signal?: AbortSignal): Promise<ScreenshotResult>;
