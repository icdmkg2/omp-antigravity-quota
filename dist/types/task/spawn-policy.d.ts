/** Default agent used when a session has unrestricted spawning. */
export declare const DEFAULT_SPAWN_AGENT = "task";
/** Spawn policy derived from a parent agent's `spawns` frontmatter. */
export interface ResolvedSpawnPolicy {
    /** True when at least one subagent may be spawned. */
    enabled: boolean;
    /** Agent used when the caller omits the agent field. */
    defaultAgent: string;
    /** Explicitly allowed agents, or `null` when the policy is unrestricted. */
    allowedAgents: readonly string[] | null;
    /** Text used in spawn rejection messages. */
    allowedErrorText: string;
    /** Backtick-quoted explicit agents for prompt descriptions. */
    allowedPromptText?: string;
}
/** Resolves spawn frontmatter into the default and prompt/error surfaces. */
export declare function resolveSpawnPolicy(parentSpawns: string | boolean | null | undefined): ResolvedSpawnPolicy;
/**
 * Whether the `scout` agent is spawnable in a session: not disabled via
 * `task.disabledAgents`, and permitted by the session spawn policy.
 */
export declare function isScoutSpawnable(disabledAgents: readonly string[] | undefined, spawns: string | boolean | null | undefined): boolean;
