import { JsRuntime } from "../../../eval/js/shared/runtime.js";
import type { ToolSession } from "../../index.js";
import { type AriaSnapshotOptions } from "../aria/aria-snapshot.js";
import { type ReadableFormat } from "../readable.js";
import { RunOutput } from "../run-output.js";
import type { Observation, ReadyInfo, RunResultOk, ScreenshotResult, SessionSnapshot } from "../tab-protocol.js";
import type { CmuxSocketClient } from "./socket-client.js";
interface ScreenshotOptions {
    selector?: string;
    fullPage?: boolean;
    silent?: boolean;
    encoding?: "base64" | "binary";
}
interface ObserveOptions {
    includeAll?: boolean;
    viewportOnly?: boolean;
}
interface RunContext {
    session: SessionSnapshot;
    output: RunOutput;
    screenshots: ScreenshotResult[];
    signal: AbortSignal;
    timeoutMs: number;
}
type WaitUntil = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
type DragTarget = string | {
    readonly x: number;
    readonly y: number;
};
interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface CmuxResponseRecord {
    id: number;
    url: string;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
}
interface ViewportOptions {
    width: number;
    height: number;
    deviceScaleFactor?: number;
}
export interface RunCmuxCodeOptions {
    code: string;
    timeoutMs: number;
    signal?: AbortSignal;
    session: ToolSession;
    snapshot: SessionSnapshot;
}
export declare class CmuxTab {
    #private;
    constructor(opts: {
        client: CmuxSocketClient;
        surfaceId: string;
        url?: string;
        title?: string;
    });
    get surfaceId(): string;
    get page(): CmuxPageFacade;
    get browser(): CmuxBrowserFacade;
    viewport(): ReadyInfo["viewport"];
    setViewport(viewport: ViewportOptions): Promise<void>;
    url(): string;
    title(): Promise<string>;
    readyInfo(viewport?: ReadyInfo["viewport"]): Promise<ReadyInfo>;
    setRunContext(context: RunContext): void;
    clearRunContext(): void;
    goto(url: string, opts?: {
        waitUntil?: WaitUntil;
        timeoutMs?: number;
    }): Promise<void>;
    observe(opts?: ObserveOptions): Promise<Observation>;
    ariaSnapshot(selector?: string, opts?: AriaSnapshotOptions): Promise<string>;
    ref(id: string): Promise<CmuxElementHandle>;
    click(selector: string): Promise<void>;
    dblclick(selector: string): Promise<void>;
    hover(selector: string): Promise<void>;
    focus(selector: string): Promise<void>;
    check(selector: string): Promise<void>;
    uncheck(selector: string): Promise<void>;
    type(selector: string, text: string): Promise<void>;
    fill(selector: string, value: string): Promise<void>;
    press(key: string, opts?: {
        selector?: string;
    }): Promise<void>;
    scroll(dx: number, dy: number): Promise<void>;
    waitFor(selector: string, opts?: {
        timeout?: number;
    }): Promise<CmuxElementHandle>;
    waitForSelector(selector: string, opts?: {
        timeout?: number;
    }): Promise<CmuxElementHandle>;
    evaluate<TResult, TArgs extends unknown[]>(fn: string | ((...args: TArgs) => TResult | Promise<TResult>), ...args: TArgs): Promise<TResult>;
    scrollIntoView(selector: string): Promise<void>;
    select(selector: string, ...values: string[]): Promise<string[]>;
    extract(format?: ReadableFormat): Promise<string>;
    screenshot(opts?: ScreenshotOptions): Promise<string>;
    waitForUrl(pattern: string | RegExp, opts?: {
        timeout?: number;
    }): Promise<string>;
    waitForNavigation(opts?: {
        waitUntil?: WaitUntil;
        timeout?: number;
    }): Promise<null>;
    drag(from: DragTarget, to: DragTarget): Promise<void>;
    uploadFile(selector: string, ...filePaths: string[]): Promise<void>;
    waitForResponse(pattern: string | RegExp | ((response: CmuxResponse) => boolean | Promise<boolean>), opts?: {
        timeout?: number;
    }): Promise<CmuxResponse>;
    id(id: number): Promise<CmuxElementHandle>;
    ensureRuntime(session: SessionSnapshot): JsRuntime;
    elementHandle(selector: string): CmuxElementHandle;
    elementExists(selector: string): Promise<boolean>;
    elementBox(selector: string): Promise<BoundingBox | null>;
    evaluateOnSelector<TResult>(selector: string, source: string, args: unknown[]): Promise<TResult>;
    pageContent(): Promise<string>;
    pageScreenshot(opts?: ScreenshotOptions): Promise<Buffer | string>;
    waitForFunction(fn: string | ((...args: unknown[]) => unknown | Promise<unknown>), opts: {
        timeout?: number;
        polling?: number;
    } | undefined, ...args: unknown[]): Promise<unknown>;
}
declare class CmuxResponse {
    #private;
    constructor(record: CmuxResponseRecord);
    url(): string;
    status(): number;
    statusText(): string;
    headers(): Record<string, string>;
    text(): Promise<string>;
    json(): Promise<unknown>;
}
declare class CmuxElementHandle {
    #private;
    constructor(tab: CmuxTab, selector: string);
    click(): Promise<void>;
    type(text: string): Promise<void>;
    fill(value: string): Promise<void>;
    press(key: string): Promise<void>;
    focus(): Promise<void>;
    hover(): Promise<void>;
    evaluate<TResult, TArgs extends unknown[]>(fn: (element: unknown, ...args: TArgs) => TResult | Promise<TResult>, ...args: TArgs): Promise<TResult>;
    boundingBox(): Promise<BoundingBox | null>;
    uploadFile(...paths: string[]): Promise<void>;
    dispose(): Promise<void>;
}
declare class CmuxLocator {
    #private;
    constructor(tab: CmuxTab, selector: string);
    setTimeout(timeoutMs: number): this;
    click(): Promise<void>;
    fill(value: string): Promise<void>;
    waitHandle(): Promise<CmuxElementHandle>;
}
declare class CmuxPageFacade {
    #private;
    readonly keyboard: {
        press: (key: string) => Promise<void>;
    };
    readonly mouse: {
        wheel: (delta: {
            deltaX?: number;
            deltaY?: number;
        }) => Promise<void>;
        move: (x: number, y: number) => Promise<void>;
        down: () => Promise<void>;
        up: () => Promise<void>;
    };
    constructor(tab: CmuxTab);
    url(): string;
    title(): Promise<string>;
    viewport(): ReadyInfo["viewport"];
    setViewport(viewport: ViewportOptions): Promise<void>;
    goto(url: string, opts?: {
        waitUntil?: WaitUntil;
        timeout?: number;
    }): Promise<{
        url: string;
    }>;
    evaluate<TResult, TArgs extends unknown[]>(fn: string | ((...args: TArgs) => TResult | Promise<TResult>), ...args: TArgs): Promise<TResult>;
    content(): Promise<string>;
    locator(selector: string): CmuxLocator;
    $(selector: string): Promise<CmuxElementHandle | null>;
    waitForSelector(selector: string, opts?: {
        timeout?: number;
    }): Promise<CmuxElementHandle>;
    waitForFunction(fn: string | ((...args: unknown[]) => unknown | Promise<unknown>), opts?: {
        timeout?: number;
        polling?: number;
    }, ...args: unknown[]): Promise<unknown>;
    waitForResponse(pattern: string | RegExp | ((response: CmuxResponse) => boolean | Promise<boolean>), opts?: {
        timeout?: number;
    }): Promise<CmuxResponse>;
    screenshot(opts?: ScreenshotOptions): Promise<Buffer | string>;
}
declare class CmuxBrowserFacade {
    #private;
    connected: boolean;
    constructor(tab: CmuxTab);
    pages(): Promise<CmuxPageFacade[]>;
    version(): Promise<string>;
    wsEndpoint(): string;
    disconnect(): void;
    close(): Promise<void>;
}
export declare function runCmuxCode(tab: CmuxTab, opts: RunCmuxCodeOptions): Promise<RunResultOk>;
export {};
