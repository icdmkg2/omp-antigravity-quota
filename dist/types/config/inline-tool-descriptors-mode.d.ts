/**
 * Resolves whether full tool descriptors should be inlined into the system
 * prompt (and stripped from provider tool schemas) for a given model and
 * setting.
 *
 * `auto` enforces a per-model policy: inline for Gemini models, off otherwise.
 * Gemini benefits from descriptors in-prompt; other providers keep them in the
 * tool schemas. `on`/`off` are explicit user overrides.
 *
 * @param modelId Model id (e.g. `gemini-3-pro`) used to classify `auto`.
 */
export declare function shouldInlineToolDescriptors(setting: "auto" | "on" | "off" | undefined, modelId: string | undefined): boolean;
