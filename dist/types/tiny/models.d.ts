/** Default session-title model: the online @smol path (no local download / on-device inference). */
export declare const ONLINE_TINY_TITLE_MODEL_KEY = "online";
/** Local model the `tiny-models` CLI downloads when none is named. Not the session-title default — that is {@link ONLINE_TINY_TITLE_MODEL_KEY}. */
export declare const DEFAULT_TINY_TITLE_LOCAL_MODEL_KEY = "lfm2-700m";
export interface TinyTitleLocalModelSpec {
    key: string;
    repo: string;
    dtype: "q4";
    label: string;
    description: string;
    contextNote: string;
    /** Model family emits hidden reasoning unless the chat template disables it. */
    reasoning?: boolean;
    /** Reason this model is blocked before loading the ONNX runtime. */
    unsupportedReason?: string;
}
export declare const TINY_TITLE_LOCAL_MODELS: readonly [{
    readonly key: "lfm2-350m";
    readonly repo: "onnx-community/LFM2-350M-ONNX";
    readonly dtype: "q4";
    readonly label: "LFM2 350M";
    readonly description: "Recommended local model; best speed/quality balance, about 212 MB cached.";
    readonly contextNote: "Best local default from the title-generation spike.";
}, {
    readonly key: "qwen3-0.6b";
    readonly repo: "onnx-community/Qwen3-0.6B-ONNX";
    readonly dtype: "q4";
    readonly label: "Qwen3 0.6B";
    readonly description: "Most robust local option; slower first load, about 500 MB cached.";
    readonly contextNote: "Use when title quality matters more than local startup cost.";
    readonly reasoning: true;
}, {
    readonly key: "gemma-270m";
    readonly repo: "onnx-community/gemma-3-270m-it-ONNX";
    readonly dtype: "q4";
    readonly label: "Gemma 270M";
    readonly description: "Smallest viable local option; lower quality, lowest cache footprint.";
    readonly contextNote: "Use on constrained machines that still need local titles.";
}, {
    readonly key: "qwen2.5-0.5b";
    readonly repo: "onnx-community/Qwen2.5-0.5B-Instruct";
    readonly dtype: "q4";
    readonly label: "Qwen2.5 0.5B";
    readonly description: "Balanced local fallback; moderate quality and cache footprint.";
    readonly contextNote: "Useful when Qwen3 is too heavy but Gemma quality is insufficient.";
}, {
    readonly key: "lfm2-700m";
    readonly repo: "onnx-community/LFM2-700M-ONNX";
    readonly dtype: "q4";
    readonly label: "LFM2 700M";
    readonly description: "Highest-quality local option; larger and slower than LFM2 350M.";
    readonly contextNote: "Use when local title quality is preferred over startup cost.";
}];
export declare const TINY_TITLE_MODEL_VALUES: readonly ["online", "lfm2-350m", "qwen3-0.6b", "gemma-270m", "qwen2.5-0.5b", "lfm2-700m"];
export type TinyTitleModelKey = (typeof TINY_TITLE_MODEL_VALUES)[number];
export type TinyTitleLocalModelKey = (typeof TINY_TITLE_LOCAL_MODELS)[number]["key"];
export declare const TINY_TITLE_MODEL_OPTIONS: ({
    value: "online";
    label: string;
    description: string;
} | {
    value: "gemma-270m" | "lfm2-350m" | "lfm2-700m" | "qwen2.5-0.5b" | "qwen3-0.6b";
    label: "Gemma 270M" | "LFM2 350M" | "LFM2 700M" | "Qwen2.5 0.5B" | "Qwen3 0.6B";
    description: "Balanced local fallback; moderate quality and cache footprint." | "Highest-quality local option; larger and slower than LFM2 350M." | "Most robust local option; slower first load, about 500 MB cached." | "Recommended local model; best speed/quality balance, about 212 MB cached." | "Smallest viable local option; lower quality, lowest cache footprint.";
})[];
export declare function isTinyTitleLocalModelKey(value: string): value is TinyTitleLocalModelKey;
export declare function getTinyTitleModelSpec(key: TinyTitleLocalModelKey): (typeof TINY_TITLE_LOCAL_MODELS)[number];
/** Default memory model: the online path (the configured smol / remote LLM; no local download). */
export declare const ONLINE_MEMORY_MODEL_KEY = "online";
/** Recommended local model for memory tasks when none is named. */
export declare const DEFAULT_MEMORY_LOCAL_MODEL_KEY = "lfm2-1.2b";
/**
 * Local models for Mnemopi memory tasks (fact extraction + consolidation).
 * These are larger (1B-1.7B) than the title models: structured extraction and
 * faithful summarization need more capacity than 3-6 word titles. All q4.
 * Ranking/recipe rationale lives in docs/local-models.md.
 */
