import type { AgentMessage } from "@oh-my-pi/pi-agent-core";
/** A fenced code block extracted from assistant markdown. */
export interface CodeBlock {
    /** Info string after the opening fence (language id), trimmed. */
    lang: string;
    /** Block body with the trailing newline stripped. */
    code: string;
}
/** A blockquote block: a maximal run of `>`-prefixed lines from markdown. */
export interface QuoteBlock {
    /** Block body with each line's `>` marker (and one optional space) removed. */
    text: string;
}
/** A drillable block within an assistant message, in document order. */
export type MessageBlock = ({
    kind: "code";
} & CodeBlock) | ({
    kind: "quote";
} & QuoteBlock);
/** A runnable command found in the transcript. */
export interface LastCommand {
    kind: "bash" | "eval";
    code: string;
    /** Highlight language: "bash" for bash, or the resolved eval language ("python"/"javascript"/"ruby"/"julia"). */
    language: string;
}
/**
 * A node in the `/copy` picker tree. Leaves carry `content` (placed on the
 * clipboard) plus `copyMessage` (the status shown afterwards); groups carry
 * `children` to drill into.
 */
export interface CopyTarget {
    /** Stable id (e.g. "msg:1", "msg:1:code:0", "msg:1:quote:0", "msg:1:all", "cmd:1"). */
    id: string;
    label: string;
    /** Dim annotation: line/block counts, language, or tool name. */
    hint?: string;
    /** Full text rendered in the preview pane. */
    preview: string;
    /** Highlight language for code/command previews (undefined = plain/markdown). */
    language?: string;
    /** Leaf: text copied to the clipboard. */
    content?: string;
    /** Leaf: status message shown after copying. */
    copyMessage?: string;
    /** Group: nested targets to drill into. */
    children?: CopyTarget[];
}
/** Minimal session surface needed to assemble copy targets (eases testing). */
export interface CopySource {
    readonly messages: readonly AgentMessage[];
    getLastVisibleHandoffText(): string | undefined;
}
/**
 * Split assistant markdown into drillable blocks — fenced code and `>`-quoted
 * runs — in document order. Fences mask their bodies, so a `>` line inside a
 * code block is never mistaken for a quote. An unclosed fence is treated as
 * ordinary text, matching the fenced-block grammar.
 */
export declare function extractBlocks(text: string): MessageBlock[];
/** Extract fenced code blocks from assistant markdown, in document order. */
export declare function extractCodeBlocks(text: string): CodeBlock[];
/** Walk the transcript backwards for the most recent fenced assistant code block. */
export declare function extractLastCodeBlock(messages: readonly AgentMessage[]): CodeBlock | undefined;
/** Extract `>`-quoted blocks from assistant markdown, in document order. */
export declare function extractQuoteBlocks(text: string): QuoteBlock[];
/** Walk the transcript backwards for the most recent bash command or eval code. */
export declare function extractLastCommand(messages: readonly AgentMessage[]): LastCommand | undefined;
/**
 * Assemble the unified `/copy` target tree: recent assistant messages
 * (most recent first, each drillable into its code blocks), runnable command
 * targets interleaved after the assistant message that issued them, and a
 * fresh-handoff fallback when no assistant message exists yet.
 */
export declare function buildCopyTargets(source: CopySource): CopyTarget[];
