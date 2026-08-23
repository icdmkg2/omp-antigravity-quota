import type { SessionInfo } from "../session/session-listing.js";
/** Presentation and capability controls for the standalone session picker. */
export interface SessionPickerOptions {
    allSessions?: SessionInfo[];
    title?: string;
    scopeLabel?: string | false;
    showCwd?: boolean;
    allowDelete?: boolean;
    allowGlobalScope?: boolean;
    historySearch?: boolean;
    pinnedIds?: ReadonlySet<string>;
}
/**
 * Show the TUI session selector and return the selected session, or null if
 * cancelled. The default OMP picker supports deletion, transcript-history
 * search, and an all-projects scope; foreign import pickers disable those
 * source-owned capabilities.
 */
export declare function selectSession(sessions: SessionInfo[], options?: SessionPickerOptions): Promise<SessionInfo | null>;
