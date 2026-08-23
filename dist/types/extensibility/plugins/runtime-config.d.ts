import type { PluginRuntimeConfig } from "./types.js";
/** Normalizes persisted plugin runtime config across legacy lockfile shapes. */
export declare function normalizePluginRuntimeConfig(config: Partial<PluginRuntimeConfig>): PluginRuntimeConfig;
