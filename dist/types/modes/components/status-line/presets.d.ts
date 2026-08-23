import type { PresetDef, StatusLinePreset } from "./types.js";
export declare const STATUS_LINE_PRESETS: Record<StatusLinePreset, PresetDef>;
export declare function getPreset(name: StatusLinePreset): PresetDef;
