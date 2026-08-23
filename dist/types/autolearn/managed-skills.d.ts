/** Provider id stamped on discovered managed skills (distinguishes them from authored). */
export declare const MANAGED_SKILLS_PROVIDER_ID = "omp-managed";
/** Hard cap on a managed SKILL.md body to keep generated skills bounded. */
export declare const MAX_MANAGED_SKILL_BYTES = 64000;
/** Resolve the isolated managed-skills directory (`~/.omp/agent/managed-skills`). */
export declare function getManagedSkillsDir(agentDir?: string): string;
/**
 * Validate + normalize a managed-skill name. Throws on anything outside the
 * strict allowlist so a bad name can never escape `getManagedSkillsDir()`
 * (blocks `..`, slashes, empty, and uppercase).
 */
export declare function sanitizeSkillName(raw: string): string;
/**
 * Whether `name` is a safe managed-skill name (the exact post-sanitize shape).
 * Used to validate names read from disk at discovery time — a managed
 * `SKILL.md` whose `frontmatter.name` was not produced by `sanitizeSkillName`
 * (e.g. hand-placed) must not render unescaped into the system prompt.
 */
export declare function isValidManagedSkillName(name: string): boolean;
/**
 * Neutralize a machine-generated managed-skill description so it cannot break
 * out of the system prompt's `<skills>` listing. Managed descriptions are
 * generated from prior task content and persist across sessions, so this is a
 * trust boundary: strip control/format chars, angle brackets (`<system-directive>`
 * / `</skills>`), and Markdown fence delimiters (backticks, `~~~`), then collapse
 * to a single line. Applied on BOTH write and read so existing files are safe too.
 */
export declare function sanitizeManagedDescription(raw: string): string;
/**
 * Serialize the minimal `name`/`description` frontmatter block via the repo's
 * YAML helper (round-trips through `parseFrontmatter`).
 */
export declare function toSkillFrontmatter(name: string, description: string): string;
export interface WriteManagedSkillInput {
    action: "create" | "update";
    name: string;
    description: string;
    body: string;
}
/** Create or update a managed `SKILL.md`. Returns the resolved file path. */
export declare function writeManagedSkill(input: WriteManagedSkillInput): Promise<{
    path: string;
}>;
/** Delete a managed skill directory. Throws when it does not exist. */
export declare function deleteManagedSkill(name: string): Promise<void>;
