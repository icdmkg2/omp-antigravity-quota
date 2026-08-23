/**
 * Built-in model roles and role metadata helpers.
 */
import { type ThemeColor } from "../modes/theme/theme.js";
import type { Settings } from "./settings.js";
/** Canonical prefix for a configured model role selector. */
export declare const MODEL_ROLE_ALIAS_PREFIX = "@";
/** Legacy prefix accepted for backwards-compatible role selectors. */
export declare const LEGACY_MODEL_ROLE_ALIAS_PREFIX = "pi/";
/** Shorthand selector for the default model role. */
export declare const DEFAULT_MODEL_ROLE_ALIAS = "*";
/** Format a model role as its canonical selector. */
export declare function formatModelRoleAlias(role: string): string;
export type ModelRole = "default" | "smol" | "slow" | "vision" | "plan" | "designer" | "commit" | "tiny" | "task" | "advisor";
export interface ModelRoleInfo {
    tag?: string;
    name: string;
    color?: ThemeColor;
    /** If true, the role is functional but not shown in the model selector UI. */
    hidden?: boolean;
}
export declare const MODEL_ROLES: Record<ModelRole, ModelRoleInfo>;
export declare const MODEL_ROLE_IDS: ModelRole[];
export type RoleInfo = ModelRoleInfo;
/**
 * Return the canonical set of known roles for selector/carousel UI.
 *
 * Built-ins always come first. Configured cycle order, model assignments, and
 * tag metadata can introduce additional custom roles without requiring duplicate
 * entries across settings.
 */
export declare function getKnownRoleIds(settings: Settings): string[];
/**
 * Get role info for a role name (built-in or custom).
 * Configured metadata overrides built-in defaults when present.
 */
export declare function getRoleInfo(role: string, settings: Settings): RoleInfo;
