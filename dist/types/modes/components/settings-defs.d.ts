/**
 * UI adapter over the schema. Reads `ui.options` declared inline in
 * settings-schema.ts and produces typed widget definitions for the
 * settings selector.
 *
 * To add a new setting to the UI: declare it in `settings-schema.ts`
 * with a `ui` block carrying `tab` and `group` (the group must be listed
 * in `TAB_GROUPS[tab]`). If it needs a submenu, include `options: [...]`
 * (or `options: "runtime"` for runtime-injected lists like themes).
 */
import { type SettingPath, type SettingTab, type SubmenuOption } from "../../config/settings-schema.js";
export type SettingValue = boolean | string;
interface BaseSettingDef {
    path: SettingPath;
    label: string;
    description: string;
    /** Risk note shown in warning styling; set for settings that can get the user flagged or banned. */
    warning?: string;
    tab: SettingTab;
    /** Section within the tab; items are ordered by TAB_GROUPS[tab] and rendered under a heading row. */
    group?: string;
    /**
     * Optional visibility predicate. When supplied and returning false, the
     * setting is hidden from the UI. Applies to every variant — booleans,
     * enums, submenus, and text inputs.
     */
    condition?: () => boolean;
}
export interface BooleanSettingDef extends BaseSettingDef {
    type: "boolean";
}
export interface EnumSettingDef extends BaseSettingDef {
    type: "enum";
    values: readonly string[];
}
type OptionList = ReadonlyArray<SubmenuOption>;
export interface SubmenuSettingDef extends BaseSettingDef {
    type: "submenu";
    options: OptionList;
    onPreview?: (value: string) => void;
    onPreviewCancel?: (originalValue: string) => void;
}
export interface TextInputSettingDef extends BaseSettingDef {
    type: "text";
    secret: boolean;
}
export interface ProviderLimitsSettingDef extends BaseSettingDef {
    type: "providerLimits";
}
/** Array-of-enum setting edited as a toggle list; `ordered` lists render positions and support reordering. */
export interface MultiSelectSettingDef extends BaseSettingDef {
    type: "multiselect";
    options: OptionList;
    ordered: boolean;
}
export type SettingDef = BooleanSettingDef | EnumSettingDef | SubmenuSettingDef | TextInputSettingDef | ProviderLimitsSettingDef | MultiSelectSettingDef;
/** Get all setting definitions with UI */
export declare function getAllSettingDefs(): SettingDef[];
/**
 * Get settings for a specific tab, ordered by the tab's group layout
 * (TAB_GROUPS). Ungrouped settings sort first; within a group, schema
 * declaration order is preserved.
 */
export declare function getSettingsForTab(tab: SettingTab): SettingDef[];
/** Get a setting definition by path */
export declare function getSettingDef(path: SettingPath): SettingDef | undefined;
/** Get default value for display */
export declare function getDisplayDefault(path: SettingPath): string;
export {};
