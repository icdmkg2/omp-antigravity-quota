import { type Component } from "@oh-my-pi/pi-tui";
import type { SessionInfo } from "../../session/session-listing.js";
import { OverlayPanel } from "./overlay-box.js";
/** Returns the IDs of sessions whose recorded prompts match a query, best first. */
export type SessionHistoryMatcher = (query: string) => string[];
/**
 * Filter and rank session picker search results.
 *
 * Resume search narrows a recency-sorted list: once every query token appears
 * as a literal substring, newer sessions should beat a slightly better fuzzy
 * position match. Pure fuzzy/acronym matches still sort by fuzzy score after
 * literal matches, but weak pure fuzzy tokens are dropped as noise.
 *
 * This is the synchronous reference implementation; {@link SessionList} runs
 * the same primitives incrementally so huge listings never block a keystroke.
 */
export declare function rankSessionSearchMatches(allSessions: SessionInfo[], query: string): SessionInfo[];
/**
 * Combine metadata matches with prompt-history matches for ranking, using both
 * signals rather than replacing one with the other.
 *
 * - `fuzzy` is the ordered metadata/session-text result.
 * - `historyIds` are session IDs whose recorded prompts matched the query,
 *   ordered by prompt-history rank (typically newest matching prompt first); duplicates are tolerated.
 *
 * Ranking: prompt-history matches lead in history order, then remaining
 * metadata matches keep their existing order. A metadata match is never dropped,
 * and history matches not present in `allSessions` (e.g. deleted or out-of-scope
 * sessions) are ignored since they cannot be resumed from here.
 */
export declare function mergeSessionRanking(allSessions: SessionInfo[], fuzzy: SessionInfo[], historyIds: string[]): SessionInfo[];
/**
 * Custom session list component with multi-line items and search
 */
declare class SessionList implements Component {
    #private;
    onSelect?: (session: SessionInfo) => void;
    onCancel?: () => void;
    onExit: () => void;
    onToggleScope?: () => void;
    onDeleteRequest?: (session: SessionInfo) => void;
    /** Re-render hook for async list updates (fuzzy scan chunks, history merge). */
    onRequestRender?: () => void;
    constructor(sessions: SessionInfo[], showCwd?: boolean, historyMatcher?: SessionHistoryMatcher, getTerminalRows?: () => number, pinnedIds?: ReadonlySet<string>);
    /** Replace the visible dataset, e.g. when toggling folder/all-projects scope. */
    setSessions(sessions: SessionInfo[], showCwd: boolean, pinnedIds?: ReadonlySet<string>): void;
    /** Cancel pending async search work; idempotent, called on every picker exit path. */
    dispose(): void;
    removeSession(sessionPath: string): void;
    /** Resolve a list-local rendered-line index to a filtered-session index. */
    hitTestSession(line: number): number | undefined;
    /** Wheel notch: move the selection one step (clamped, no wrap). */
    handleWheel(delta: -1 | 1): void;
    /** Mouse click: select the session under the pointer and resume it. */
    selectAndConfirm(index: number): void;
    invalidate(): void;
    render(width: number): readonly string[];
    handleInput(keyData: string): void;
}
export interface SessionSelectorOptions {
    onDelete?: (session: SessionInfo) => Promise<boolean>;
    historyMatcher?: SessionHistoryMatcher;
    /** Loads sessions across all projects for the all-projects scope toggle (Tab). */
    loadAllSessions?: () => Promise<SessionInfo[]>;
    /** Preloaded all-projects list; cached so the first Tab toggle is instant. */
    allSessions?: SessionInfo[];
    /** Picker heading; defaults to "Resume Session". */
    title?: string;
    /** Fixed scope label, or false to omit the scope suffix. */
    scopeLabel?: string | false;
    /** Show each session's working directory in the list. */
    showCwd?: boolean;
    /**
     * Reads the live terminal height so the visible window fits the viewport.
     * Omitted only in tests; defaults to a conservative 24 rows.
     */
    getTerminalRows?: () => number;
    /**
     * Fill the whole viewport and pin the footer (hint + bottom border) to the
     * last rows, so the footer stops drifting as the list window changes height.
     * Set by the standalone `--resume` picker (fullscreen alternate screen); the
     * in-editor selector leaves it off and renders compactly.
     */
    fillHeight?: boolean;
    /** Set of pinned session ids to display with a pin indicator. */
    pinnedIds?: ReadonlySet<string>;
}
/**
 * Component that renders a session selector with optional confirmation dialog
 */
export declare class SessionSelectorComponent extends OverlayPanel {
    #private;
    constructor(sessions: SessionInfo[], onSelect: (session: SessionInfo) => void, onCancel: () => void, onExit: () => void, options?: SessionSelectorOptions);
    setOnRequestRender(callback: () => void): void;
    /** Ignore input after selection while the host resumes the session. */
    lockInput(): void;
    /** Re-enable input after a failed resume so the user can pick again. */
    unlockInput(): void;
    /**
     * Dispose the session list explicitly: while the delete-confirmation dialog
     * is mounted the list is detached from the child tree, so Container's
     * child-walking dispose would miss its pending history-merge timer.
     */
    dispose(): void;
    /**
     * Render the panel directly so fill-height mode can keep its footer pinned
     * while sharing OverlayPanel's exact rounded-box chrome. Children receive
     * the panel's inner width before their rows are wrapped.
     */
    render(width: number): readonly string[];
    handleInput(keyData: string): void;
    getSessionList(): SessionList;
}
export {};
