/**
 * Internal URL routing system for internal protocols like agent://, memory://,
 * skill://, mcp://, local://, and xd://.
 *
 * One process-global `InternalUrlRouter` is shared across sessions. Handlers
 * are stateless; they pull whatever they need (active skills/rules, active
 * MCP/async managers, AgentRegistry-listed sessions) from the owning module
 * on each resolve call.
 */
export * from "./agent-protocol.js";
export * from "./artifact-protocol.js";
export * from "./history-protocol.js";
export * from "./issue-pr-protocol.js";
export * from "./json-query.js";
export * from "./local-protocol.js";
export * from "./mcp-protocol.js";
export * from "./memory-protocol.js";
export * from "./omp-protocol.js";
export * from "./parse.js";
export * from "./router.js";
export * from "./rule-protocol.js";
export * from "./security-protocol.js";
export * from "./skill-protocol.js";
export * from "./ssh-protocol.js";
export type * from "./types.js";
export * from "./vault-protocol.js";
export * from "./xd-protocol.js";
