import { AgentRegistry } from "../registry/agent-registry.js";
export interface RunningSubagentRegistrySource {
    agentRegistry: AgentRegistry;
}
export declare function getRunningSubagentBadgeRegistry(collabGuest: RunningSubagentRegistrySource | undefined): AgentRegistry;
export declare function countRunningSubagentBadgeAgents(registry: AgentRegistry): number;
