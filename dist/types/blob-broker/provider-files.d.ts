import type { Context, Model } from "@oh-my-pi/pi-ai";
import { type ProviderFileCache, type ProviderFileCacheEntry, type ProviderFileCacheStatus, type ProviderFileClient } from "./provider-file-types.js";
/** Resolve the current account credential for a model without retaining it. */
export type ProviderFileCredentialResolver = (model: Model) => Promise<string | undefined>;
/** Select a provider-native file client for a model and resolved credential. */
export type ProviderFileClientFactory = (model: Model, credential: string) => ProviderFileClient | null;
/**
 * Account-scoped provider-file orchestration for outbound contexts.
 *
 * Session messages are never mutated: references are attached only to the
 * structural copy handed to a provider request, while inline data remains the
 * required source of truth for later URL and base64 recovery.
 */
export declare class ProviderFileManager {
    #private;
    constructor(cache: ProviderFileCache, resolveCredential: ProviderFileCredentialResolver, factories?: readonly ProviderFileClientFactory[]);
    decorateContext(context: Context, model: Model): Promise<Context>;
    /** Remove cached handles carried by a provider-rejected request. */
    invalidateContext(context: Context, model: Model): Promise<void>;
    status(): ProviderFileCacheStatus;
    deleteAll(): readonly ProviderFileCacheEntry[];
    save(): void;
}
