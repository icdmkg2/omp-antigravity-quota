import type { DoctorCheck, DoctorOptions, InstalledPlugin, InstallOptions, PluginSettingSchema } from "./types.js";
export declare class PluginManager {
    #private;
    constructor(cwd?: string);
    /**
     * Install a plugin with optional feature selection.
     *
     * Accepts:
     * - npm specs: `pkg`, `pkg@1.2.3`, `@scope/pkg`, `pkg[features]`
     * - namespaced git shorthand: `github:user/repo[#ref]`, `gitlab:`, `bitbucket:`,
     *   `codeberg:`, `sourcehut:`/`srht:`
     * - full git URLs: `https://github.com/user/repo`, `git@github.com:user/repo`,
     *   `ssh://…`, `git+https://…`
     *
     * For git specs the package name is not knowable from the spec, so the
     * installer diffs `plugins/package.json` `dependencies` before and after
     * to find the newly added key.
     *
     * @param specString - Package specifier with optional features: "pkg", "pkg[feat]", "pkg[*]", "pkg[]"
     * @param options - Install options
     * @returns Installed plugin metadata
     */
    install(specString: string, options?: InstallOptions): Promise<InstalledPlugin>;
    /**
     * Uninstall a plugin.
     */
    uninstall(name: string): Promise<void>;
    /**
     * Resolve one installed plugin, including a marketplace runtime package that
     * is intentionally omitted from {@link list}.
     *
     * Resolution order mirrors {@link getEnabledPlugins}: an explicit trusted
     * `options.path` (marketplace registry entry) wins; otherwise the active
     * enabled project plugin root shadows the user root — so inside a project
     * where the same package name exists in both scopes, config reads and writes
     * act on the package copy active at runtime.
     */
    getPlugin(name: string, options?: {
        path?: string;
    }): Promise<InstalledPlugin | undefined>;
    /**
     * List all installed plugins.
     */
    list(): Promise<InstalledPlugin[]>;
    /**
     * Link a local plugin for development.
     */
    link(localPath: string): Promise<InstalledPlugin>;
    /**
     * Enable or disable a plugin globally.
     */
    setEnabled(name: string, enabled: boolean): Promise<void>;
    /**
     * Get enabled features for a plugin.
     */
    getEnabledFeatures(name: string): Promise<string[] | null>;
    /**
     * Set enabled features for a plugin.
     */
    setEnabledFeatures(name: string, features: string[] | null): Promise<void>;
    /**
     * Get all settings for a plugin.
     */
    getPluginSettings(name: string): Promise<Record<string, unknown>>;
    /**
     * Set a plugin setting value.
     */
    setPluginSetting(name: string, key: string, value: unknown): Promise<void>;
    /**
     * Delete a plugin setting.
     */
    deletePluginSetting(name: string, key: string): Promise<void>;
    /**
     * Run health checks on the plugin system.
     */
    doctor(options?: DoctorOptions): Promise<DoctorCheck[]>;
}
export interface ValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Validate a setting value against its schema.
 */
export declare function validateSetting(value: unknown, schema: PluginSettingSchema): ValidationResult;
/**
 * Parse a string value according to a setting schema's type.
 */
export declare function parseSettingValue(valueStr: string, schema: PluginSettingSchema): unknown;
