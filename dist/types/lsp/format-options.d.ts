/** Subset of the LSP `FormattingOptions` we send. */
export interface LspFormattingOptions {
    tabSize: number;
    insertSpaces: boolean;
    trimTrailingWhitespace: boolean;
    insertFinalNewline: boolean;
    trimFinalNewlines: boolean;
}
interface DetectedIndent {
    tabSize?: number;
    insertSpaces?: boolean;
}
/**
 * Sniff `insertSpaces` and the indent unit from `content`.
 *
 * Walks the buffer once: the first indented line decides spaces vs tabs; for
 * space indents, the GCD of all space-indent widths gives the stride (so a
 * 2/4/6 file reports `2`, a 4/8 file reports `4`). Returns `undefined` for any
 * field the content does not pin so a higher-precedence override (editorconfig)
 * can win without being overwritten by sniffing noise.
 */
export declare function detectIndentFromContent(content: string): DetectedIndent;
/**
 * Resolve the `FormattingOptions` payload for a `textDocument/formatting` request
 * targeting `filePath` with `content`.
 *
 * The two fields that actually affect on-disk bytes (`tabSize`, `insertSpaces`)
 * are layered: editorconfig wins, then content sniffing, then the fallback.
 * Trim/final-newline flags are static.
 */
export declare function resolveFormatOptions(filePath: string, content: string): LspFormattingOptions;
export {};
