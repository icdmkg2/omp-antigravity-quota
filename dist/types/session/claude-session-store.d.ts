import type { ForeignSessionInfo, ForeignSessionStore } from "./foreign-session-store.js";
import { SessionManager } from "./session-manager.js";
/** Imports Claude Code JSONL sessions into non-persistent OMP session managers. */
export declare class ClaudeSessionStore implements ForeignSessionStore {
    #private;
    readonly source = "claude";
    /** Creates a store rooted at Claude's data directory, or at a fixture root when supplied. */
    constructor(root?: string);
    /** Lists indexed Claude sessions without reading transcript bodies. */
    list(): Promise<ForeignSessionInfo[]>;
    /** Loads and converts a Claude transcript while preserving its source tree and timestamps. */
    load(info: ForeignSessionInfo): Promise<SessionManager>;
}
