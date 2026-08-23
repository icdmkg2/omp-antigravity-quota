import { type Api, type ApiKeyResolver, type AuthStorage, type Model } from "@oh-my-pi/pi-ai";
/** Model slice accepted by the model-form `resolver(model, sessionId)` overload. */
export type ApiKeyResolverModel = Pick<Model<Api>, "provider" | "baseUrl" | "id">;
export interface ApiKeyResolverOptions {
    /** Session id for credential stickiness; read at resolve time by the caller. */
    sessionId?: string;
    /** Provider base URL hint forwarded to the auth-storage cascade. */
    baseUrl?: string;
    /** Provider model id forwarded to model-scoped usage ranking/backoff. */
    modelId?: string;
}
/**
 * Minimal slice of `ModelRegistry` the resolver needs. Typed structurally so
 * narrower registry shells (e.g. the commit pipeline's `CommitModelRegistry`)
 * can build resolvers without depending on the full class.
 */
export interface ApiKeyResolverRegistry {
    getApiKeyForProvider(provider: string, sessionId?: string, options?: {
        baseUrl?: string;
        modelId?: string;
        forceRefresh?: boolean;
        signal?: AbortSignal;
    }): Promise<string | undefined>;
    authStorage: Pick<AuthStorage, "rotateSessionCredential">;
    /**
     * Build an {@link ApiKeyResolver} implementing the central a/b/c auth-retry
     * policy: initial → resolve; step (b) → force-refresh same account; step (c)
     * → rotate to a sibling and re-resolve, unless quota exhaustion has no sibling.
     *
     * Two call forms: `resolver(provider, options?)` for provider-scoped keys,
     * and `resolver(model, sessionId?)` which derives `baseUrl`/`modelId` from
     * the model. The resolver is stateless (safe to reuse across requests).
     * Callers that need the initial key for a guard can call
     * `resolveApiKeyOnce(resolver)`.
     */
    resolver(provider: string, options?: ApiKeyResolverOptions): ApiKeyResolver;
    resolver(model: ApiKeyResolverModel, sessionId?: string): ApiKeyResolver;
}
/**
 * Default implementation of {@link ApiKeyResolverRegistry.resolver}.
 * Also usable standalone for structural registries that don't carry the method.
 */
export declare function createApiKeyResolver(registry: Pick<ApiKeyResolverRegistry, "getApiKeyForProvider" | "authStorage">, provider: string, options?: ApiKeyResolverOptions): ApiKeyResolver;
