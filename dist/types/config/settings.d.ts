/**
 * Settings singleton with sync get/set and background persistence.
 *
 * Usage:
 *   import { settings } from "./settings.js";
 *
 *   const enabled = settings.get("compaction.enabled");  // sync read
 *   settings.set("theme.dark", "titanium");               // sync write, saves in background
 *
 * For tests:
 *   const isolated = Settings.isolated({ "compaction.enabled": false });
 */
import { procmgr } from "@oh-my-pi/pi-utils";
import type { ModelRole } from "../config/model-roles.js";
import { AgentStorage } from "../session/agent-storage.js";
import { type EditMode } from "../utils/edit-mode.js";
import { type BashInterceptorRule, type GroupPrefix, type GroupTypeMap, type SettingPath, type SettingValue } from "./settings-schema.js";
export type * from "./settings-schema.js";
export * from "./settings-schema.js";
/** Raw settings object as stored in YAML */
export interface RawSettings {
    [key: string]: unknown;
}
export interface SettingsOptions {
    /** Current working directory for project settings discovery */
    cwd?: string;
    /** Agent directory for config.yml/config.yaml storage */
    agentDir?: string;
    /** Don't persist to disk (for tests) */
    inMemory?: boolean;
    /** Read config sources without opening storage or writing migrations */
    readOnly?: boolean;
    /** Initial overrides */
    overrides?: Partial<Record<SettingPath, unknown>>;
    /** Extra config.yml-style overlays loaded after global/project settings */
    configFiles?: string[];
}
export declare function normalizeProviderMaxInFlightRequests(value: unknown): Record<string, number>;
export declare function validateProviderMaxInFlightRequests(value: unknown): Record<string, number>;
export declare class Settings {
    #private;
    private constructor();
    /**
     * Initialize the global singleton.
     * Call once at startup before accessing `settings`.
     */
    static init(options?: SettingsOptions): Promise<Settings>;
    /**
     * Load effective settings from config.yml and project providers without
     * opening agent.db, migrating legacy settings, or writing marker files.
     */
    static loadReadOnly(options?: SettingsOptions): Promise<Settings>;
    /**
     * Load a persisted settings instance without touching the global singleton.
     */
    static loadIsolated(options?: SettingsOptions): Promise<Settings>;
    /**
     * Create an in-memory settings instance without affecting the global singleton.
     * A supplied storage handle remains shared for runtime data while setting overrides stay non-persistent.
     */
    static isolated(overrides?: Partial<Record<SettingPath, unknown>>, options?: {
        storage?: AgentStorage | null;
    }): Settings;
    /**
     * Get the global singleton.
     * Throws if not initialized.
     */
    static get instance(): Settings;
    /**
     * Get a setting value (sync).
     * Returns the merged value from global + project + overrides, or the default.
     */
    get<P extends SettingPath>(path: P): SettingValue<P>;
    /**
     * Whether `path` has an explicitly configured value (global config, project
     * config, or runtime override) rather than falling back to the schema default.
     */
    isConfigured(path: SettingPath): boolean;
    /**
     * Set a setting value (sync).
     * Updates global settings and queues a background save.
     * Triggers hooks for settings that have side effects.
     */
    set<P extends SettingPath>(path: P, value: SettingValue<P>): void;
    /**
     * Apply runtime overrides (not persisted).
     */
    override<P extends SettingPath>(path: P, value: SettingValue<P>): void;
    /**
     * Clear a runtime override.
     */
    clearOverride(path: SettingPath): void;
    /**
     * Drop pending debounced saves and refuse any further background writes.
     * Used when an instance is being discarded (test teardown): an armed timer
     * or a chained in-flight save on a dropped instance would otherwise fire
     * later and race the successor's file locks.
     */
    cancelPendingSaves(): void;
    /**
     * Flush any pending saves to disk.
     * Call before exit to ensure all changes are persisted.
     */
    flush(): Promise<void>;
    cloneForCwd(cwd: string): Promise<Settings>;
    /**
     * Re-read the current global, project, and explicit overlay layers from disk
     * without replacing this instance or discarding runtime overrides.
     *
     * All sources are loaded before any live layer is replaced, so readers never
     * observe a partially refreshed configuration. Concurrent callers share the
     * same reload.
     */
    reloadFromDisk(): Promise<void>;
    /**
     * Re-scope this instance to a new working directory *in place*: reload the
     * project layer (`.claude/settings.yml` etc.) from `cwd`, re-resolve
     * path-scoped settings against it, and re-fire side-effect hooks (theme,
     * symbols, tab width, …). Global settings and runtime overrides are preserved.
     *
     * Unlike {@link cloneForCwd}, this mutates the live instance, so every holder
     * (the `settings` proxy, the active session, controllers) observes the new
     * project scope without swapping references — used when the process changes
     * directory mid-run (`/move`, cross-project resume). No-op when `cwd` is
     * already the current scope.
     */
    reloadForCwd(cwd: string): Promise<void>;
    getStorage(): AgentStorage | null;
    getCwd(): string;
    getAgentDir(): string;
    getPlansDirectory(): string;
    /**
     * Get shell configuration based on settings.
     */
    getShellConfig(): procmgr.ShellConfig;
    /**
     * Get all settings in a group with full type safety.
     */
    getGroup<G extends GroupPrefix>(prefix: G): GroupTypeMap[G];
    /**
     * Get the edit variant for a specific model.
     * Returns "patch", "replace", "hashline", "apply_patch", or null (use global default).
     */
    getEditVariantForModel(model: string | undefined): EditMode | null;
    /**
     * Get bash interceptor rules (typed accessor for complex array config).
     */
    getBashInterceptorRules(): BashInterceptorRule[];
    /**
     * Set a model role (helper for modelRoles record). Passing `undefined`
     * clears the role from the persisted record and any runtime override.
     *
     * In project storage mode, when a project edit has temporarily replaced
     * the process-wide runtime override for `role` and that override is still
     * active (the runtime slot currently matches the project value), the
     * global-layer write must not rewrite that runtime slot — otherwise the
     * global fallback would immediately shadow the still-configured project
     * role. The global layer is still persisted; only the runtime override is
     * left untouched. The guard is precise so that a later clear, a late
     * `overrideModelRoles`, or a storage-mode transition does not leave a
     * stale skip in place.
     */
    setModelRole(role: ModelRole | string, modelId: string | undefined): void;
    /**
     * Whether `role`'s runtime override slot currently holds the temporary
     * project-scoped value installed by a prior `setProjectModelRole`. Returns
     * `false` when storage is not project-mode, no capture exists, or the
     * project role was cleared. With explicit provenance invalidation, a
     * surviving capture implies no external supersession occurred.
     */
    isProjectModelRoleRuntimeOverrideActive(role: ModelRole | string): boolean;
    /**
     * Set a model role in the current project's settings layer.
     */
    setProjectModelRole(role: ModelRole | string, modelId: string): void;
    /**
     * Clear a model role from the current project's settings layer.
     */
    clearProjectModelRole(role: ModelRole | string): void;
    /**
     * Get a model role (helper for modelRoles record).
     */
    getModelRole(role: ModelRole | string): string | undefined;
    /**
     * Get a model role from only the global settings layer.
     */
    getGlobalModelRole(role: ModelRole | string): string | undefined;
    /**
     * Get a model role from only the current project settings layer.
     */
    getProjectModelRole(role: ModelRole | string): string | undefined;
    /**
     * Report which layer actually supplies the effective model role across
     * full merge precedence (runtime override → config overlay → project →
     * global → default). Unlike {@link getModelRoleSource}, this accounts
     * for runtime and config-overlay layers and detects ownership by key
     * presence rather than normalized value, so a `null` tombstone in the
     * overlay or runtime layer correctly blocks lower layers. The project
     * layer is checked through {@link #projectSettingsForMerge} because a
     * project null is a cleared value (falls back to global), not a
     * tombstone.
     */
    getModelRoleProvenance(role: ModelRole | string): "runtime" | "overlay" | "project" | "global" | "default";
    /**
     * Get the persisted layer supplying a model role (project/global/default only).
     */
    getModelRoleSource(role: ModelRole | string): "project" | "global" | "default";
    /**
     * Get all model roles (helper for modelRoles record).
     */
    getModelRoles(): ReadOnlyDict<string>;
    overrideModelRoles(roles: ReadOnlyDict<string>): void;
    /**
     * Set disabled providers (for compatibility with discovery system).
     */
    setDisabledProviders(ids: string[]): void;
}
/**
 * Subscribe to append-only mode setting changes.
 * Returns an unsubscribe function. Multiple sessions (main + subagents)
 * can register independently without overwriting each other.
 */
