import { type Component } from "@oh-my-pi/pi-tui";
import type { AgentSession } from "../../session/agent-session.js";
/**
 * Footer component that shows pwd, token stats, and context usage
 */
export declare class FooterComponent implements Component {
    #private;
    private readonly session;
    constructor(session: AgentSession);
    setAutoCompactEnabled(enabled: boolean): void;
    /**
     * Set extension status text to display in the footer.
     * Text is sanitized (newlines/tabs replaced with spaces) and truncated to terminal width.
     * ANSI escape codes for styling are preserved.
     * @param key - Unique key to identify this status
     * @param text - Status text, or undefined to clear
     */
    setExtensionStatus(key: string, text: string | undefined): void;
    /**
     * Watch the repository HEAD for branch changes; invokes the callback so the
     * footer repaints with the new branch. Uses `git.head.watch` (stat-poll) —
     * see that helper for why `fs.watch` cannot track git's atomic HEAD swaps.
     */
    watchBranch(onBranchChange: () => void): void;
    /**
     * Clean up the file watcher
     */
    dispose(): void;
    invalidate(): void;
    render(width: number): readonly string[];
}
