export type ReadableFormat = "text" | "markdown";
export interface ReadableResult {
    url: string;
    title?: string;
    byline?: string;
    excerpt?: string;
    contentLength: number;
    text?: string;
    markdown?: string;
}
/**
 * Extract readable content from raw HTML.
 * Tries Readability (article-isolation scoring) first, then falls back to a
 * CSS selector chain over the same pre-parsed DOM. Returns null if neither
 * path yields usable content.
 */
export declare function extractReadableFromHtml(html: string, url: string, format: ReadableFormat): Promise<ReadableResult | null>;
