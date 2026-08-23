import type { Subprocess } from "bun";
import type { Browser, CDPSession } from "puppeteer-core";
import type { CmuxKind } from "./cmux/rpc.js";
import { CmuxSocketClient } from "./cmux/socket-client.js";
import { type UserAgentOverride } from "./launch.js";
import type { RelayKind } from "./relay/kind.js";
export type PuppeteerBrowserKind = {
    kind: "headless";
    headless: boolean;
} | {
    kind: "spawned";
    path: string;
} | {
    kind: "connected";
    cdpUrl: string;
} | RelayKind;
export type BrowserKind = PuppeteerBrowserKind | CmuxKind;
export type BrowserKindTag = BrowserKind["kind"];
interface BrowserHandleCommon {
    key: string;
    kind: BrowserKind;
    refCount: number;
}
export interface PuppeteerBrowserHandle extends BrowserHandleCommon {
    kind: PuppeteerBrowserKind;
    browser: Browser;
    cdpUrl?: string;
    pid?: number;
    /** OMP-owned temp Chromium profile directory removed on dispose (process-local headless launches). */
    userDataDir?: string;
    /** Broker daemon backing this handle; dispose disconnects instead of closing, kill routes to the broker. */
    sharedDaemon?: {
        name: string;
        projectDir: string;
    };
    subprocess?: Subprocess;
    stealth: {
        browserSession: CDPSession | null;
        override: UserAgentOverride | null;
    };
}
export interface CmuxBrowserHandle extends BrowserHandleCommon {
    kind: CmuxKind;
    client: CmuxSocketClient;
    surface?: string;
}
export type BrowserHandle = PuppeteerBrowserHandle | CmuxBrowserHandle;
/** Controls bounded browser-handle teardown and identifies the owning resource in timeout diagnostics. */
export interface ReleaseBrowserOptions {
    kill: boolean;
    timeoutMs?: number;
    resource?: string;
}
export interface AcquireBrowserOptions {
    cwd: string;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number;
    };
    appArgs?: string[];
    signal?: AbortSignal;
}
export declare function acquireBrowser(kind: BrowserKind, opts: AcquireBrowserOptions): Promise<BrowserHandle>;
export declare function normalizeConnectedCdpUrl(rawCdpUrl: string): string;
export declare function holdBrowser(handle: BrowserHandle): void;
export declare function releaseBrowser(handle: BrowserHandle, opts: ReleaseBrowserOptions): Promise<void>;
/** Test-only accessor for the module-global browsers map. */
export declare function getBrowsersMapForTest(): ReadonlyMap<string, BrowserHandle>;
export {};
