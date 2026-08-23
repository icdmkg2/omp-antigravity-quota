import { MarketplaceManager } from "../../extensibility/plugins/marketplace/index.js";
import type { SlashCommandRuntime } from "../types.js";
/**
 * Build a `MarketplaceManager` wired up with the active project's registry
 * paths and the shared plugin-root cache invalidator. Reused by both `/plugins`
 * and `/marketplace` handlers so cache invalidation stays consistent.
 */
export declare function createMarketplaceManager(runtime: SlashCommandRuntime): Promise<MarketplaceManager>;
