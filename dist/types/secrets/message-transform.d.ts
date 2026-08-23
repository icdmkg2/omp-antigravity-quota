import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
import type { AssistantMessage, Context, Message } from "@oh-my-pi/pi-ai";
import type { SessionContext } from "../session/session-context.js";
import type { SecretObfuscator } from "./obfuscator.js";
/**
 * Restore secret placeholders for local display. Only message kinds the model
 * itself authored from obfuscated context carry placeholders — assistant
 * content and the LLM-written branch/compaction summaries. User, developer, and
 * tool-result messages are persisted with their literal text, so operator-authored
 * placeholder-shaped text must survive untouched; those roles are never walked.
 */
export declare function deobfuscateSessionContext(sessionContext: SessionContext, obfuscator: SecretObfuscator | undefined): SessionContext;
export declare function deobfuscateAgentMessages(obfuscator: SecretObfuscator, messages: AgentMessage[]): AgentMessage[];
/**
 * Restore placeholders in assistant content: visible text and tool-call
 * arguments/intent/rawBlock. Thinking and signatures are opaque
 * provider-replay/hidden-reasoning data and pass through byte-identical.
 */
export declare function deobfuscateAssistantContent(obfuscator: SecretObfuscator, content: AssistantMessage["content"]): AssistantMessage["content"];
/**
 * Restore placeholders inside a tool call's arguments. Arguments are arbitrary
 * model-authored JSON, so tool-call arguments are the ONLY place a recursive
 * JSON walk runs.
 */
export declare function deobfuscateToolArguments(obfuscator: SecretObfuscator, args: Record<string, unknown>): Record<string, unknown>;
/** Redact secrets inside a tool call's arguments (same JSON-walk exception as {@link deobfuscateToolArguments}). */
export declare function obfuscateToolArguments(obfuscator: SecretObfuscator, args: Record<string, unknown>, sharedRegexSecretValues?: ReadonlySet<string>): Record<string, unknown>;
/**
 * Redact secrets from outbound messages. User messages, tool results, and
 * user-authored developer messages (e.g. `@file` mentions) are obfuscated.
 * Assistant replay content is re-obfuscated too, because session restoration
 * expands keyed placeholders locally before the next provider request. Inline
 * image bytes are never walked.
 */
export declare function obfuscateMessages(obfuscator: SecretObfuscator, messages: Message[]): Message[];
/**
 * Redact outbound provider context. Only conversation messages are rewritten;
 * the static system prompt and tool schemas pass through unchanged.
 */
export declare function obfuscateProviderContext(obfuscator: SecretObfuscator | undefined, context: Context): Context;
