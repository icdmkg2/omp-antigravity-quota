/**
 * JSON query parser and executor for agent:// URL extraction.
 *
 * Supports jq-like syntax: .foo, [0], .foo.bar[0].baz, ["special-key"]
 * Also supports path form: /foo/bar/0 -> .foo.bar[0]
 */
/**
 * Parse a jq-like query string into tokens.
 *
 * @example
 * parseQuery(".foo.bar[0]") // ["foo", "bar", 0]
 * parseQuery(".foo['special-key']") // ["foo", "special-key"]
 */
export declare function parseQuery(query: string): Array<string | number>;
/**
 * Apply a parsed query to a JSON value.
 *
 * @example
 * applyQuery({ foo: { bar: [1, 2, 3] } }, ".foo.bar[0]") // 1
 */
export declare function applyQuery(data: unknown, query: string): unknown;
/**
 * Convert a URL path form to a query string.
 *
 * Path form: /foo/bar/0 -> .foo.bar[0]
 * Trailing slash is normalized (ignored).
 *
 * Segments that are not valid identifiers use bracket notation: ['segment']
 */
export declare function pathToQuery(urlPath: string): string;
