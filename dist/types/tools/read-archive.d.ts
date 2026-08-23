import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "../sdk.js";
import type { ReadToolDetails } from "./read.js";
import { type SuffixMatchCache } from "./read-path-resolution.js";
import { type ParsedSelector } from "./read-selector.js";
interface ResolvedArchiveReadPath {
    absolutePath: string;
    archiveSubPath: string;
    suffixResolution?: {
        from: string;
        to: string;
    };
}
export declare function resolveArchiveReadPath(session: ToolSession, readPath: string, suffixCache: SuffixMatchCache, signal?: AbortSignal): Promise<ResolvedArchiveReadPath | null>;
export declare function readArchive(session: ToolSession, readPath: string, parsedSel: ParsedSelector, resolvedArchivePath: ResolvedArchiveReadPath, signal?: AbortSignal): Promise<AgentToolResult<ReadToolDetails>>;
export {};
