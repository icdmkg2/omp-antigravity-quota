interface ResolveConfigValueOptions {
    forceCommandRefresh?: boolean;
}
export declare function isCommandConfigValue(valueConfig: string | undefined): valueConfig is string;
export interface CommandApiKeyResolution {
    configured: boolean;
    value?: string;
}
/**
 * Resolve a models.yml/models.yaml secret/config value to an actual value.
 * `!cmd` runs a shell command and returns trimmed stdout, otherwise env vars are
 * checked first and the input falls back to a literal value.
 */
export declare function resolveConfigValue(valueConfig: string, options?: ResolveConfigValueOptions): string | undefined;
export type HeaderSource = Record<string, string> | undefined;
interface HeaderResolutionOptions {
    authHeader?: boolean;
    apiKeyConfig?: string;
}
export declare function createLiveConfigHeaders(sources: readonly HeaderSource[], options?: HeaderResolutionOptions): Record<string, string> | undefined;
export declare function resolveConfigHeaders(headers: Record<string, string> | undefined): Record<string, string> | undefined;
export {};
