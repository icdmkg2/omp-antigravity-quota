import type { MCPServerConfig } from "./types.js";
type RegistryInputType = "string" | "number" | "boolean";
export type SmitherySearchResult = {
    id: string;
    name: string;
    title?: string;
    description?: string;
    score?: number;
    useCount?: number;
    display: {
        displayName: string;
        description: string;
        useCount: number;
        verified: boolean;
        deployed: boolean;
        transport: string;
        connectionType: string;
        createdAt?: string;
        homepage?: string;
        tools: Array<{
            name: string;
            description?: string;
            params: string[];
        }>;
    };
    sourceType: "remote" | "package";
    config: MCPServerConfig;
    warnings: string[];
    requiredInputs: Array<{
        key: string;
        label: string;
        type: RegistryInputType;
        required: boolean;
        defaultValue?: string;
        description?: string;
        enumValues?: string[];
        sensitive: boolean;
    }>;
};
export interface SmitherySearchOptions {
    limit?: number;
    apiKey?: string;
    includeSemantic?: boolean;
    signal?: AbortSignal;
}
export declare class SmitheryRegistryError extends Error {
    status: number;
    constructor(message: string, status: number);
}
export declare function searchSmitheryRegistry(keyword: string, options?: SmitherySearchOptions): Promise<SmitherySearchResult[]>;
export declare function toConfigName(candidate: string): string;
export {};
