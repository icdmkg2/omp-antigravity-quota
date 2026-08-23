import type { ForeignSessionInfo, ForeignSessionStore } from "./foreign-session-store.js";
import { SessionManager } from "./session-manager.js";
/** Imports locally stored OpenAI Codex sessions into OMP's in-memory session format. */
export declare class CodexSessionStore implements ForeignSessionStore {
    #private;
    /** Foreign-session source discriminator. */
    readonly source = "codex";
    /** Uses the supplied Codex data root, or ~/.codex by default. */
    constructor(rootDirectory?: string);
    /** Lists Codex sessions from its state index without reading transcript bodies. */
    list(): Promise<ForeignSessionInfo[]>;
    /** Converts one Codex rollout into a non-persistent OMP session. */
    load(info: ForeignSessionInfo): Promise<SessionManager>;
}
