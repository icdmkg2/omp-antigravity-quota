import type { ElementHandle, Page } from "puppeteer-core";
export interface AriaSnapshotOptions {
    /** Maximum tree depth to render. */
    depth?: number;
    /** Append `[box=x,y,w,h]` bounding boxes to each node. */
    boxes?: boolean;
}
/**
 * Capture a Playwright-format ARIA snapshot of `root` (or the whole document when
 * null). Always runs in `ai` mode so every node carries a `[ref=eN]` id; resolve
 * those to elements with {@link resolveAriaRefHandle}. Ids are renumbered from e1
 * on each call and remain valid until the next snapshot.
 */
export declare function captureAriaSnapshot(page: Page, root: ElementHandle | null, options?: AriaSnapshotOptions): Promise<string>;
/**
 * Resolve a `[ref=eN]` id from the latest snapshot to a live `ElementHandle`, or
 * null when the ref no longer matches any element. Runs in the main world so it
 * sees the `_ariaRef` expandos the snapshot wrote.
 */
export declare function resolveAriaRefHandle(page: Page, ref: string): Promise<ElementHandle | null>;
/**
 * Guard the selector funnels: `tab.click`/`type`/`fill`/`waitFor*`/`scrollIntoView`
 * take string selectors only, but user `run` code routinely passes the ElementHandle
 * from `tab.id(n)`/`tab.ref(...)` (or an un-awaited Promise of one) straight in.
 * Without this the value reaches `.trim()`/`.startsWith()` and throws the opaque,
 * minified `A.trim is not a function` instead of a recovery-naming ToolError.
 */
export declare function assertSelectorString(selector: unknown): asserts selector is string;
/**
 * Recognize a snapshot-ref selector and return the bare ref id, else null.
 * Accepts `aria-ref=e5` (Playwright-MCP style), `aria-ref/e5`, `ariaref/e5`,
 * and bare `e5`/`@e5`: agents copy ids straight out of the snapshot YAML
 * (`[ref=e5]`), so `tab.click("e5")` must act on the ref instead of falling
 * through to a CSS tag selector that can never match. Bare ids are safe to
 * claim here — an eN tag name is not real HTML, and the tab-worker backend's
 * observe ids are numeric (`tab.id(7)`), so refs are its only eN namespace.
 * (The cmux backend parses selectors itself and routes bare `eN` to its own
 * observe ids; either way `eN` means "the id from the last page dump".)
 */
export declare function parseAriaRefSelector(selector: string): string | null;
/**
 * Build a self-contained expression script that runs the vendored bundle in the
 * page and returns the ARIA snapshot YAML. Used by the cmux backend, whose
 * `browser.eval` RPC takes a script string and returns the completion value (it
 * has no ElementHandle to pass in). The script resolves `selector` via
 * `document.querySelector` in-page (CSS selectors only) or falls back to the
 * whole document. Like the puppeteer path it installs nothing on `window`.
 */
export declare function buildAriaSnapshotScript(selector: string | undefined, options?: AriaSnapshotOptions): string;
