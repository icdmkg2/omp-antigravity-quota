import type { DeviceType } from "@huggingface/transformers";
export type TinyModelDevice = DeviceType;
export interface TinyModelDevicePreference {
    device: TinyModelDevice;
    raw: string | undefined;
}
export declare function normalizeTinyModelDevice(value: string | undefined): TinyModelDevice | undefined;
export declare function resolveTinyModelDevicePreference(value?: string | undefined): TinyModelDevicePreference;
export declare function tinyModelDeviceLoadOrder(preference: TinyModelDevicePreference): readonly TinyModelDevice[];
/** Sentinel `providers.tinyModelDevice` value meaning "use the built-in CPU default". */
export declare const TINY_MODEL_DEVICE_DEFAULT = "default";
/** Accepted values for the `providers.tinyModelDevice` setting (validation + UI). */
export declare const TINY_MODEL_DEVICE_SETTING_VALUES: readonly ["default", "gpu", "cpu", "metal", "webgpu", "cuda", "dml", "coreml", "auto", "wasm", "webnn", "webnn-gpu", "webnn-cpu", "webnn-npu"];
/** Submenu metadata for the `providers.tinyModelDevice` setting. */
export declare const TINY_MODEL_DEVICE_SETTING_OPTIONS: readonly [{
    readonly value: "default";
    readonly label: "Default";
    readonly description: "CPU-only inference";
}, {
    readonly value: "gpu";
    readonly label: "GPU";
    readonly description: "Accelerated provider (WebGPU/Metal, CUDA, or DirectML)";
}, {
    readonly value: "cpu";
    readonly label: "CPU";
    readonly description: "CPU-only inference";
}, {
    readonly value: "metal";
    readonly label: "Metal";
    readonly description: "WebGPU alias for Apple GPUs";
}, {
    readonly value: "webgpu";
    readonly label: "WebGPU";
    readonly description: "WebGPU/Metal backend";
}, {
    readonly value: "cuda";
    readonly label: "CUDA";
    readonly description: "NVIDIA CUDA (Linux x64)";
}, {
    readonly value: "dml";
    readonly label: "DirectML";
    readonly description: "DirectML backend (Windows)";
}, {
    readonly value: "coreml";
    readonly label: "CoreML";
    readonly description: "Apple CoreML (opt-in; can fail to load)";
}, {
    readonly value: "auto";
    readonly label: "Auto";
    readonly description: "Let ONNX Runtime choose a provider";
}, {
    readonly value: "wasm";
    readonly label: "WASM";
    readonly description: "WebAssembly backend";
}, {
    readonly value: "webnn";
    readonly label: "WebNN";
    readonly description: "WebNN backend";
}, {
    readonly value: "webnn-gpu";
    readonly label: "WebNN GPU";
    readonly description: "WebNN GPU device";
}, {
    readonly value: "webnn-cpu";
    readonly label: "WebNN CPU";
    readonly description: "WebNN CPU device";
}, {
    readonly value: "webnn-npu";
    readonly label: "WebNN NPU";
    readonly description: "WebNN NPU device";
}];
/**
 * Map a `providers.tinyModelDevice` setting value onto a `PI_TINY_DEVICE` env
 * value for the worker. Returns `undefined` for the default sentinel so the
 * worker keeps its built-in CPU default; the worker still validates the
 * forwarded value via {@link normalizeTinyModelDevice}.
 */
export declare function tinyModelDeviceSettingToEnv(value: string | undefined): string | undefined;
