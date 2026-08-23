/**
 * Image Generation Providers
 *
 * Leaf module (no runtime deps) shared by the image_gen tool, the settings
 * schema, and settings migrations — mirrors `web/search/types.ts` so the
 * provider list, auto order, and settings choices never drift apart.
 */
/** Image generation backends, in settings/tool vocabulary. */
export type ImageProvider = "antigravity" | "gemini" | "openai" | "openai-codex" | "openrouter" | "xai";
/** Auto-resolution fallback order when no configured entry or session provider matches. */
export declare const AUTO_IMAGE_PROVIDER_ORDER: readonly ImageProvider[];
/** Settings choices for `providers.imageOrder` (labels shared with the retired single-preference enum). */
export declare const IMAGE_PROVIDER_CHOICES: readonly [{
    readonly value: "openai";
    readonly label: "OpenAI";
    readonly description: "OPENAI_API_KEY (gpt-image-2) or active GPT model; falls back to a connected Codex subscription";
}, {
    readonly value: "openai-codex";
    readonly label: "OpenAI Codex (ChatGPT)";
    readonly description: "Uses a connected Codex / ChatGPT subscription — no OPENAI_API_KEY needed";
}, {
    readonly value: "antigravity";
    readonly label: "Antigravity";
    readonly description: "Requires google-antigravity OAuth";
}, {
    readonly value: "xai";
    readonly label: "xAI Grok Imagine";
    readonly description: "Requires xAI Grok OAuth or XAI_API_KEY";
}, {
    readonly value: "gemini";
    readonly label: "Gemini";
    readonly description: "Requires GEMINI_API_KEY";
}, {
    readonly value: "openrouter";
    readonly label: "OpenRouter";
    readonly description: "Requires OPENROUTER_API_KEY";
}];
export declare function isImageProviderId(value: unknown): value is ImageProvider;
