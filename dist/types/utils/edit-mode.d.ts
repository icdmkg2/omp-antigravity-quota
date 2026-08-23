export type EditMode = "replace" | "patch" | "hashline" | "apply_patch" | "sloppy";
export declare const DEFAULT_EDIT_MODE: EditMode;
export declare const EDIT_MODES: EditMode[];
export declare function normalizeEditMode(mode?: string | null): EditMode | undefined;
export interface EditModeSettingsLike {
    get(key: "edit.mode"): unknown;
    getEditVariantForModel?(model: string | undefined): EditMode | null;
}
export interface EditModeSessionLike {
    settings: EditModeSettingsLike;
    getActiveModelString?: () => string | undefined;
}
export declare function resolveEditMode(session: EditModeSessionLike): EditMode;
