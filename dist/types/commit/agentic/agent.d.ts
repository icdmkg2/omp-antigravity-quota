import type { ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Api, Model } from "@oh-my-pi/pi-ai";
import type { ModelRegistry } from "../../config/model-registry.js";
import type { Settings } from "../../config/settings.js";
import type { AuthStorage } from "../../session/auth-storage.js";
import type { CommitAgentState } from "./state.js";
export interface CommitAgentInput {
    cwd: string;
    model: Model<Api>;
    thinkingLevel?: ThinkingLevel;
    settings: Settings;
    modelRegistry: ModelRegistry;
    authStorage: AuthStorage;
    userContext?: string;
    contextFiles?: Array<{
        path: string;
        content: string;
    }>;
    changelogTargets: string[];
    requireChangelog: boolean;
    diffText?: string;
    existingChangelogEntries?: ExistingChangelogEntries[];
    onComplete?: (state: CommitAgentState) => Promise<void> | void;
}
export interface ExistingChangelogEntries {
    path: string;
    sections: Array<{
        name: string;
        items: string[];
    }>;
}
export declare function runCommitAgentSession(input: CommitAgentInput): Promise<CommitAgentState>;
