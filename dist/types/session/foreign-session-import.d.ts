import type { ForeignSessionInfo, ForeignSessionSource, ForeignSessionStore } from "./foreign-session-store.js";
import type { SessionInfo } from "./session-listing.js";
import type { SessionManager } from "./session-manager.js";
/** Construct the importer for a supported foreign session source. */
export declare function createForeignSessionStore(source: ForeignSessionSource): ForeignSessionStore;
/** Display name for a supported foreign session source. */
export declare function foreignSessionSourceName(source: ForeignSessionSource): string;
/** Convert lightweight foreign metadata for the existing session picker. */
export declare function foreignSessionInfoToSessionInfo(info: ForeignSessionInfo): SessionInfo;
/** Import and persist one foreign session under a fresh OMP session identity. */
export declare function persistForeignSession(store: ForeignSessionStore, info: ForeignSessionInfo, options?: {
    fallbackCwd?: string;
    sessionDir?: string;
    suppressBreadcrumb?: boolean;
}): Promise<SessionManager>;
