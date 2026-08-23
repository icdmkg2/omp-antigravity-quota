import type { SourceMeta } from "../capability/types.js";
import type { SkillsSettings } from "../config/settings.js";
import type { SkillPromptDetails } from "../session/messages.js";
export interface Skill {
    name: string;
    description: string;
    filePath: string;
    baseDir: string;
    source: string;
    /**
     * When `true`, the skill is loaded and reachable via `skill://<name>` and
     * (when enabled) `/skill:<name>`, but is excluded from the rendered system
     * prompt's `<skills>` listing.
     */
    hide?: boolean;
    /**
     * Filesystem-resolved plugin root for Agent Plugin skills (spec §4.1):
     * every `skill://` resource access must realpath-resolve within it.
     */
    containRoot?: string;
    /** Source metadata for display */
    _source?: SourceMeta;
}
export interface SkillWarning {
    skillPath: string;
    message: string;
}
export interface LoadSkillsResult {
    skills: Skill[];
    warnings: SkillWarning[];
}
/**
 * Process-global snapshot of skills the active session loaded.
 * Read by internal URL protocol handlers (skill://).
 */
export declare function getActiveSkills(): readonly Skill[];
/** Replace the active skill snapshot. Called once per top-level session. */
export declare function setActiveSkills(value: readonly Skill[]): void;
/** Reset the active skill snapshot. Test-only. */
export declare function resetActiveSkillsForTests(): void;
/**
 * Whether `name` is already claimed by an active authored (non-managed) skill.
 *
 * Managed (auto-learn) skills resolve dead-last in discovery, so an authored
 * skill of the same name always wins (see `loadSkills`) and a managed skill
 * written under an authored name is silently dropped — it never surfaces.
 * `manage_skill` create consults this to refuse the write up front instead of
 * reporting a false "Created" for a skill that can never appear.
 */
export declare function isNameClaimedByAuthoredSkill(name: string): boolean;
export interface LoadSkillsFromDirOptions {
    /** Directory to scan for skills */
    dir: string;
    /** Source identifier for these skills */
    source: string;
}
export declare function loadSkillsFromDir(options: LoadSkillsFromDirOptions): Promise<LoadSkillsResult>;
export interface LoadSkillsOptions extends SkillsSettings {
    /** Working directory for project-local skills. Default: getProjectDir() */
    cwd?: string;
}
/**
 * Load skills from all configured locations.
 * Returns skills and any validation warnings.
 */
export declare function loadSkills(options?: LoadSkillsOptions): Promise<LoadSkillsResult>;
export interface BuiltSkillPromptMessage {
    message: string;
    details: SkillPromptDetails;
}
export declare function getSkillSlashCommandName(skill: Pick<Skill, "name">): string;
/**
 * Parsed `/skill:<name>` invocation: either at the start of the draft (the
 * traditional slash-command position) or as a `/skill:<name>` token embedded
 * mid-prompt. For the mid-prompt form the surrounding prose is threaded
 * through as `args` so the skill sees the full user request.
 */
export interface ParsedSkillInvocation {
    /** Bare skill name without the leading `skill:` prefix. */
    name: string;
    /** User-supplied arguments (everything outside the `/skill:<name>` token). */
    args: string;
}
/**
 * Detect a `/skill:<name>` invocation in a user draft.
 *
 * Returns `undefined` when the text contains no skill token. Otherwise:
 *   - Leading form (`/skill:foo bar baz`): name=`foo`, args=`bar baz`.
 *   - Mid-prompt form (`fix the bug /skill:foo focus on auth`): name=`foo`,
 *     args=`fix the bug focus on auth` — the surrounding prose collapsed
 *     into a single args string.
 *
 * Mid-prompt detection is disabled when the draft itself starts with a
 * different slash command (e.g. `/compact /skill:foo`) or a local-execution
 * sigil — `!cmd` / `!!cmd` for the bash tool and `$ cmd` / `$$ cmd` for the
 * python tool. Those handlers run after the skill-command dispatcher and
 * their bodies routinely contain `/skill:<name>` references that are not
 * meant as skill invocations.
 */
export declare function parseSkillInvocation(text: string): ParsedSkillInvocation | undefined;
export type SkillInvocationKind = "user" | "autoload";
export declare function buildSkillPromptMessage(skill: Pick<Skill, "name" | "filePath" | "baseDir">, args: string, invocation?: SkillInvocationKind): Promise<BuiltSkillPromptMessage>;
