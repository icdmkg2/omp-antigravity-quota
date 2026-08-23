import { type SummaryResult } from "@oh-my-pi/pi-natives";
import type { ToolSession } from "../sdk.js";
import { type ElidedRange } from "./read-format.js";
/**
 * Prose files (Markdown flavors and plain text) skip code-block summarization
 * unless `read.summarize.prose` opts them in.
 */
export declare function isProseSummaryPath(filePath: string): boolean;
export declare function routeReadThroughBridge(session: ToolSession, absolutePath: string, options?: {
    line?: number;
    limit?: number;
}): Promise<string> | undefined;
/**
 * Structural summary of `absolutePath`, or `null` when the file is too large,
 * too short, or unparseable. `diskText` lets a caller that already read the file
 * hand those bytes over instead of forcing a second read; an ACP bridge still
 * wins, since the editor's buffer is the source of truth.
 */
export declare function trySummarize(session: ToolSession, absolutePath: string, fileSize: number, signal?: AbortSignal, diskText?: string): Promise<SummaryResult | null>;
export declare function renderSummary(session: ToolSession, summary: SummaryResult): {
    text: string;
    displayText: string;
    elidedRanges: ElidedRange[];
    elidedLines: number;
};
