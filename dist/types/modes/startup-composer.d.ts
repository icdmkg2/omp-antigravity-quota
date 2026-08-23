import type { Terminal } from "@oh-my-pi/pi-tui";
import type { LspServerInfo, RecentSession } from "./components/welcome.js";
import { Composer, type ComposerPreferences } from "./composer.js";
import { type ComposerThemePreferences } from "./composer-cache.js";
/** Inputs available at the CLI prepaint boundary before command modules load. */
export interface PrepaintComposerOptions {
    readonly terminal?: Terminal;
    readonly exit?: (code: number) => void;
    readonly now?: () => number;
    readonly version?: string;
    readonly cwd?: string;
    readonly preferences?: Partial<ComposerPreferences>;
    readonly theme?: ComposerThemePreferences;
    readonly recentSessions?: () => Promise<RecentSession[]>;
    readonly cache?: boolean;
}
/** Final settings pushed into the live composer after Settings and the theme resolve. */
export interface PrepaintComposerPreferences extends ComposerPreferences {
    readonly theme: ComposerThemePreferences;
}
/** Ownership token that transfers one already-started Composer to InteractiveMode. */
export declare class ComposerLease {
    #private;
    readonly composer: Composer;
    /** Recent-session rows already loading in parallel with the runtime module graph. */
    readonly recentSessions?: Promise<RecentSession[] | undefined>;
    constructor(composer: Composer, recentSessions?: Promise<RecentSession[] | undefined>);
    /** Transfer terminal ownership exactly once. */
    adopt(): void;
    /** Stop an unadopted composer when startup exits before InteractiveMode. */
    dispose(): void;
}
/** Start the canonical Composer with speculative cached state, then refresh recent sessions. */
export declare function beginStartupComposer(options?: PrepaintComposerOptions): void;
/** Take the live prepaint composer away from the module-level startup owner. */
export declare function takeStartupComposerLease(): ComposerLease | undefined;
/** Stop and forget any prepaint composer that never reached InteractiveMode. */
export declare function stopPendingStartupComposer(): void;
/** Apply final settings to the pending Composer and cache them for the next first frame. */
export declare function applyStartupComposerPreferences(update: PrepaintComposerPreferences): void;
/** Apply discovered project LSP rows and cache them for the next first frame. */
export declare function setStartupComposerLspServers(servers: LspServerInfo[]): void;
