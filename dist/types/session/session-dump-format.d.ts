/**
 * Plain-text / markdown session formatting for `/dump` and `/advisor dump raw`.
 *
 * Renders a prelude (system prompt, model/thinking config, tool inventory)
 * followed by the message history as per-message markdown headings: `## User`,
 * `## Assistant` (with `<thinking>` blocks and `### Tool Call: <name>` + YAML
 * args), `### Tool Result: <name>`, and the execution/summary sections.
 */
import type { AgentMessage, ThinkingLevel } from "@oh-my-pi/pi-agent-core";
import type { Model, ToolExample } from "@oh-my-pi/pi-ai";
/** Minimal tool shape for dump output (matches AgentTool fields used by formatSessionDumpText). */
export interface SessionDumpToolInfo {
    name: string;
    description: string;
    parameters: unknown;
    examples?: readonly ToolExample[];
}
export interface FormatSessionDumpTextOptions {
    messages: readonly AgentMessage[];
    systemPrompt?: readonly string[] | null;
    model?: Model | null;
    thinkingLevel?: ThinkingLevel | string | null;
    tools?: readonly SessionDumpToolInfo[];
    inlineToolDescriptors?: boolean;
}
/**
 * Format messages and session metadata as markdown/plain text (same as
 * AgentSession.formatSessionAsText / /dump).
 */
export declare function formatSessionDumpText(options: FormatSessionDumpTextOptions): string;
