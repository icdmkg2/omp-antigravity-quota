import type { Settings } from "../config/settings.js";
import type { Capability, CapabilityInfo, CapabilityResult, LoadOptions, Provider, ProviderInfo } from "./types.js";
/**
 * Define a new capability.
 */
export declare function defineCapability<T>(def: Omit<Capability<T>, "providers">): Capability<T>;
/**
 * Register a provider for a capability.
 */
export declare function registerProvider<T>(capabilityId: string, provider: Provider<T>): void;
/**
 * Load a capability by ID.
 */
export declare function loadCapability<T>(capabilityId: string, options?: LoadOptions<T>): Promise<CapabilityResult<T>>;
/**
 * Initialize capability system with settings manager for persistence.
 * Call this once on startup to enable persistent provider state.
 */
export declare function initializeWithSettings(activeSettings: Settings): void;
/**
 * Disable a provider globally (across all capabilities).
 */
export declare function disableProvider(providerId: string): void;
/**
 * Enable a previously disabled provider.
 */
export declare function enableProvider(providerId: string): void;
/**
 * Check if a provider is enabled.
 */
export declare function isProviderEnabled(providerId: string): boolean;
/**
 * Get list of all disabled provider IDs.
 */
export declare function getDisabledProviders(): string[];
/**
 * Set disabled providers from a list (replaces current set).
 */
export declare function setDisabledProviders(providerIds: string[]): void;
/**
 * Get a capability definition (for introspection).
 */
export declare function getCapability<T>(id: string): Capability<T> | undefined;
/**
 * List all registered capability IDs.
 */
export declare function listCapabilities(): string[];
/**
 * Get capability info for UI display.
 */
export declare function getCapabilityInfo(capabilityId: string): CapabilityInfo | undefined;
/**
 * Get all capabilities info for UI display.
 */
export declare function getAllCapabilitiesInfo(): CapabilityInfo[];
/**
 * Get provider info for UI display.
 */
export declare function getProviderInfo(providerId: string): ProviderInfo | undefined;
/**
 * Get all providers info for UI display (deduplicated across capabilities).
 */
export declare function getAllProvidersInfo(): ProviderInfo[];
/**
 * Reset all caches. Call after chdir or filesystem changes.
 */
export declare function reset(): void;
/**
 * Invalidate cache for a specific path.
 * @param filePath - Absolute or relative path to invalidate
 */
export declare function invalidate(filePath: string, cwd?: string): void;
/**
 * Get cache stats for diagnostics.
 */
export declare function cacheStats(): {
    content: number;
    dir: number;
};
export type * from "./types.js";
