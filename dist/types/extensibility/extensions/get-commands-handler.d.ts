/**
 * Helper for wiring the `getCommands` action of {@link ExtensionAPI}.
 *
 * Centralizes the union over the three slash-command sources the runtime
 * exposes so the five wiring sites (interactive UI, ACP, RPC, print, child
 * task executor) cannot drift:
 *   - extension-registered hook commands (`source: "extension"`)
 *   - prompt commands loaded as `LoadedCustomCommand` — user/project/bundled
 *     custom commands and MCP prompts (`source: "prompt"`)
 *   - skill commands derived from `session.skills`, gated on
 *     `skillsSettings.enableSkillCommands` (`source: "skill"`)
 *
 * Built-in slash commands are intentionally excluded; `getCommands()` is the
 * surface extensions use to discover dynamic commands they did not register
 * themselves. Each frontend (interactive-mode, ACP) prepends its own builtins.
 */
import type { SkillsSettings } from "../../config/settings.js";
import type { LoadedCustomCommand } from "../custom-commands/index.js";
import { type Skill } from "../skills.js";
import type { SlashCommandInfo } from "../slash-commands.js";
import type { ExtensionRunner } from "./runner.js";
interface CommandsCapableSession {
    readonly extensionRunner?: ExtensionRunner;
    readonly customCommands: ReadonlyArray<LoadedCustomCommand>;
    readonly skills: ReadonlyArray<Skill>;
    readonly skillsSettings?: SkillsSettings;
}
export declare function getSessionSlashCommands(session: CommandsCapableSession): SlashCommandInfo[];
export {};
