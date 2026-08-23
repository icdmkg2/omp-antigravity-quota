import type { SourceMeta } from "./types.js";
/**
 * Provider id for the bundled default rules shipped with the agent.
 * Lowest priority, so any user/project/tool rule of the same name overrides
 * a bundled default. Also used to gate the whole bundled set via
 * `ttsr.builtinRules`.
 */
export declare const BUILTIN_DEFAULTS_PROVIDER_ID = "builtin-defaults";
/**
 * Parsed frontmatter from rule files.
 */
export interface RuleFrontmatter {
    description?: string;
    globs?: string[];
    alwaysApply?: boolean;
    /** New key for TTSR match conditions. */
    condition?: string | string[];
    /** TTSR match condition(s) expressed as ast-grep patterns (edit/write streams only). */
    astCondition?: string | string[];
    /** New key for TTSR stream scope. */
    scope?: string | string[];
    /** Per-rule TTSR interrupt mode override. */
    interruptMode?: "never" | "prose-only" | "tool-only" | "always";
    [key: string]: unknown;
}
/**
 * A rule providing project-specific guidance and constraints.
 */
export interface Rule {
    /** Rule name (derived from filename) */
    name: string;
    /** Absolute path to rule file */
    path: string;
    /** Rule content (after frontmatter stripped) */
    content: string;
    /** Globs this rule applies to (if any) */
    globs?: string[];
    /** Whether to always include this rule */
    alwaysApply?: boolean;
    /** Description (for agent-requested rules) */
    description?: string;
    /** Regex condition(s) that can trigger TTSR interruption. */
    condition?: string[];
    /** ast-grep pattern condition(s) that can trigger TTSR interruption (edit/write streams only). */
    astCondition?: string[];
    /** Optional stream scope tokens (for example: text, thinking, tool:edit(*.ts)). */
    scope?: string[];
    /** Per-rule TTSR interrupt mode override (falls back to global ttsr.interruptMode). */
    interruptMode?: "never" | "prose-only" | "tool-only" | "always";
    /** Source metadata */
    _source: SourceMeta;
}
/**
 * Parse `condition` + `scope` from rule frontmatter.
 *
 * - `condition` accepts string or string[]
 * - `scope` accepts string or string[]
 * - legacy `ttsr_trigger` / `ttsrTrigger` are accepted as a `condition` fallback
 * - condition tokens that look like file globs become scope shorthands:
 *   `*.rs` => `tool:edit(*.rs)`, `tool:write(*.rs)` and a catch-all condition `.*`
 * - `astCondition` holds ast-grep patterns and is kept verbatim (no glob inference)
 */
export declare function parseRuleConditionAndScope(frontmatter: RuleFrontmatter): Pick<Rule, "condition" | "astCondition" | "scope">;
/**
 * Compile a rule `condition` into a `RegExp`, translating a leading PCRE-style
 * inline flag group into native `RegExp` flags.
 *
 * JS/Bun `RegExp` rejects inline flag prefixes such as `(?i)`, so a rule written
 * `condition: "(?i)pre.existing"` would otherwise throw at compile time and be
 * silently dropped (see issue #4796). Only a *leading* group of `i`/`m`/`s`
 * flags is translated; anything else — mid-pattern groups, unsupported flags —
 * is passed through verbatim so the native error still surfaces for genuinely
 * invalid patterns.
 */
export declare function compileRuleCondition(pattern: string): RegExp;
/**
 * Process-global snapshot of rules the active session loaded.
 * Read by internal URL protocol handlers (rule://).
 */
export declare function getActiveRules(): readonly Rule[];
/** Replace the active rule snapshot. Called once per top-level session. */
export declare function setActiveRules(value: readonly Rule[]): void;
/** Reset the active rule snapshot. Test-only. */
export declare function resetActiveRulesForTests(): void;
export declare const ruleCapability: import("./types.js").Capability<Rule>;
