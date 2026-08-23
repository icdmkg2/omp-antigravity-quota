/**
 * Build a case-sensitive magic-keyword matcher for prose punctuation boundaries.
 *
 * Sentence punctuation and quotes may touch the keyword, but letters, digits,
 * underscores, slashes, backslashes, hyphens, file-extension dots, symbol
 * references (`foo::keyword`), and immediate call parentheses (`keyword()`)
 * keep the occurrence embedded in code rather than prose.
 */
export declare function magicKeywordRegex(keyword: string, flags?: string): RegExp;
