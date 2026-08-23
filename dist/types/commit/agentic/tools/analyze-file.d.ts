import type { CommitAgentState } from "../../../commit/agentic/state.js";
import type { ModelRegistry } from "../../../config/model-registry.js";
import type { Settings } from "../../../config/settings.js";
import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
import type { AuthStorage } from "../../../session/auth-storage.js";
declare const analyzeFileSchema: import("@oh-my-pi/omptype").FluentType<{
    files: string[];
    goal?: string | undefined;
}, {
    files: string[];
    goal?: string | undefined;
}>;
export declare function createAnalyzeFileTool(options: {
    cwd: string;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
    settings: Settings;
    spawns: string;
    state: CommitAgentState;
}): CustomTool<typeof analyzeFileSchema>;
export {};
