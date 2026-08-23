/**
 * Convert JSON Type Definition (JTD) to TypeScript interface notation.
 *
 * Produces human-readable TypeScript for embedding in system prompts,
 * helping models understand expected output structure.
 */
/**
 * Convert JTD schema to TypeScript interface string.
 *
 * @example
 * ```ts
 * const schema = {
 *   properties: {
 *     name: { type: "string" },
 *     count: { type: "int32" }
 *   }
 * };
 * jtdToTypeScript(schema);
 * // Returns:
 * // {
 * //   name: string;
 * //   count: number;
 * // }
 * ```
 */
export declare function jtdToTypeScript(schema: unknown): string;
