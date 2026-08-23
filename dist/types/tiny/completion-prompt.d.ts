import type { TextGenerationPipeline } from "@huggingface/transformers";
export declare function buildCompletionPrompt(tokenizer: TextGenerationPipeline["tokenizer"], promptText: string, systemPrompt?: string): string;
