import type { AgentTool, AgentToolContext, AgentToolResult, AgentToolUpdateCallback } from "@oh-my-pi/pi-agent-core";
import type { ToolExample } from "@oh-my-pi/pi-ai";
import type { ToolSession } from "../sdk.js";
import { type BrowserKindTag } from "./browser/registry.js";
import type { Observation, ScreenshotResult } from "./browser/tab-protocol.js";
import type { OutputMeta } from "./output-meta.js";
export { type AriaSnapshotOptions, buildAriaSnapshotScript, parseAriaRefSelector, } from "./browser/aria/aria-snapshot.js";
export { cmuxSnapshotToObservation, mapWaitUntil, resolveCmuxKind, serializeEval } from "./browser/cmux/rpc.js";
export { CmuxSocketClient } from "./browser/cmux/socket-client.js";
export { extractReadableFromHtml, type ReadableFormat, type ReadableResult } from "./browser/readable.js";
export { DEFAULT_RELAY_URL, type RelayKind, resolveRelayKind } from "./browser/relay/kind.js";
export type { Observation, ObservationEntry } from "./browser/tab-protocol.js";
declare const browserSchema: import("@oh-my-pi/omptype").FluentType<{
    action: "close" | "open" | "run";
    all?: boolean | undefined;
    app?: {
        args?: string[] | undefined;
        cdp_url?: string | undefined;
        path?: string | undefined;
        relay?: boolean | undefined;
        target?: string | undefined;
    } | undefined;
    code?: string | undefined;
    dialogs?: "accept" | "dismiss" | undefined;
    kill?: boolean | undefined;
    name?: string | undefined;
    timeout?: number | undefined;
    url?: string | undefined;
    viewport?: {
        height: number;
        scale?: number | undefined;
        width: number;
    } | undefined;
    wait_until?: "domcontentloaded" | "load" | "networkidle0" | "networkidle2" | undefined;
}, {
    action: "close" | "open" | "run";
    all?: boolean | undefined;
    app?: {
        args?: string[] | undefined;
        cdp_url?: string | undefined;
        path?: string | undefined;
        relay?: boolean | undefined;
        target?: string | undefined;
    } | undefined;
    code?: string | undefined;
    dialogs?: "accept" | "dismiss" | undefined;
    kill?: boolean | undefined;
    name?: string | undefined;
    timeout?: number | undefined;
    url?: string | undefined;
    viewport?: {
        height: number;
        scale?: number | undefined;
        width: number;
    } | undefined;
    wait_until?: "domcontentloaded" | "load" | "networkidle0" | "networkidle2" | undefined;
}>;
/** Input schema for the browser tool. */
export type BrowserParams = typeof browserSchema.infer;
/** Details describing a browser tool execution result (for renderers + transcript). */
export interface BrowserToolDetails {
    action: BrowserParams["action"];
    name?: string;
    url?: string;
    browser?: BrowserKindTag;
    viewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number;
    };
    observation?: Observation;
    screenshots?: ScreenshotResult[];
    result?: string;
    meta?: OutputMeta;
}
/**
 * Browser tool: stateful, multi-tab. Three actions:
 * - `open`  → acquire/create a named tab on a browser kind (headless | spawned | connected) and optionally goto a url.
 * - `close` → release a named tab handle (or all handles); attached/relay pages remain open, and spawned pages remain unless killed.
 * - `run`   → execute JS code against an existing tab with `page`/`browser`/`tab` helpers in scope.
 */
export declare class BrowserTool implements AgentTool<typeof browserSchema, BrowserToolDetails> {
    #private;
    private readonly session;
    readonly name = "browser";
    readonly approval: "exec";
    readonly formatApprovalDetails: (args: unknown) => string[];
    readonly label = "Browser";
    readonly loadMode = "discoverable";
    readonly summary = "Control a headless browser to navigate and interact with web pages";
    readonly parameters: import("@oh-my-pi/omptype").FluentType<{
        action: "close" | "open" | "run";
        all?: boolean | undefined;
        app?: {
            args?: string[] | undefined;
            cdp_url?: string | undefined;
            path?: string | undefined;
            relay?: boolean | undefined;
            target?: string | undefined;
        } | undefined;
        code?: string | undefined;
        dialogs?: "accept" | "dismiss" | undefined;
        kill?: boolean | undefined;
        name?: string | undefined;
        timeout?: number | undefined;
        url?: string | undefined;
        viewport?: {
            height: number;
            scale?: number | undefined;
            width: number;
        } | undefined;
        wait_until?: "domcontentloaded" | "load" | "networkidle0" | "networkidle2" | undefined;
    }, {
        action: "close" | "open" | "run";
        all?: boolean | undefined;
        app?: {
            args?: string[] | undefined;
            cdp_url?: string | undefined;
            path?: string | undefined;
            relay?: boolean | undefined;
            target?: string | undefined;
        } | undefined;
        code?: string | undefined;
        dialogs?: "accept" | "dismiss" | undefined;
        kill?: boolean | undefined;
        name?: string | undefined;
        timeout?: number | undefined;
        url?: string | undefined;
        viewport?: {
            height: number;
            scale?: number | undefined;
            width: number;
        } | undefined;
        wait_until?: "domcontentloaded" | "load" | "networkidle0" | "networkidle2" | undefined;
    }>;
    readonly strict = true;
    readonly examples: readonly ToolExample<typeof browserSchema.infer>[];
    constructor(session: ToolSession);
    get description(): string;
    /** Restart browser to apply mode changes (e.g. headless toggle). Drops only headless browsers. */
    restartForModeChange(): Promise<void>;
    execute(_toolCallId: string, params: BrowserParams, signal?: AbortSignal, _onUpdate?: AgentToolUpdateCallback<BrowserToolDetails>, _ctx?: AgentToolContext): Promise<AgentToolResult<BrowserToolDetails>>;
}