export declare const TINY_MEMORY_LOCAL_MODELS: readonly [{
    readonly key: "qwen3-1.7b";
    readonly repo: "onnx-community/Qwen3-1.7B-ONNX";
    readonly dtype: "q4";
    readonly label: "Qwen3 1.7B";
    readonly description: "Disabled for local inference: onnxruntime-node cannot run this ONNX export's RotaryEmbedding cache updates.";
    readonly contextNote: "Blocked before load to avoid the unsupported RotaryEmbedding runtime path.";
    readonly reasoning: true;
    readonly unsupportedReason: "onnxruntime-node does not support Qwen3 RotaryEmbedding cache updates in onnx-community/Qwen3-1.7B-ONNX";
}, {
    readonly key: "llama3.2:3b";
    readonly repo: "onnx-community/Llama-3.2-3B-Instruct-ONNX";
    readonly dtype: "q4";
    readonly label: "Llama 3.2 3B";
    readonly description: "Larger Llama 3.2 option for local memory/classifier tasks; higher quality potential at higher disk/RAM/latency cost.";
    readonly contextNote: "Use when larger model capacity is preferred over faster load times.";
}, {
    readonly key: "gemma-3-1b";
    readonly repo: "onnx-community/gemma-3-1b-it-ONNX";
    readonly dtype: "q4";
    readonly label: "Gemma 3 1B";
    readonly description: "Best consolidation/dedup; lighter footprint, but leaks small talk during extraction.";
    readonly contextNote: "Use when consolidation quality and size matter most.";
}, {
    readonly key: "qwen2.5-1.5b";
    readonly repo: "onnx-community/Qwen2.5-1.5B-Instruct";
    readonly dtype: "q4";
    readonly label: "Qwen2.5 1.5B";
    readonly description: "Best extraction granularity (atomic facts); weaker consolidation.";
    readonly contextNote: "Use when fine-grained, deduplicatable facts matter more than summaries.";
}, {
    readonly key: "lfm2-1.2b";
    readonly repo: "onnx-community/LFM2-1.2B-ONNX";
    readonly dtype: "q4";
    readonly label: "LFM2 1.2B";
    readonly description: "Fastest load; solid all-rounder, slightly noisier extraction labels.";
    readonly contextNote: "Use when local startup cost is the priority.";
}];
export declare const TINY_MEMORY_MODEL_VALUES: readonly ["online", "qwen3-1.7b", "llama3.2:3b", "gemma-3-1b", "qwen2.5-1.5b", "lfm2-1.2b"];
export type TinyMemoryModelKey = (typeof TINY_MEMORY_MODEL_VALUES)[number];
export type TinyMemoryLocalModelKey = (typeof TINY_MEMORY_LOCAL_MODELS)[number]["key"];
export declare const TINY_MEMORY_MODEL_OPTIONS: ({
    value: "online";
    label: string;
    description: string;
} | {
    value: "gemma-3-1b" | "lfm2-1.2b" | "llama3.2:3b" | "qwen2.5-1.5b" | "qwen3-1.7b";
    label: "Gemma 3 1B" | "LFM2 1.2B" | "Llama 3.2 3B" | "Qwen2.5 1.5B" | "Qwen3 1.7B";
    description: "Best consolidation/dedup; lighter footprint, but leaks small talk during extraction." | "Best extraction granularity (atomic facts); weaker consolidation." | "Disabled for local inference: onnxruntime-node cannot run this ONNX export's RotaryEmbedding cache updates." | "Fastest load; solid all-rounder, slightly noisier extraction labels." | "Larger Llama 3.2 option for local memory/classifier tasks; higher quality potential at higher disk/RAM/latency cost.";
})[];
export declare function isTinyMemoryLocalModelKey(value: string): value is TinyMemoryLocalModelKey;
export declare function getTinyMemoryModelSpec(key: TinyMemoryLocalModelKey): (typeof TINY_MEMORY_LOCAL_MODELS)[number];
/** Return whether a memory local model may emit reasoning tokens before answers. */
export declare function isTinyMemoryReasoningModelKey(key: TinyMemoryLocalModelKey): boolean;
/** Any local model key (title or memory), used by the shared inference worker. */
export type TinyLocalModelKey = TinyTitleLocalModelKey | TinyMemoryLocalModelKey;
/** Resolve a local model spec by key across both the title and memory registries. */
export declare function getTinyLocalModelSpec(key: string): TinyTitleLocalModelSpec | undefined;
export declare function isTinyLocalModelKey(value: string): value is TinyLocalModelKey;
/** Combined local model registry (title + memory) for the shared tiny-models CLI. */
export declare const TINY_LOCAL_MODELS: readonly [{
    readonly key: "lfm2-350m";
    readonly repo: "onnx-community/LFM2-350M-ONNX";
    readonly dtype: "q4";
    readonly label: "LFM2 350M";
    readonly description: "Recommended local model; best speed/quality balance, about 212 MB cached.";
    readonly contextNote: "Best local default from the title-generation spike.";
}, {
    readonly key: "qwen3-0.6b";
    readonly repo: "onnx-community/Qwen3-0.6B-ONNX";
    readonly dtype: "q4";
    readonly label: "Qwen3 0.6B";
    readonly description: "Most robust local option; slower first load, about 500 MB cached.";
    readonly contextNote: "Use when title quality matters more than local startup cost.";
    readonly reasoning: true;
}, {
    readonly key: "gemma-270m";
    readonly repo: "onnx-community/gemma-3-270m-it-ONNX";
    readonly dtype: "q4";
    readonly label: "Gemma 270M";
    readonly description: "Smallest viable local option; lower quality, lowest cache footprint.";
    readonly contextNote: "Use on constrained machines that still need local titles.";
}, {
    readonly key: "qwen2.5-0.5b";
    readonly repo: "onnx-community/Qwen2.5-0.5B-Instruct";
    readonly dtype: "q4";
    readonly label: "Qwen2.5 0.5B";
    readonly description: "Balanced local fallback; moderate quality and cache footprint.";
    readonly contextNote: "Useful when Qwen3 is too heavy but Gemma quality is insufficient.";
}, {
    readonly key: "lfm2-700m";
    readonly repo: "onnx-community/LFM2-700M-ONNX";
    readonly dtype: "q4";
    readonly label: "LFM2 700M";
    readonly description: "Highest-quality local option; larger and slower than LFM2 350M.";
    readonly contextNote: "Use when local title quality is preferred over startup cost.";
}, {
    readonly key: "qwen3-1.7b";
    readonly repo: "onnx-community/Qwen3-1.7B-ONNX";
    readonly dtype: "q4";
    readonly label: "Qwen3 1.7B";
    readonly description: "Disabled for local inference: onnxruntime-node cannot run this ONNX export's RotaryEmbedding cache updates.";
    readonly contextNote: "Blocked before load to avoid the unsupported RotaryEmbedding runtime path.";
    readonly reasoning: true;
    readonly unsupportedReason: "onnxruntime-node does not support Qwen3 RotaryEmbedding cache updates in onnx-community/Qwen3-1.7B-ONNX";
}, {
    readonly key: "llama3.2:3b";
    readonly repo: "onnx-community/Llama-3.2-3B-Instruct-ONNX";
    readonly dtype: "q4";
    readonly label: "Llama 3.2 3B";
    readonly description: "Larger Llama 3.2 option for local memory/classifier tasks; higher quality potential at higher disk/RAM/latency cost.";
    readonly contextNote: "Use when larger model capacity is preferred over faster load times.";
}, {
    readonly key: "gemma-3-1b";
    readonly repo: "onnx-community/gemma-3-1b-it-ONNX";
    readonly dtype: "q4";
    readonly label: "Gemma 3 1B";
    readonly description: "Best consolidation/dedup; lighter footprint, but leaks small talk during extraction.";
    readonly contextNote: "Use when consolidation quality and size matter most.";
}, {
    readonly key: "qwen2.5-1.5b";
    readonly repo: "onnx-community/Qwen2.5-1.5B-Instruct";
    readonly dtype: "q4";
    readonly label: "Qwen2.5 1.5B";
    readonly description: "Best extraction granularity (atomic facts); weaker consolidation.";
    readonly contextNote: "Use when fine-grained, deduplicatable facts matter more than summaries.";
}, {
    readonly key: "lfm2-1.2b";
    readonly repo: "onnx-community/LFM2-1.2B-ONNX";
    readonly dtype: "q4";
    readonly label: "LFM2 1.2B";
    readonly description: "Fastest load; solid all-rounder, slightly noisier extraction labels.";
    readonly contextNote: "Use when local startup cost is the priority.";
}];
/**
 * Difficulty-classifier model for the `auto` thinking level. Defaults to the
 * online smol path; the local options reuse the memory-model registry because
 * the shared worker's `complete()` only accepts memory local keys, and the
 * 1B+ memory models classify coding difficulty far more reliably than the
 * sub-1B title models.
 */
