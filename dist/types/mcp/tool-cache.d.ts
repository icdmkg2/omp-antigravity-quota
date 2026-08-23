import type { AgentStorage } from "../session/agent-storage.js";
import type { MCPServerConfig, MCPToolDefinition } from "./types.js";
export declare class MCPToolCache {
    private storage;
    constructor(storage: AgentStorage);
    get(serverName: string, config: MCPServerConfig): Promise<MCPToolDefinition[] | null>;
    set(serverName: string, config: MCPServerConfig, tools: MCPToolDefinition[]): Promise<void>;
}
