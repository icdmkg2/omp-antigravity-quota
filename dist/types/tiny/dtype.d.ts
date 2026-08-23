import type { DataType } from "@huggingface/transformers";
/** ONNX quantization / precision for local tiny models (transformers.js `dtype`). */
export type TinyModelDtype = DataType;
/**
 * Validate and canonicalize a `PI_TINY_DTYPE` value. Returns `undefined` when
 * unset/blank so callers fall back to the per-model spec dtype, and throws on an
 * unrecognized value so a misconfiguration fails loudly instead of silently
 * loading a different precision than requested.
 */
export declare function normalizeTinyModelDtype(value: string | undefined): TinyModelDtype | undefined;
/**
 * Resolve the `PI_TINY_DTYPE` override. `undefined` means "use the per-model spec
 * dtype" (currently `q4` for every shipped model); a concrete value overrides the
 * precision for whichever local tiny model loads.
 */
export declare function resolveTinyModelDtypeOverride(value?: string | undefined): TinyModelDtype | undefined;
/** Sentinel `providers.tinyModelDtype` value meaning "use each model's shipped dtype". */
export declare const TINY_MODEL_DTYPE_DEFAULT = "default";
/** Accepted values for the `providers.tinyModelDtype` setting (validation + UI). */
export declare const TINY_MODEL_DTYPE_SETTING_VALUES: readonly ["default", "q4", "q4f16", "q8", "fp16", "fp32", "int8", "uint8", "bnb4", "q2", "q2f16", "q1", "q1f16", "auto"];
/** Submenu metadata for the `providers.tinyModelDtype` setting. */
export declare const TINY_MODEL_DTYPE_SETTING_OPTIONS: readonly [{
    readonly value: "default";
    readonly label: "Default";
    readonly description: "Each model's shipped dtype (currently q4)";
}, {
    readonly value: "q4";
    readonly label: "q4";
    readonly description: "4-bit weights; smallest and fastest";
}, {
    readonly value: "q4f16";
    readonly label: "q4f16";
    readonly description: "4-bit weights with fp16 activations";
}, {
    readonly value: "q8";
    readonly label: "q8";
    readonly description: "8-bit quantization";
}, {
    readonly value: "fp16";
    readonly label: "fp16";
    readonly description: "16-bit float; higher fidelity, larger";
}, {
    readonly value: "fp32";
    readonly label: "fp32";
    readonly description: "Full precision; largest and slowest";
}, {
    readonly value: "int8";
    readonly label: "int8";
    readonly description: "Signed 8-bit integer";
}, {
    readonly value: "uint8";
    readonly label: "uint8";
    readonly description: "Unsigned 8-bit integer";
}, {
    readonly value: "bnb4";
    readonly label: "bnb4";
    readonly description: "bitsandbytes 4-bit";
}, {
    readonly value: "q2";
    readonly label: "q2";
    readonly description: "2-bit weights";
}, {
    readonly value: "q2f16";
    readonly label: "q2f16";
    readonly description: "2-bit weights with fp16 activations";
}, {
    readonly value: "q1";
    readonly label: "q1";
    readonly description: "1-bit weights";
}, {
    readonly value: "q1f16";
    readonly label: "q1f16";
    readonly description: "1-bit weights with fp16 activations";
}, {
    readonly value: "auto";
    readonly label: "Auto";
    readonly description: "Let transformers.js choose per device";
}];
/**
 * Map a `providers.tinyModelDtype` setting value onto a `PI_TINY_DTYPE` env value
 * for the worker. Returns `undefined` for the default sentinel so the worker keeps
 * each model's shipped dtype; the worker still validates the forwarded value via
 * {@link normalizeTinyModelDtype}.
 */
export declare function tinyModelDtypeSettingToEnv(value: string | undefined): string | undefined;
