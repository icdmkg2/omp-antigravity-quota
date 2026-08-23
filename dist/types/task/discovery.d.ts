import type { AgentDefinition } from "./types.js";
/** Result of agent discovery */
export interface DiscoveryResult {
    agents: AgentDefinition[];
    projectAgentsDir: string | null;
}
/**
 * Discover agents from filesystem and merge with bundled agents.
 * Precedence (highest wins): project `.omp/agents`, user `.omp/agents`,
 * OMP extension-package agents in `listOmpExtensionRoots` source order
 * (CLI roots > project `extensions:` settings > user `extensions:` settings >
 * installed npm/link plugins), Claude marketplace plugin agents (project
 * scope before user), then bundled.
 * @param cwd - Current working directory for project agent discovery
 */
export declare function discoverAgents(cwd: string, home?: string): Promise<DiscoveryResult>;
/**
 * Get an agent by name from discovered agents.
 */
export declare function getAgent(agents: AgentDefinition[], name: string): AgentDefinition | undefined;
