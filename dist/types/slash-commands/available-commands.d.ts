import type { AvailableCommand } from "@oh-my-pi/pi-utils/acp";
import type { SkillsSettings } from "../config/settings.js";
import type { LoadedCustomCommand } from "../extensibility/custom-commands/index.js";
import type { ExtensionRunner } from "../extensibility/extensions/index.js";
import { type Skill } from "../extensibility/skills.js";
import { type FileSlashCommand } from "../extensibility/slash-commands.js";
export type AvailableSlashCommandSource = "builtin" | "skill" | "extension" | "custom" | "mcp_prompt" | "file";
export interface InternalAvailableSlashCommand {
    name: string;
    aliases?: string[];
    description?: string;
    input?: {
        hint: string;
    };
    subcommands?: Array<{
        name: string;
        description?: string;
        usage?: string;
    }>;
    source: AvailableSlashCommandSource;
}
export interface AvailableCommandsSession {
    readonly extensionRunner?: ExtensionRunner;
    readonly customCommands: ReadonlyArray<LoadedCustomCommand>;
    readonly mcpPromptCommands?: ReadonlyArray<LoadedCustomCommand>;
    readonly skills: ReadonlyArray<Skill>;
    readonly skillsSettings?: SkillsSettings;
    setSlashCommands(slashCommands: FileSlashCommand[]): void;
    sessionManager: {
        getCwd(): string;
    };
}
export declare function buildAvailableSlashCommands(session: AvailableCommandsSession, loadFileCommands?: (cwd: string) => Promise<FileSlashCommand[]>): Promise<InternalAvailableSlashCommand[]>;
export declare function toAcpAvailableCommands(commands: readonly InternalAvailableSlashCommand[]): AvailableCommand[];
