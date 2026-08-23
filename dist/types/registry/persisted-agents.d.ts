import { type AgentRegistry } from "./agent-registry.js";
/** Register persisted subagent and advisor transcripts as parked registry refs. */
export declare function registerPersistedSubagents(registry: AgentRegistry, sessionFile: string | null | undefined, options?: {
    shouldContinue?: () => boolean;
}): Promise<void>;
