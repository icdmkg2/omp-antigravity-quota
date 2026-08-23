/**
 * Discovery Module
 *
 * Auto-registers all providers by importing them.
 * Import this module to ensure all providers are registered with the capability registry.
 */
import "../capability/context-file.js";
import "../capability/extension.js";
import "../capability/extension-module.js";
import "../capability/hook.js";
import "../capability/instruction.js";
import "../capability/mcp.js";
import "../capability/prompt.js";
import "../capability/rule.js";
import "../capability/settings.js";
import "../capability/skill.js";
import "../capability/slash-command.js";
import "../capability/ssh.js";
import "../capability/system-prompt.js";
import "../capability/tool.js";
import "./agent-plugins.js";
import "./agents-md.js";
import "./builtin.js";
import "./builtin-defaults.js";
import "./claude.js";
import "./claude-plugins.js";
import "./cline.js";
import "./agents.js";
import "./codex.js";
import "./cursor.js";
import "./gemini.js";
import "./opencode.js";
import "./github.js";
import "./mcp-json.js";
import "./omp-plugins.js";
import "./ssh.js";
import "./vscode.js";
import "./windsurf.js";
export { cacheStats, disableProvider, enableProvider, getAllCapabilitiesInfo, getAllProvidersInfo, getCapability, getCapabilityInfo, getDisabledProviders, getProviderInfo, initializeWithSettings, invalidate, isProviderEnabled, listCapabilities, loadCapability, reset, setDisabledProviders, } from "../capability/index.js";
export type { ContextFile } from "../capability/context-file.js";
export type { Extension, ExtensionManifest } from "../capability/extension.js";
export type { ExtensionModule } from "../capability/extension-module.js";
export type { Hook } from "../capability/hook.js";
export type { Instruction } from "../capability/instruction.js";
export type { MCPServer } from "../capability/mcp.js";
export type { Prompt } from "../capability/prompt.js";
export type { Rule, RuleFrontmatter } from "../capability/rule.js";
export type { Settings } from "../capability/settings.js";
export type { Skill, SkillFrontmatter } from "../capability/skill.js";
export type { SlashCommand } from "../capability/slash-command.js";
export type { SSHHost } from "../capability/ssh.js";
export type { SystemPrompt } from "../capability/system-prompt.js";
export type { CustomTool } from "../capability/tool.js";
export type * from "../capability/types.js";
