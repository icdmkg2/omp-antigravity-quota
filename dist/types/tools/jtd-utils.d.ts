/**
 * JSON Type Definition (JTD) utility types and guards.
 *
 * Shared type definitions and type guard functions for JTD schema validation.
 *
 * @see https://jsontypedef.com/
 * @see https://datatracker.ietf.org/doc/html/rfc8927
 */
export type JTDPrimitive = "boolean" | "string" | "timestamp" | "float32" | "float64" | "int8" | "uint8" | "int16" | "uint16" | "int32" | "uint32";
export interface JTDType {
    type: JTDPrimitive;
}
export interface JTDEnum {
    enum: string[];
}
export interface JTDElements {
    elements: JTDSchema;
}
export interface JTDValues {
    values: JTDSchema;
}
export interface JTDProperties {
    properties?: Record<string, JTDSchema>;
    optionalProperties?: Record<string, JTDSchema>;
}
export interface JTDDiscriminator {
    discriminator: string;
    mapping: Record<string, JTDProperties>;
}
export interface JTDRef {
    ref: string;
}
export interface JTDEmpty {
}
export type JTDSchema = JTDType | JTDEnum | JTDElements | JTDValues | JTDProperties | JTDDiscriminator | JTDRef | JTDEmpty;
export declare function isJTDType(schema: unknown): schema is JTDType;
export declare function isJTDEnum(schema: unknown): schema is JTDEnum;
export declare function isJTDElements(schema: unknown): schema is JTDElements;
export declare function isJTDValues(schema: unknown): schema is JTDValues;
export declare function isJTDProperties(schema: unknown): schema is JTDProperties;
export declare function isJTDDiscriminator(schema: unknown): schema is JTDDiscriminator;
export declare function isJTDRef(schema: unknown): schema is JTDRef;
