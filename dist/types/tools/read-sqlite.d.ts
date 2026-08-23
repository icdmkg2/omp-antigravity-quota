import type { AgentToolResult } from "@oh-my-pi/pi-agent-core";
import type { ToolSession } from "../sdk.js";
import type { ReadToolDetails } from "./read.js";
import { type SuffixMatchCache } from "./read-path-resolution.js";
interface ResolvedSqliteReadPath {
    absolutePath: string;
    sqliteSubPath: string;
    queryString: string;
    suffixResolution?: {
        from: string;
        to: string;
    };
}
export declare function resolveSqliteReadPath(session: ToolSession, readPath: string, suffixCache: SuffixMatchCache, signal?: AbortSignal): Promise<ResolvedSqliteReadPath | null>;
export declare function readSqlite(resolvedSqlitePath: ResolvedSqliteReadPath, signal?: AbortSignal): Promise<AgentToolResult<ReadToolDetails>>;
export {};
