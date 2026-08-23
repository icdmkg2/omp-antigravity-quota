import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { FetchImpl } from "@oh-my-pi/pi-ai";
import { type Component } from "@oh-my-pi/pi-tui";
import type { Settings } from "../config/settings.js";
import type { RenderResultOptions } from "../extensibility/custom-tools/types.js";
import { type Theme } from "../modes/theme/theme.js";
import type { ToolSession } from "../sdk.js";
import type { AgentStorage } from "../session/agent-storage.js";
import { type OutputMeta } from "./output-meta.js";
import { type LineRange } from "./path-utils.js";
export interface ParsedReadUrlTarget {
    path: string;
    raw: boolean;
    offset?: number;
    limit?: number;
    /** Populated only when the selector carries 2+ ranges. Single-range stays on offset/limit. */
    ranges?: readonly LineRange[];
}
export declare function parseReadUrlTarget(readPath: string): ParsedReadUrlTarget | null;
/** Reader backends for {@link renderHtmlToText}, in default priority order. */
export type FetchProvider = "native" | "trafilatura" | "lynx" | "parallel" | "jina";
/**
 * Render HTML to markdown by trying reader backends in priority order: native
 * (in-process), trafilatura, lynx, Parallel, then Jina. The `providers.fetch`
 * setting picks the order — `auto` uses the default above; any specific backend
 * is tried first, then the remaining backends as fallbacks. Every backend's
 * output must clear the same quality gate (>100 non-whitespace chars and not
 * {@link isLowQualityOutput}) before it is accepted, otherwise the next backend
 * is tried.
 *
 * The overall `timeout` budget bounds the whole call; remote backends (Parallel,
 * Jina) are additionally capped at `REMOTE_READER_MAX_MS` so a hung endpoint
 * cannot starve later renderers — especially the purely-local native converter,
 * which always works on already-loaded HTML. Only a real `userSignal`
 * cancellation aborts the chain (#1449).
 */
export declare function renderHtmlToText(url: string, html: string, timeout: number, settings: Settings, userSignal: AbortSignal | undefined, storage: AgentStorage | null, fetchOverride?: FetchImpl): Promise<{
    content: string;
    ok: boolean;
    method: string;
}>;
interface FetchImagePayload {
    data: string;
    mimeType: string;
}
export interface ReadUrlToolDetails {
    kind: "url";
    url: string;
    finalUrl: string;
    contentType: string;
    method: string;
    truncated: boolean;
    notes: string[];
    meta?: OutputMeta;
}
interface ReadUrlEntry {
    artifactId?: string;
    artifactPath?: string;
    details: ReadUrlToolDetails;
    image?: FetchImagePayload;
    output: string;
    content: string;
}
/** Fetch and render a URL for a read or search operation. */
export declare function fetchReadUrl(session: ToolSession, params: {
    path: string;
    raw?: boolean;
}, signal?: AbortSignal, options?: {
    ensureArtifact?: boolean;
}): Promise<ReadUrlEntry>;
/** Materialize rendered URL body text to a local file for tools that require filesystem paths. */
export declare function materializeReadUrlToFile(session: ToolSession, params: {
    path: string;
    raw?: boolean;
}, signal?: AbortSignal): Promise<{
    path: string;
    details: ReadUrlToolDetails;
}>;
export declare function executeReadUrl(session: ToolSession, params: {
    path: string;
    raw?: boolean;
}, signal?: AbortSignal): Promise<AgentToolResult<ReadUrlToolDetails>>;
/** Render URL read call (URL preview) */
export declare function renderReadUrlCall(args: {
    path?: string;
    url?: string;
    raw?: boolean;
}, _options: RenderResultOptions, uiTheme?: Theme): Component;
/** Render URL read result with tree-based layout */
export declare function renderReadUrlResult(result: {
    content: Array<{
        type: string;
        text?: string;
    }>;
    details?: ReadUrlToolDetails;
    isError?: boolean;
}, options: RenderResultOptions, uiTheme?: Theme): Component;
export {};
