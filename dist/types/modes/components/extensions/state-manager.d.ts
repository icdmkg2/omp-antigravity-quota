import type { DashboardState, Extension, FlatTreeItem, ProviderTab, TreeNode } from "./types.js";
/**
 * Settings manager interface for granular toggle persistence.
 */
export interface ExtensionSettingsManager {
    getDisabledExtensions(): string[];
    setDisabledExtensions(ids: string[]): void;
}
/**
 * Load all extensions from all capabilities.
 */
export declare function loadAllExtensions(cwd?: string, disabledIds?: string[]): Promise<Extension[]>;
/**
 * Build sidebar tree from extensions.
 * Groups by provider → kind.
 */
export declare function buildSidebarTree(extensions: Extension[]): TreeNode[];
/**
 * Flatten tree for keyboard navigation.
 */
export declare function flattenTree(tree: TreeNode[]): FlatTreeItem[];
/**
 * Apply fuzzy filter to extensions.
 */
export declare function applyFilter(extensions: Extension[], query: string): Extension[];
/**
 * Build provider tabs from extensions.
 */
export declare function buildProviderTabs(extensions: Extension[]): ProviderTab[];
/**
 * Filter extensions by provider tab.
 */
export declare function filterByProvider(extensions: Extension[], providerId: string): Extension[];
/**
 * Apply setting-backed item disable overrides to an existing dashboard state.
 * This gives the UI immediate feedback while the full capability refresh runs.
 */
export declare function applyDisabledExtensionsToState(state: DashboardState, disabledIds: string[]): DashboardState;
/**
 * Create initial dashboard state.
 */
export declare function createInitialState(cwd?: string, disabledIds?: string[]): Promise<DashboardState>;
/**
 * Toggle provider enabled state.
 */
export declare function toggleProvider(providerId: string): boolean;
/**
 * Refresh state after toggle.
 */
export declare function refreshState(state: DashboardState, cwd?: string, disabledIds?: string[]): Promise<DashboardState>;
