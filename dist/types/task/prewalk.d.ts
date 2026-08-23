import type { AgentDefinition } from "./types.js";
/** Resolve an agent's prewalk default, including the bundled task opt-in. */
export declare function resolveAgentPrewalkDefault(agent: AgentDefinition, taskPrewalk: boolean): boolean | string | undefined;
