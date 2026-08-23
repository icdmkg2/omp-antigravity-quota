import type { Settings } from "../config/settings.js";
import type { AgentSession } from "../session/agent-session.js";
/**
 * Build the standing auto-learn guidance for the system prompt from the tools
 * actually present in the active set, or null when `manage_skill` is absent.
 *
 * Driven by tool presence rather than live settings: the `learn`/`manage_skill`
 * registry is built ONCE at session start (and only for top-level sessions), so
 * keying the guidance on `autolearn.enabled` would let a mid-session enable — or
 * a subagent that filtered the tools out — inject guidance pointing at tools the
 * session never built. The `learn` addendum is included only when the `learn`
 * tool is present (it requires a memory backend).
 */
export declare function buildAutoLearnInstructions(available: {
    manageSkill: boolean;
    learn: boolean;
}): string | null;
export interface AutoLearnControllerOptions {
    session: AgentSession;
    settings: Settings;
    capture: (content: string) => Promise<void>;
}
export declare class AutoLearnController {
    #private;
    constructor(options: AutoLearnControllerOptions);
}
