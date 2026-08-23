import type { AgentDefinition, AgentSource } from "./types.js";
export declare class AgentParsingError extends Error {
    readonly source?: unknown;
    constructor(error: Error, source?: unknown);
    toString(): string;
}
/**
 * Parse an agent from embedded content.
 */
export declare function parseAgent(filePath: string, content: string, source: AgentSource, level?: "fatal" | "warn" | "off"): AgentDefinition;
/**
 * Load all bundled agents from embedded content.
 * Results are cached after first load.
 */
export declare function loadBundledAgents(): AgentDefinition[];
/**
 * Get a bundled agent by name.
 */
export declare function getBundledAgent(name: string): AgentDefinition | undefined;
/**
 * Get all bundled agents as a map keyed by name.
 */
export declare function getBundledAgentsMap(): Map<string, AgentDefinition>;
/**
 * Clear the bundled agents cache (for testing).
 */
export declare function clearBundledAgentsCache(): void;
export declare const BUNDLED_AGENTS: typeof loadBundledAgents;
