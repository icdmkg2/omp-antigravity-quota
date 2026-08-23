/**
 * Custom model/provider config file handle and validation.
 */
import type { Api, ModelSpec } from "@oh-my-pi/pi-ai/types";
import { ConfigFile } from "./config-file.js";
import type { ProviderAuthMode, ProviderDiscovery } from "./models-config-schema.js";
export type ProviderValidationMode = "models-config" | "runtime-register";
export interface ProviderValidationModel {
    id: string;
    api?: Api;
    contextWindow?: number;
    supportsTools?: boolean;
    maxTokens?: number;
}
export interface ProviderValidationConfig {
    baseUrl?: string;
    headers?: Record<string, string>;
    apiKey?: string;
    api?: Api;
    auth?: ProviderAuthMode;
    oauthConfigured?: boolean;
    discovery?: ProviderDiscovery;
    compat?: ModelSpec<Api>["compat"];
    remoteCompaction?: unknown;
    disableStrictTools?: boolean;
    guardrailIdentifier?: string;
    modelOverrides?: Record<string, unknown>;
    models: ProviderValidationModel[];
}
export declare function validateProviderConfiguration(providerName: string, config: ProviderValidationConfig, mode: ProviderValidationMode): void;
export declare const ModelsConfigFile: ConfigFile<{
    providers?: Record<string, {
        api?: "anthropic-messages" | "azure-openai-responses" | "bedrock-converse-stream" | "google-gemini-cli" | "google-generative-ai" | "google-vertex" | "openai-codex-responses" | "openai-completions" | "openai-responses" | undefined;
        apiKey?: string | undefined;
        auth?: "apiKey" | "none" | "oauth" | undefined;
        authHeader?: boolean | undefined;
        baseUrl?: string | undefined;
        compat?: ({
            allowAnthropicHeaderOverrides?: boolean | undefined;
            allowsSyntheticReasoningContentForToolCalls?: boolean | undefined;
            alwaysSendMaxTokens?: boolean | undefined;
            cacheControlFormat?: "anthropic" | undefined;
            disableReasoningOnForcedToolChoice?: boolean | undefined;
            disableReasoningOnToolChoice?: boolean | undefined;
            extraBody?: Record<string, unknown> | undefined;
            maxTokensField?: "max_completion_tokens" | "max_tokens" | undefined;
            openRouterRouting?: {
                only?: string[] | undefined;
                order?: string[] | undefined;
            } | undefined;
            qwenTemplateReasoningEffort?: boolean | undefined;
            reasoningContentField?: "reasoning" | "reasoning_content" | "reasoning_text" | undefined;
            reasoningEffortMap?: {
                high?: string | undefined;
                low?: string | undefined;
                max?: string | undefined;
                medium?: string | undefined;
                minimal?: string | undefined;
                xhigh?: string | undefined;
            } | undefined;
            replayUnsignedThinking?: boolean | undefined;
            requiresAssistantAfterToolResult?: boolean | undefined;
            requiresAssistantContentForToolCalls?: boolean | undefined;
            requiresMistralToolIds?: boolean | undefined;
            requiresReasoningContentForToolCalls?: boolean | undefined;
            requiresThinkingAsText?: boolean | undefined;
            requiresToolResultId?: boolean | undefined;
            requiresToolResultName?: boolean | undefined;
            streamIdleTimeoutMs?: number | undefined;
            streamMarkupHealingPattern?: "dsml" | "kimi" | "qwen" | "thinking" | undefined;
            strictResponsesPairing?: boolean | undefined;
            supportsDeveloperRole?: boolean | undefined;
            supportsEagerToolInputStreaming?: boolean | undefined;
            supportsForcedToolChoice?: boolean | undefined;
            supportsImageDetailOriginal?: boolean | undefined;
            supportsLongPromptCacheRetention?: boolean | undefined;
            supportsMultipleSystemMessages?: boolean | undefined;
            supportsReasoningEffort?: boolean | undefined;
            supportsReasoningParams?: boolean | undefined;
            supportsStore?: boolean | undefined;
            supportsStrictMode?: boolean | undefined;
            supportsToolChoice?: boolean | undefined;
            supportsUsageInStreaming?: boolean | undefined;
            thinkingFormat?: "openai" | "openrouter" | "qwen" | "qwen-chat-template" | "zai" | undefined;
            toolStrictMode?: "all_strict" | "none" | undefined;
            vercelGatewayRouting?: {
                only?: string[] | undefined;
                order?: string[] | undefined;
            } | undefined;
            whenThinking?: {
                allowAnthropicHeaderOverrides?: boolean | undefined;
                allowsSyntheticReasoningContentForToolCalls?: boolean | undefined;
                alwaysSendMaxTokens?: boolean | undefined;
                cacheControlFormat?: "anthropic" | undefined;
                disableReasoningOnForcedToolChoice?: boolean | undefined;
                disableReasoningOnToolChoice?: boolean | undefined;
                extraBody?: Record<string, unknown> | undefined;
                maxTokensField?: "max_completion_tokens" | "max_tokens" | undefined;
                openRouterRouting?: {
                    only?: string[] | undefined;
                    order?: string[] | undefined;
                } | undefined;
                qwenTemplateReasoningEffort?: boolean | undefined;
                reasoningContentField?: "reasoning" | "reasoning_content" | "reasoning_text" | undefined;
                reasoningEffortMap?: {
                    high?: string | undefined;
                    low?: string | undefined;
                    max?: string | undefined;
                    medium?: string | undefined;
                    minimal?: string | undefined;
                    xhigh?: string | undefined;
                } | undefined;
                replayUnsignedThinking?: boolean | undefined;
                requiresAssistantAfterToolResult?: boolean | undefined;
                requiresAssistantContentForToolCalls?: boolean | undefined;
                requiresMistralToolIds?: boolean | undefined;
                requiresReasoningContentForToolCalls?: boolean | undefined;
                requiresThinkingAsText?: boolean | undefined;
                requiresToolResultId?: boolean | undefined;
                requiresToolResultName?: boolean | undefined;
                streamIdleTimeoutMs?: number | undefined;
                streamMarkupHealingPattern?: "dsml" | "kimi" | "qwen" | "thinking" | undefined;
                strictResponsesPairing?: boolean | undefined;
                supportsDeveloperRole?: boolean | undefined;
                supportsEagerToolInputStreaming?: boolean | undefined;
                supportsForcedToolChoice?: boolean | undefined;
                supportsImageDetailOriginal?: boolean | undefined;
                supportsLongPromptCacheRetention?: boolean | undefined;
                supportsMultipleSystemMessages?: boolean | undefined;
                supportsReasoningEffort?: boolean | undefined;
                supportsReasoningParams?: boolean | undefined;
                supportsStore?: boolean | undefined;
                supportsStrictMode?: boolean | undefined;
                supportsToolChoice?: boolean | undefined;
                supportsUsageInStreaming?: boolean | undefined;
                thinkingFormat?: "openai" | "openrouter" | "qwen" | "qwen-chat-template" | "zai" | undefined;
                toolStrictMode?: "all_strict" | "none" | undefined;
                vercelGatewayRouting?: {
                    only?: string[] | undefined;
                    order?: string[] | undefined;
                } | undefined;
            } | undefined;
        } & {
            promptCacheMaximumCheckpoints?: number | undefined;
            promptCacheMinimumTokens?: number | undefined;
            promptCacheMode?: "automatic" | "explicit" | "none" | undefined;
            supportsLongPromptCacheRetention?: boolean | undefined;
        }) | undefined;
        disableStrictTools?: boolean | undefined;
        discovery?: {
            timeoutMs?: number | undefined;
            type: "litellm" | "llama.cpp" | "lm-studio" | "ollama" | "openai-models-list" | "proxy";
        } | undefined;
        guardrailIdentifier?: string | undefined;
        guardrailTrace?: "disabled" | "enabled" | "enabled_full" | undefined;
        guardrailVersion?: string | undefined;
        headers?: Record<string, string> | undefined;
        modelOverrides?: Record<string, {
            compactionModel?: string | undefined;
            compat?: ({
                allowAnthropicHeaderOverrides?: boolean | undefined;
                allowsSyntheticReasoningContentForToolCalls?: boolean | undefined;
                alwaysSendMaxTokens?: boolean | undefined;
                cacheControlFormat?: "anthropic" | undefined;
                disableReasoningOnForcedToolChoice?: boolean | undefined;
                disableReasoningOnToolChoice?: boolean | undefined;
                extraBody?: Record<string, unknown> | undefined;
                maxTokensField?: "max_completion_tokens" | "max_tokens" | undefined;
                openRouterRouting?: {
                    only?: string[] | undefined;
                    order?: string[] | undefined;
                } | undefined;
                qwenTemplateReasoningEffort?: boolean | undefined;
                reasoningContentField?: "reasoning" | "reasoning_content" | "reasoning_text" | undefined;
                reasoningEffortMap?: {
                    high?: string | undefined;
                    low?: string | undefined;
                    max?: string | undefined;
                    medium?: string | undefined;
                    minimal?: string | undefined;
                    xhigh?: string | undefined;
                } | undefined;
                replayUnsignedThinking?: boolean | undefined;
                requiresAssistantAfterToolResult?: boolean | undefined;
                requiresAssistantContentForToolCalls?: boolean | undefined;
                requiresMistralToolIds?: boolean | undefined;
                requiresReasoningContentForToolCalls?: boolean | undefined;
                requiresThinkingAsText?: boolean | undefined;
                requiresToolResultId?: boolean | undefined;
                requiresToolResultName?: boolean | undefined;
                streamIdleTimeoutMs?: number | undefined;
                streamMarkupHealingPattern?: "dsml" | "kimi" | "qwen" | "thinking" | undefined;
                strictResponsesPairing?: boolean | undefined;
                supportsDeveloperRole?: boolean | undefined;
                supportsEagerToolInputStreaming?: boolean | undefined;
                supportsForcedToolChoice?: boolean | undefined;
                supportsImageDetailOriginal?: boolean | undefined;
                supportsLongPromptCacheRetention?: boolean | undefined;
                supportsMultipleSystemMessages?: boolean | undefined;
                supportsReasoningEffort?: boolean | undefined;
                supportsReasoningParams?: boolean | undefined;
                supportsStore?: boolean | undefined;
                supportsStrictMode?: boolean | undefined;
                supportsToolChoice?: boolean | undefined;
                supportsUsageInStreaming?: boolean | undefined;
                thinkingFormat?: "openai" | "openrouter" | "qwen" | "qwen-chat-template" | "zai" | undefined;
                toolStrictMode?: "all_strict" | "none" | undefined;
                vercelGatewayRouting?: {
                    only?: string[] | undefined;
                    order?: string[] | undefined;
                } | undefined;
                whenThinking?: {
                    allowAnthropicHeaderOverrides?: boolean | undefined;
                    allowsSyntheticReasoningContentForToolCalls?: boolean | undefined;
                    alwaysSendMaxTokens?: boolean | undefined;
                    cacheControlFormat?: "anthropic" | undefined;
                    disableReasoningOnForcedToolChoice?: boolean | undefined;
                    disableReasoningOnToolChoice?: boolean | undefined;
                    extraBody?: Record<string, unknown> | undefined;
                    maxTokensField?: "max_completion_tokens" | "max_tokens" | undefined;
                    openRouterRouting?: {
                        only?: string[] | undefined;
                        order?: string[] | undefined;
                    } | undefined;
                    qwenTemplateReasoningEffort?: boolean | undefined;
                    reasoningContentField?: "reasoning" | "reasoning_content" | "reasoning_text" | undefined;
                    reasoningEffortMap?: {
                        high?: string | undefined;
                        low?: string | undefined;
                        max?: string | undefined;
                        medium?: string | undefined;
                        minimal?: string | undefined;
                        xhigh?: string | undefined;
                    } | undefined;
                    replayUnsignedThinking?: boolean | undefined;
                    requiresAssistantAfterToolResult?: boolean | undefined;
                    requiresAssistantContentForToolCalls?: boolean | undefined;
                    requiresMistralToolIds?: boolean | undefined;
                    requiresReasoningContentForToolCalls?: boolean | undefined;
                    requiresThinkingAsText?: boolean | undefined;
                    requiresToolResultId?: boolean | undefined;
                    requiresToolResultName?: boolean | undefined;
                    streamIdleTimeoutMs?: number | undefined;
                    streamMarkupHealingPattern?: "dsml" | "kimi" | "qwen" | "thinking" | undefined;
                    strictResponsesPairing?: boolean | undefined;
                    supportsDeveloperRole?: boolean | undefined;
                    supportsEagerToolInputStreaming?: boolean | undefined;
                    supportsForcedToolChoice?: boolean | undefined;
                    supportsImageDetailOriginal?: boolean | undefined;
                    supportsLongPromptCacheRetention?: boolean | undefined;
                    supportsMultipleSystemMessages?: boolean | undefined;
                    supportsReasoningEffort?: boolean | undefined;
                    supportsReasoningParams?: boolean | undefined;
                    supportsStore?: boolean | undefined;
                    supportsStrictMode?: boolean | undefined;
                    supportsToolChoice?: boolean | undefined;
                    supportsUsageInStreaming?: boolean | undefined;
                    thinkingFormat?: "openai" | "openrouter" | "qwen" | "qwen-chat-template" | "zai" | undefined;
                    toolStrictMode?: "all_strict" | "none" | undefined;
                    vercelGatewayRouting?: {
                        only?: string[] | undefined;
                        order?: string[] | undefined;
                    } | undefined;
                } | undefined;
            } & {
                promptCacheMaximumCheckpoints?: number | undefined;
                promptCacheMinimumTokens?: number | undefined;
                promptCacheMode?: "automatic" | "explicit" | "none" | undefined;
                supportsLongPromptCacheRetention?: boolean | undefined;
            }) | undefined;
            contextPromotionTarget?: string | undefined;
            contextWindow?: number | undefined;
            cost?: {
                cacheRead?: number | undefined;
                cacheWrite?: number | undefined;
                input?: number | undefined;
                output?: number | undefined;
            } | undefined;
            headers?: Record<string, string> | undefined;
            imageInputDecoder?: "stb" | undefined;
            input?: ("image" | "text")[] | undefined;
            maxTokens?: number | undefined;
            name?: string | undefined;
            omitMaxOutputTokens?: boolean | undefined;
            premiumMultiplier?: number | undefined;
            reasoning?: boolean | undefined;
            remoteCompaction?: {
                api?: "anthropic-messages" | "azure-openai-responses" | "bedrock-converse-stream" | "google-gemini-cli" | "google-generative-ai" | "google-vertex" | "openai-codex-responses" | "openai-completions" | "openai-responses" | undefined;
                enabled?: boolean | undefined;
                endpoint?: string | undefined;
                model?: string | undefined;
                streamingEndpoint?: string | undefined;
                v2Endpoint?: string | undefined;
                v2StreamingEnabled?: boolean | undefined;
            } | undefined;
            supportsTools?: boolean | undefined;
            thinking?: {
                mode: any;
                efforts: any;
                defaultLevel?: any;
                effortMap?: any;
                supportsDisplay?: any;
            } | undefined;
            tokenizer?: "claude-v3" | "claude-v47" | "claude-v5" | "claude-v5-sonnet" | "deepseek-v3" | "glm5" | "kimi-k2" | "qwen3" | undefined;
        }> | undefined;
        models?: {
            api?: "anthropic-messages" | "azure-openai-responses" | "bedrock-converse-stream" | "google-gemini-cli" | "google-generative-ai" | "google-vertex" | "openai-codex-responses" | "openai-completions" | "openai-responses" | undefined;
            baseUrl?: string | undefined;
            compactionModel?: string | undefined;
            compat?: ({
                allowAnthropicHeaderOverrides?: boolean | undefined;
                allowsSyntheticReasoningContentForToolCalls?: boolean | undefined;
                alwaysSendMaxTokens?: boolean | undefined;
                cacheControlFormat?: "anthropic" | undefined;
                disableReasoningOnForcedToolChoice?: boolean | undefined;
                disableReasoningOnToolChoice?: boolean | undefined;
                extraBody?: Record<string, unknown> | undefined;
                maxTokensField?: "max_completion_tokens" | "max_tokens" | undefined;
                openRouterRouting?: {
                    only?: string[] | undefined;
                    order?: string[] | undefined;
                } | undefined;
                qwenTemplateReasoningEffort?: boolean | undefined;
                reasoningContentField?: "reasoning" | "reasoning_content" | "reasoning_text" | undefined;
                reasoningEffortMap?: {
                    high?: string | undefined;
                    low?: string | undefined;
                    max?: string | undefined;
                    medium?: string | undefined;
                    minimal?: string | undefined;
                    xhigh?: string | undefined;
                } | undefined;
                replayUnsignedThinking?: boolean | undefined;
                requiresAssistantAfterToolResult?: boolean | undefined;
                requiresAssistantContentForToolCalls?: boolean | undefined;
                requiresMistralToolIds?: boolean | undefined;
                requiresReasoningContentForToolCalls?: boolean | undefined;
                requiresThinkingAsText?: boolean | undefined;
                requiresToolResultId?: boolean | undefined;
                requiresToolResultName?: boolean | undefined;
                streamIdleTimeoutMs?: number | undefined;
                streamMarkupHealingPattern?: "dsml" | "kimi" | "qwen" | "thinking" | undefined;
                strictResponsesPairing?: boolean | undefined;
                supportsDeveloperRole?: boolean | undefined;
                supportsEagerToolInputStreaming?: boolean | undefined;
                supportsForcedToolChoice?: boolean | undefined;
                supportsImageDetailOriginal?: boolean | undefined;
                supportsLongPromptCacheRetention?: boolean | undefined;
                supportsMultipleSystemMessages?: boolean | undefined;
                supportsReasoningEffort?: boolean | undefined;
                supportsReasoningParams?: boolean | undefined;
                supportsStore?: boolean | undefined;
                supportsStrictMode?: boolean | undefined;
                supportsToolChoice?: boolean | undefined;
                supportsUsageInStreaming?: boolean | undefined;
                thinkingFormat?: "openai" | "openrouter" | "qwen" | "qwen-chat-template" | "zai" | undefined;
                toolStrictMode?: "all_strict" | "none" | undefined;
                vercelGatewayRouting?: {
                    only?: string[] | undefined;
                    order?: string[] | undefined;
                } | undefined;
                whenThinking?: {
                    allowAnthropicHeaderOverrides?: boolean | undefined;
                    allowsSyntheticReasoningContentForToolCalls?: boolean | undefined;
                    alwaysSendMaxTokens?: boolean | undefined;
                    cacheControlFormat?: "anthropic" | undefined;
                    disableReasoningOnForcedToolChoice?: boolean | undefined;
                    disableReasoningOnToolChoice?: boolean | undefined;
                    extraBody?: Record<string, unknown> | undefined;
                    maxTokensField?: "max_completion_tokens" | "max_tokens" | undefined;
                    openRouterRouting?: {
                        only?: string[] | undefined;
                        order?: string[] | undefined;
                    } | undefined;
                    qwenTemplateReasoningEffort?: boolean | undefined;
                    reasoningContentField?: "reasoning" | "reasoning_content" | "reasoning_text" | undefined;
                    reasoningEffortMap?: {
                        high?: string | undefined;
                        low?: string | undefined;
                        max?: string | undefined;
                        medium?: string | undefined;
                        minimal?: string | undefined;
                        xhigh?: string | undefined;
                    } | undefined;
                    replayUnsignedThinking?: boolean | undefined;
                    requiresAssistantAfterToolResult?: boolean | undefined;
                    requiresAssistantContentForToolCalls?: boolean | undefined;
                    requiresMistralToolIds?: boolean | undefined;
                    requiresReasoningContentForToolCalls?: boolean | undefined;
                    requiresThinkingAsText?: boolean | undefined;
                    requiresToolResultId?: boolean | undefined;
                    requiresToolResultName?: boolean | undefined;
                    streamIdleTimeoutMs?: number | undefined;
                    streamMarkupHealingPattern?: "dsml" | "kimi" | "qwen" | "thinking" | undefined;
                    strictResponsesPairing?: boolean | undefined;
                    supportsDeveloperRole?: boolean | undefined;
                    supportsEagerToolInputStreaming?: boolean | undefined;
                    supportsForcedToolChoice?: boolean | undefined;
                    supportsImageDetailOriginal?: boolean | undefined;
                    supportsLongPromptCacheRetention?: boolean | undefined;
                    supportsMultipleSystemMessages?: boolean | undefined;
                    supportsReasoningEffort?: boolean | undefined;
                    supportsReasoningParams?: boolean | undefined;
                    supportsStore?: boolean | undefined;
                    supportsStrictMode?: boolean | undefined;
                    supportsToolChoice?: boolean | undefined;
                    supportsUsageInStreaming?: boolean | undefined;
                    thinkingFormat?: "openai" | "openrouter" | "qwen" | "qwen-chat-template" | "zai" | undefined;
                    toolStrictMode?: "all_strict" | "none" | undefined;
                    vercelGatewayRouting?: {
                        only?: string[] | undefined;
                        order?: string[] | undefined;
                    } | undefined;
                } | undefined;
            } & {
                promptCacheMaximumCheckpoints?: number | undefined;
                promptCacheMinimumTokens?: number | undefined;
                promptCacheMode?: "automatic" | "explicit" | "none" | undefined;
                supportsLongPromptCacheRetention?: boolean | undefined;
            }) | undefined;
            contextPromotionTarget?: string | undefined;
            contextWindow?: number | undefined;
            cost?: {
                cacheRead: number;
                cacheWrite: number;
                input: number;
                output: number;
            } | undefined;
            headers?: Record<string, string> | undefined;
            id: string;
            imageInputDecoder?: "stb" | undefined;
            input?: ("image" | "text")[] | undefined;
            maxTokens?: number | undefined;
            name?: string | undefined;
            omitMaxOutputTokens?: boolean | undefined;
            premiumMultiplier?: number | undefined;
            reasoning?: boolean | undefined;
            remoteCompaction?: {
                api?: "anthropic-messages" | "azure-openai-responses" | "bedrock-converse-stream" | "google-gemini-cli" | "google-generative-ai" | "google-vertex" | "openai-codex-responses" | "openai-completions" | "openai-responses" | undefined;
                enabled?: boolean | undefined;
                endpoint?: string | undefined;
                model?: string | undefined;
                streamingEndpoint?: string | undefined;
                v2Endpoint?: string | undefined;
                v2StreamingEnabled?: boolean | undefined;
            } | undefined;
            supportsTools?: boolean | undefined;
            thinking?: {
                mode: any;
                efforts: any;
                defaultLevel?: any;
                effortMap?: any;
                supportsDisplay?: any;
            } | undefined;
            tokenizer?: "claude-v3" | "claude-v47" | "claude-v5" | "claude-v5-sonnet" | "deepseek-v3" | "glm5" | "kimi-k2" | "qwen3" | undefined;
        }[] | undefined;
        remoteCompaction?: {
            api?: "anthropic-messages" | "azure-openai-responses" | "bedrock-converse-stream" | "google-gemini-cli" | "google-generative-ai" | "google-vertex" | "openai-codex-responses" | "openai-completions" | "openai-responses" | undefined;
            enabled?: boolean | undefined;
            endpoint?: string | undefined;
            model?: string | undefined;
            streamingEndpoint?: string | undefined;
            v2Endpoint?: string | undefined;
            v2StreamingEnabled?: boolean | undefined;
        } | undefined;
        transport?: "pi-native" | undefined;
    }> | undefined;
}>;
