/** A bundled rule's stable name and raw markdown (frontmatter + body). */
export interface BuiltinRuleSource {
    name: string;
    content: string;
}
/** All bundled default rules, ordered by name. */
export declare const BUILTIN_RULE_SOURCES: readonly BuiltinRuleSource[];