export declare const onAppendOnlyModeChanged: (cb: (value: string) => void) => () => void;
/** Subscribe to model role changes. Returns an unsubscribe function. */
export declare const onModelRolesChanged: (cb: () => void) => () => void;
/** Subscribe to Code Mode setting changes. Returns an unsubscribe function. */
export declare const onCodeModeChanged: (cb: () => void) => () => void;
/**
 * Subscribe to extended-context setting changes. Sessions re-derive their
 * model's effective context window (the registry clamps premium long-context
 * models to the standard-pricing threshold while the setting is off).
 * Returns an unsubscribe function.
 */
export declare const onExtendedContextChanged: (cb: () => void) => () => void;
/**
 * Subscribe to session-accent setting changes.
 * Returns an unsubscribe function. Callers should re-read settings in the callback.
 */
export declare const onStatusLineSessionAccentChanged: (cb: () => void) => () => void;
/**
 * Subscribe to changes in the Hindsight bank-scoping settings. Lets the
 * Hindsight backend rebuild the active `HindsightSessionState` when the
 * operator switches `hindsight.bankId`, `hindsight.bankIdPrefix`, or
 * `hindsight.scoping` mid-session so subsequent retain/recall calls land in
 * the new bank instead of the one selected at session start.
 *
 * Returns an unsubscribe function. The callback receives no arguments — the
 * caller is expected to re-read the relevant settings via `Settings.get`.
 */
export declare const onHindsightScopeChanged: (cb: () => void) => () => void;
export declare function isSettingsInitialized(): boolean;
/**
 * Reset the global singleton for testing.
 * @internal
 */
export declare function resetSettingsForTest(): void;
/**
 * The global settings singleton.
 * Must call `Settings.init()` before using.
 */
export declare const settings: Settings;
