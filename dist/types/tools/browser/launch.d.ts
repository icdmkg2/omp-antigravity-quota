import type { Browser, CDPSession, Page, default as Puppeteer, Target } from "puppeteer-core";
export declare const DEFAULT_VIEWPORT: {
    width: number;
    height: number;
    deviceScaleFactor: number;
};
/**
 * Per-CDP-message timeout applied to every puppeteer launch/connect. Set above
 * `TOOL_TIMEOUTS.browser.max` (30s) so the agent-side wall-clock is the canonical
 * limit; this constant only catches genuinely stuck CDP sockets (renderer wedged,
 * connection dropped, etc.).
 */
export declare const BROWSER_PROTOCOL_TIMEOUT_MS = 60000;
export declare function loadPuppeteer(): Promise<typeof Puppeteer>;
export declare function loadPuppeteerInWorker(safeDir: string): Promise<typeof Puppeteer>;
export declare function ensureChromiumExecutable(): Promise<string | undefined>;
/** Options shared by headless Chromium consumers. */
export interface LaunchHeadlessOptions {
    headless: boolean;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number;
    };
    /** Additional Chromium arguments merged with the centralized launch defaults. */
    args?: readonly string[];
    /** Additional exact Puppeteer default arguments to suppress. */
    ignoreDefaultArgs?: readonly string[];
}
/** Result of a headless Chromium launch. */
export interface LaunchHeadlessResult {
    browser: Browser;
    /**
     * OMP-owned temporary Chromium profile directory to remove after the browser
     * process tree exits, or `undefined` when the caller supplied its own
     * `--user-data-dir` (which OMP must not delete).
     */
    userDataDir?: string;
}
/**
 * Base Chromium argv shared by process-local puppeteer launches and the
 * broker-owned shared browser: sandbox/stealth flags, window size, and
 * PUPPETEER_PROXY* env-derived proxy flags.
 */
export declare function buildHeadlessLaunchArgs(viewport: {
    width: number;
    height: number;
}): string[];
export declare function launchHeadlessBrowser(opts: LaunchHeadlessOptions): Promise<LaunchHeadlessResult>;
/** Fully resolved executable and argv for a broker-spawned shared Chromium. */
export interface SharedBrowserLaunchSpec {
    executablePath: string;
    args: string[];
}
/**
 * Resolve the executable and complete argv for a shared Chromium the daemon
 * broker spawns directly (no puppeteer inside the broker). Mirrors
 * `launchHeadlessBrowser` flag assembly — puppeteer's default args minus the
 * stealth-suppressed set — suppresses Puppeteer's unowned startup window, and
 * exposes CDP on an ephemeral port. Returns null when no executable resolves;
 * callers fall back to a process-local launch.
 */
export declare function resolveSharedBrowserLaunchSpec(opts: {
    headless: boolean;
    userDataDir: string;
    viewport?: {
        width: number;
        height: number;
    };
}): Promise<SharedBrowserLaunchSpec | null>;
/**
 * Remove an OMP-owned headless Chromium profile directory, tolerating the brief
 * window on Windows in which Chromium (or an orphaned browser subprocess) still
 * holds the profile lock. The shared temp remover centralizes retry handling
 * for EBUSY/EPERM/ENOTEMPTY; if the directory is still busy afterwards we warn
 * and leave it for a later cleanup pass rather than throwing — a shutdown cleanup
 * failure must never crash the process (issue #7058).
 */
export declare function removeUserDataDir(dir: string): Promise<void>;
export declare function applyViewport(page: Page, viewport?: {
    width: number;
    height: number;
    deviceScaleFactor?: number;
}): Promise<void>;
export interface UserAgentOverride {
    userAgent: string;
    platform: string;
    acceptLanguage: string;
    userAgentMetadata: {
        brands: Array<{
            brand: string;
            version: string;
        }>;
        fullVersion: string;
        fullVersionList: Array<{
            brand: string;
            version: string;
        }>;
        platform: string;
        platformVersion: string;
        architecture: string;
        bitness: string;
        model: string;
        mobile: boolean;
    };
}
export interface UserAgentSession {
    override: UserAgentOverride;
    browserSession: CDPSession | null;
}
/** Builds the browser-page stealth bootstrap source for regression tests. */
export declare function buildStealthInjectionScriptForTest(scripts?: readonly string[]): string;
/** Apply stealth patches + UA override to a headless page. Idempotent within a tab. */
export declare function applyStealthPatches(browser: Browser, page: Page, state: {
    browserSession: CDPSession | null;
    override: UserAgentOverride | null;
}): Promise<void>;
/** Exposes executable candidates for detection tests. */
export declare function systemChromiumCandidatesForTest(platform?: NodeJS.Platform, home?: string, which?: (name: string) => string | null | undefined): string[];
export declare function chromiumExecutableProbeForTest(executablePath: string): Promise<boolean>;
export declare function stealthIgnoreDefaultArgsForTest(executablePath: string | undefined): string[];
export declare function targetSupportsUserAgentOverrideForTest(target: Target): boolean;
export declare function configureUserAgentTargetsForTest(browser: Browser, state: {
    browserSession: CDPSession | null;
    override: UserAgentOverride;
}, targetTimeoutMs?: number): Promise<void>;
