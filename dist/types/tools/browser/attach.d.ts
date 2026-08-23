import type { Browser, Page } from "puppeteer-core";
/**
 * Allocate an unused TCP port on 127.0.0.1 by binding to port 0 and reading
 * back the kernel-assigned port. There's a small race between close and the
 * subsequent bind in the launched app, but Chromium's listener will retry.
 */
export declare function findFreeCdpPort(): Promise<number>;
/**
 * Loopback HTTP/1.1 GET that never routes through a proxy, resolving to the
 * response status code (or null when the endpoint is unreachable, aborted,
 * malformed, or slow past `timeoutMs`).
 *
 * Chrome's DevTools endpoint listens on loopback and speaks plain HTTP/1.1.
 * Both `fetch` and Bun's `node:http` honor `HTTP_PROXY`/`HTTPS_PROXY` and
 * forward even `127.0.0.1` requests to the proxy unless `NO_PROXY` covers them,
 * so a local proxy that 502s internal addresses makes a healthy daemon look
 * dead and the CDP readiness checks tear it down (issue #8567). Talking to the
 * socket over raw TCP sidesteps proxy env entirely.
 */
export declare function probeCdpStatus(url: string, opts: {
    timeoutMs: number;
    signal?: AbortSignal;
}): Promise<number | null>;
/** Poll `${cdpUrl}/json/version` until it responds with 200, with abort + timeout support. */
export declare function waitForCdp(cdpUrl: string, timeoutMs: number, signal?: AbortSignal): Promise<void>;
/**
 * If any running instance of `exe` was launched with `--remote-debugging-port`
 * and that endpoint actually answers, return it so attach can reuse it instead
 * of killing and respawning. Idempotent re-attaches are the common case.
 */
export declare function findReusableCdp(exe: string, signal?: AbortSignal): Promise<{
    cdpUrl: string;
    pid: number;
} | null>;
export declare function shouldPreserveConnectedBrowserFocus(target?: string): boolean;
/**
 * Pick the best page target on an attached browser. Prefer discoverable page
 * targets first so Chromium/Edge attach flows that hide pages from
 * `browser.pages()` can still return a usable tab.
 *
 * `preferVisible` is for attaching to a browser a human is using: among equally
 * usable tabs, take the one that is actually foregrounded rather than whichever
 * target CDP happens to enumerate first.
 */
export declare function pickElectronTarget(browser: Browser, options?: {
    matcher?: string;
    preferVisible?: boolean;
}): Promise<Page>;
/**
 * SIGTERM the process tree, wait briefly, then SIGKILL anything still alive.
 * Single-process variant for our own spawned children.
 */
export declare function gracefulKillTreeOnce(pid: number, gracePeriodMs?: number): Promise<void>;
/**
 * Multi-process variant for attach: find every PID running `executablePath`
 * (single-instance apps may keep an orphan around) and tear them all down.
 */
export declare function killExistingByPath(executablePath: string, signal?: AbortSignal): Promise<number>;
