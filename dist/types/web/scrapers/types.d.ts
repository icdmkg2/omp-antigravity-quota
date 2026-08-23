import type { AgentStorage } from "../../session/agent-storage.js";
export { formatNumber } from "@oh-my-pi/pi-utils";
export interface RenderResult {
    url: string;
    finalUrl: string;
    contentType: string;
    method: string;
    content: string;
    fetchedAt: string;
    truncated: boolean;
    notes: string[];
}
export type SpecialHandler = (url: string, timeout: number, signal?: AbortSignal, storage?: AgentStorage | null) => Promise<RenderResult | null>;
export declare const MAX_OUTPUT_CHARS = 500000;
export declare const MAX_BYTES: number;
/**
 * Truncate and cleanup output
 */
export declare function finalizeOutput(content: string): {
    content: string;
    truncated: boolean;
};
export interface LoadPageOptions {
    timeout?: number;
    headers?: Record<string, string>;
    method?: string;
    body?: string;
    maxBytes?: number;
    signal?: AbortSignal;
    /**
     * Return true to skip reading the response body for this content type
     * (lowercased mime, no params). The caller is expected to re-fetch the
     * payload as binary; this avoids streaming + decoding huge binaries twice.
     */
    skipBodyForContentType?: (contentType: string) => boolean;
}
export interface LoadPageResult {
    content: string;
    contentType: string;
    finalUrl: string;
    ok: boolean;
    status?: number;
    /** True when the body was cut mid-stream at maxBytes. */
    truncated?: boolean;
    /** Last transport-level error message when ok is false. */
    error?: string;
    /** True when the body read was skipped via skipBodyForContentType. */
    bodySkipped?: boolean;
}
/**
 * Fetch a page with timeout and size limit
 */
export declare function loadPage(url: string, options?: LoadPageOptions): Promise<LoadPageResult>;
/**
 * Convert HTML to markdown using Turndown with GFM support.
 * Strips script/style tags before conversion.
 */
export declare function htmlToBasicMarkdown(html: string): Promise<string>;
/**
 * Build a RenderResult from markdown content. Calls finalizeOutput internally.
 */
export declare function buildResult(md: string, opts: {
    url: string;
    finalUrl?: string;
    method: string;
    fetchedAt: string;
    notes?: string[];
    contentType?: string;
}): RenderResult;
/**
 * Format a date value as YYYY-MM-DD. Returns empty string on invalid input.
 */
export declare function formatIsoDate(value?: string | number | Date): string;
/**
 * Decode common HTML entities.
 */
export declare function decodeHtmlEntities(text: string): string;
/**
 * Format seconds into HH:MM:SS or MM:SS.
 */
export declare function formatMediaDuration(totalSeconds: number): string;
/**
 * Extract localized text, preferring en-US/en.
 */
export type LocalizedText = string | Record<string, string | null> | null | undefined;
export declare function getLocalizedText(value: LocalizedText, defaultLocale?: string): string | undefined;
/**
 * Check if content looks like HTML by inspecting the leading tag.
 */
export declare function looksLikeHtml(content: string): boolean;
