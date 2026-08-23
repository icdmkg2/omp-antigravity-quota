import type { HTMLElement } from "@oh-my-pi/pi-utils/dom";
import type { ElementHandle, Page } from "puppeteer-core";
import type { Transport } from "./tab-protocol.js";
declare module "puppeteer-core" {
    interface Frame {
        /** Puppeteer's main JavaScript realm, retained by our pinned runtime patch. */
        mainRealm(): Realm;
    }
}
declare global {
    interface Element extends HTMLElement {
    }
    function getComputedStyle(element: Element): Record<string, unknown>;
    var innerWidth: number;
    var innerHeight: number;
    var document: {
        elementFromPoint(x: number, y: number): Element | null;
        readonly visibilityState: "visible" | "hidden";
    };
}
export interface OpTimeouts {
    /** Largest per-op deadline allowed — strictly below the cell budget. */
    budgetBound: number;
    /** Ceiling for quick page reads. */
    quickOpMs: number;
    /** Ceiling for interactive actions + default for waits. */
    actionOpMs: number;
}
/** Resolve the per-op fail-fast ceilings for a given cell budget. */
export declare function resolveOpTimeouts(cellTimeoutMs: number): OpTimeouts;
/** Queue a wheel event without treating a delayed renderer acknowledgement as dispatch failure. */
export declare function dispatchScroll(dispatch: () => Promise<void>, ackTimeoutMs?: number): Promise<void>;
/**
 * Effective timeout for a wait helper (`waitFor*`). A positive explicit `{ timeout }` is
 * honored but clamped to the cell budget so it still fails fast + named; raising the tool
 * `timeout` raises that cap, so a longer budget stays meaningful. No `{ timeout }` → the
 * action ceiling. Puppeteer's `{ timeout: 0 }` / `Infinity` ("disable") maps to the largest
 * bounded wait (`budgetBound`) — the harness never permits an unbounded wait. Garbage input
 * (negative, `NaN`) falls back to the action ceiling rather than the longest wait.
 */
export declare function resolveWaitTimeout(cellTimeoutMs: number, explicit?: number): number;
interface ScreenshotOptions {
    selector?: string;
    fullPage?: boolean;
    silent?: boolean;
}
export declare function normalizeSelector(selector: string): string;
/** ElementHandle enriched with the `fill()` the tool docs promise on handles from `tab.id()`/`tab.ref()`/`tab.waitFor()`. */
export type ActionableHandle = ElementHandle & {
    fill(value: string): Promise<void>;
};
/**
 * Attach `fill()` to a puppeteer ElementHandle before handing it to user code.
 * Puppeteer handles expose `type()` but no `fill()`; the semantics mirror the
 * selector-based `tab.fill()`: focus, clear any existing value, then type.
 */
export declare function toActionableHandle(handle: ElementHandle): ActionableHandle;
/**
 * Hint appended to a selector op's fail-fast timeout, given the selector's current
 * match count: a missing element (consent wall, wrong page) reads differently from
 * a present-but-unactionable one.
 */
export declare function formatSelectorMatchHint(count: number): string;
export interface InflightOp {
    label: string;
    startedAt: number;
}
/** Human-readable label for a screenshot op, used in op tracking + timeout errors. */
export declare function describeScreenshot(opts?: ScreenshotOptions): string;
export declare function preparePageForScreenshot(page: Pick<Page, "bringToFront" | "evaluate">, signal: AbortSignal | undefined, activate: boolean): Promise<void>;
/** Summarize still-running helpers (oldest first) so a cell timeout names what stalled. */
export declare function describeInflight(inflight: Map<number, InflightOp>): string;
export declare class WorkerCore {
    #private;
    constructor(transport: Transport, isolated: boolean);
    nextElementId(): number;
    cacheElement(id: number, handle: ElementHandle): void;
}
export {};
