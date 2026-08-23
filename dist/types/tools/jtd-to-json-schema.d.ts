/**
 * Convert JSON Type Definition (JTD) to JSON Schema.
 *
 * JTD (RFC 8927) is a simpler schema format. This converter allows users to
 * write schemas in JTD and have them converted to JSON Schema for model APIs.
 *
 * @see https://jsontypedef.com/
 * @see https://datatracker.ietf.org/doc/html/rfc8927
 */
/**
 * Detect if a schema is JTD format (vs JSON Schema).
 *
 * JTD schemas use: type (primitives), properties, optionalProperties, elements, values, enum, discriminator, ref
 * JSON Schema uses: type: "object", type: "array", items, additionalProperties, etc.
 */
export declare function isJTDSchema(schema: unknown): boolean;
/**
 * Convert JTD schema to JSON Schema.
 * If already JSON Schema, returns as-is.
 */
export declare function jtdToJsonSchema(schema: unknown): unknown;
/**
 * Normalize a schema input that may be a JSON string, object, or null/undefined.
 * Returns { normalized } on success, or { error } if JSON parsing fails.
 */
export declare function normalizeSchema(schema: unknown): {
    normalized?: unknown;
    error?: string;
};