export declare const ONLINE_AUTO_THINKING_MODEL_KEY = "online";
export declare const AUTO_THINKING_MODEL_VALUES: readonly ["online", "qwen3-1.7b", "llama3.2:3b", "gemma-3-1b", "qwen2.5-1.5b", "lfm2-1.2b"];
export type AutoThinkingModelKey = TinyMemoryModelKey;
export declare const AUTO_THINKING_MODEL_OPTIONS: ({
    value: "online";
    label: string;
    description: string;
} | {
    value: "gemma-3-1b" | "lfm2-1.2b" | "llama3.2:3b" | "qwen2.5-1.5b" | "qwen3-1.7b";
    label: "Gemma 3 1B" | "LFM2 1.2B" | "Llama 3.2 3B" | "Qwen2.5 1.5B" | "Qwen3 1.7B";
    description: "Best consolidation/dedup; lighter footprint, but leaks small talk during extraction." | "Best extraction granularity (atomic facts); weaker consolidation." | "Disabled for local inference: onnxruntime-node cannot run this ONNX export's RotaryEmbedding cache updates." | "Fastest load; solid all-rounder, slightly noisier extraction labels." | "Larger Llama 3.2 option for local memory/classifier tasks; higher quality potential at higher disk/RAM/latency cost.";
})[];
