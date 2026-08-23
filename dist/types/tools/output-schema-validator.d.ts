/**
 * Shared output-schema validation for subagent yield + executor finalization.
 *
 * Both the in-process `yield` tool (subagent side) and the executor's post-mortem
 * finalize path (parent side) need to validate yield payloads against the agent's
 * declared output schema. This module is the single source of truth for that
 * pipeline — keeping the two callsites in lockstep so a schema accepted in-tool
 * cannot be rejected post-mortem (or vice versa).
 */
import { type JsonSchemaValidationIssue, type JsonSchemaValidationResult } from "@oh-my-pi/pi-ai/utils/schema";
/** A validator bound to a specific output schema. */
export interface OutputValidator {
    /** Run JSON Schema validation; returns the raw `success`/`issues` shape so callers may inspect every failure. */
    validate(value: unknown): JsonSchemaValidationResult;
    /** Top-level required property names. Empty if the schema has no `required` array at root. */
    readonly requiredFields: readonly string[];
    /**
     * Per-label validators for incremental yields (`type: ["<label>"]`). Each entry validates the
     * `data` payload of a single section against the matching top-level property's sub-schema —
     * array-typed properties (e.g. `findings`) use the items schema since each yield contributes
     * one element, while scalar properties use the property schema directly.
     */
    readonly validateSection: ReadonlyMap<string, (value: unknown) => JsonSchemaValidationResult>;
    /** Whether top-level schema closure makes unknown incremental yield labels invalid. */
    readonly rejectUnknownSections: boolean;
    /** Finite top-level section labels declared directly by the schema. Pattern-backed labels are accepted via `isKnownSection`. */
    readonly knownSectionLabels: readonly string[];
    /** Whether an incremental yield label is accepted by the top-level schema declaration. */
    isKnownSection(label: string): boolean;
}
export interface BuildOutputValidatorResult {
    /** Present when the schema produced a usable validator (i.e. constraining schemas). Absent for missing/unconstrained schemas. */
    validator?: OutputValidator;
    /** Raw JSON Schema produced by `jtdToJsonSchema`. Available alongside the validator so callers can derive related artifacts (strict-mode probe, dereference, hint text). */
    jsonSchema?: Record<string, unknown>;
    /**
     * Normalized schema (post-`normalizeSchema`). Surfaced so callers can distinguish
     * "no schema provided" (`undefined`) from "intentionally unconstrained" (`true`)
     * when both produce no validator.
     */
    normalized?: unknown;
    /** Set when the schema cannot be used. Callers should treat this as a "no validation" case (loose acceptance) and surface the message in diagnostics. */
    error?: string;
}
/**
 * Build the canonical validator for a JTD-or-JSON-Schema output declaration.
 *
 * Returns:
 * - `{ validator, jsonSchema, normalized }` for constraining schemas — both callers use this path.
 * - `{ normalized: true }` for an intentionally unconstrained schema (the JSON Schema literal `true`).
 *   No validator, but distinguishable from "no schema provided".
 * - `{}` for an absent schema (`undefined`).
 * - `{ error, normalized? }` when the schema cannot be honored (invalid syntax, `false`, malformed JTD).
 */
export declare function buildOutputValidator(schema: unknown): BuildOutputValidatorResult;
/** Produce the executor's headline+missing-required summary from a failed validation. */
export declare function summarizeValidationFailure(result: JsonSchemaValidationResult, value: unknown, requiredFields: readonly string[]): {
    message: string;
    missingRequired: string[];
};
export declare function extractRequiredFields(jsonSchema: unknown): string[];
export declare function computeMissingRequired(required: readonly string[], value: unknown): string[];
/**
 * Format a single validation issue as `path.with.dots: message`.
 *
 * Used by the executor's post-mortem `schema_violation` headline — one line, dot-separated path,
 * since the executor's error format already lists missing-required fields separately.
 */
export declare function formatValidationIssueHeadline(issue: JsonSchemaValidationIssue | undefined): string | undefined;
/**
 * Format every validation issue as `path/with/slashes: message; ...`.
 *
 * Used by the yield tool's model-facing retry feedback — the model gets every problem at once so it
 * can fix the entire output in one retry instead of iterating issue-by-issue. The slash separator
 * mirrors JSON Pointer convention and disambiguates against fields whose names contain dots.
 */
export declare function formatAllValidationIssues(issues: ReadonlyArray<JsonSchemaValidationIssue> | undefined): string;
