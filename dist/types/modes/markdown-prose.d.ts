/**
 * Markdown structure awareness for the magic-keyword affordances
 * ("ultrathink"/"orchestrate"/"workflowz").
 *
 * Keyword detection and editor/transcript highlighting must fire only on prose
 * the user is actually addressing to the model — never on a word that happens to
 * live inside a fenced code block, an inline code span, or an HTML/XML section.
 * {@link maskNonProse} returns a length-preserving copy of the text where every
 * such region is blanked to spaces, so a word-bounded match run against the mask
 * never lands inside code/markup while its indices still address the original
 * text for painting.
 */
/**
 * Return a copy of `text` with identical length (indices map 1:1) where every
 * character inside a non-prose region is replaced by a space. Non-prose regions
 * are markdown fenced code blocks, inline code spans, and HTML/XML tags together
 * with the content they enclose. Newlines are preserved. Text with no construct
 * that could open such a region is returned unchanged.
 */
export declare function maskNonProse(text: string): string;
/**
 * Whether `text` contains a standalone keyword match (per the non-global,
 * word-bounded `word` regex) that lives in prose rather than inside a code
 * block, inline code span, or HTML/XML section. `word` MUST be non-global so
 * `.test` stays stateless.
 */
export declare function keywordInProse(text: string, word: RegExp): boolean;
