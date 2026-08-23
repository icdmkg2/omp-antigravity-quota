import type { ProgressInfo, TextGenerationPipeline, StoppingCriteria as TransformersStoppingCriteria } from "@huggingface/transformers";
import { type TransformersRuntimeMetadata } from "../subprocess/worker-runtime.js";
import { type TinyModelDevice } from "./device.js";
import { type TinyModelDtype } from "./dtype.js";
import type { TinyTitleTransport } from "./title-protocol.js";
export interface TransformersRuntime extends TransformersRuntimeMetadata {
    env: {
        cacheDir?: string;
        allowLocalModels?: boolean;
        logLevel?: unknown;
    };
    LogLevel: {
        ERROR: unknown;
    };
    StoppingCriteria: new () => TransformersStoppingCriteria;
    pipeline: (task: "text-generation", model: string, options: {
        device: TinyModelDevice;
        dtype: TinyModelDtype;
        progress_callback: (info: ProgressInfo) => void;
    }) => Promise<TextGenerationPipeline>;
}
/** Stops generation at the first occurrence of `text` in the *generated* tokens.
 *
 *  The window must be anchored to the generation boundary, not to the end of the
 *  whole sequence: a prompt that itself contains the stop string (chat-level
 *  few-shot examples ending in `</title>`, for instance) would otherwise match on
 *  prompt tokens and stop before the model emits anything. */
export declare function createStopOnTextCriteria(transformers: TransformersRuntime, tokenizer: TextGenerationPipeline["tokenizer"], text: string): TransformersStoppingCriteria;
export declare function startTinyTitleWorker(transport: TinyTitleTransport): void;
