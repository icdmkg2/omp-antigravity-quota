import type { FetchImpl } from "@oh-my-pi/pi-ai";
import type { Page } from "puppeteer-core";
/** HTML plus the response status and final URL after redirects or browser navigation. */
export interface LoadedHtmlPage {
    html: string;
    status: number;
    url: string;
}
interface BrowserFallbackOptions {
    homeUrl?: string;
    ready?: {
        selector: string;
        timeoutMs: number;
    };
    afterNavigation?: (page: Page, signal: AbortSignal) => Promise<void>;
    shouldFallback: (page: LoadedHtmlPage) => boolean;
    attempts?: number;
    retryDelayMs?: number;
}
/** Controls a browser-profiled fetch and its optional headless-browser fallback. */
export interface BrowserFetchOptions {
    fetch?: FetchImpl;
    signal: AbortSignal;
    timeoutMs?: number;
    randomizeHeaders?: boolean;
    referer?: string;
    init?: Omit<RequestInit, "headers" | "signal">;
    headers?: Readonly<Record<string, string>>;
    browser?: BrowserFallbackOptions;
}
/** Fetch with a fresh browser profile, escalating rejected production responses to the stealth browser. */
export declare function browserFetch(url: string, options: BrowserFetchOptions): Promise<LoadedHtmlPage>;
export {};
