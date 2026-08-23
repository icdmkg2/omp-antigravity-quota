import type { YieldItem } from "./types.js";
/** Outcome of folding a run's yield calls into one payload, with provenance flags. */
interface AssembledYieldResult {
    data: unknown;
    schemaOverridden: boolean;
    rawText: boolean;
    missingData: boolean;
}
/**
 * Top-level output-schema property names declared as arrays (JTD `elements` →
 * JSON `type: "array"`). An incremental yield section for such a label
 * accumulates into a list even when the agent emits exactly one — otherwise a
 * single `type: ["findings"]` yield would assemble as a bare object and fail
 * array-typed schema validation.
 */
export declare function arrayValuedLabels(outputSchema: unknown): ReadonlySet<string>;
/**
 * Assemble typed yield calls into the final payload consumed by schema validation.
 *
 * A non-empty array `type` contributes an incremental section and never decides
 * termination by itself. A string `type` with omitted `data` makes the last
 * assistant turn the raw terminal result. Other string-typed yields contribute
 * the terminal labelled section. Untyped terminal yields keep the historical
 * "last yield wins" behavior unless no terminal yield exists, in which case
 * accumulated typed sections finalize on idle.
 */
export declare function assembleYieldResult(yieldItems: YieldItem[], lastAssistantText?: string, arrayLabels?: ReadonlySet<string>): AssembledYieldResult | undefined;
export {};
