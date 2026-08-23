import type { CommitAgentState } from "../../../commit/agentic/state.js";
import type { ModelRegistry } from "../../../config/model-registry.js";
import type { Settings } from "../../../config/settings.js";
import type { CustomTool } from "../../../extensibility/custom-tools/types.js";
import type { AuthStorage } from "../../../session/auth-storage.js";
export interface CommitToolOptions {
    cwd: string;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
    settings: Settings;
    spawns: string;
    state: CommitAgentState;
    changelogTargets: string[];
    enableAnalyzeFiles?: boolean;
}
export declare function createCommitTools(options: CommitToolOptions): Array<CustomTool<any, any>>;
