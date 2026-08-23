/** Voices accepted by Codex-backed realtime sessions and exposed in settings. */
export declare const LIVE_VOICE_OPTIONS: readonly [{
    readonly value: "arbor";
    readonly label: "Arbor";
}, {
    readonly value: "breeze";
    readonly label: "Breeze";
}, {
    readonly value: "cove";
    readonly label: "Cove";
}, {
    readonly value: "ember";
    readonly label: "Ember";
}, {
    readonly value: "juniper";
    readonly label: "Juniper";
}, {
    readonly value: "maple";
    readonly label: "Maple";
}, {
    readonly value: "sol";
    readonly label: "Sol";
}, {
    readonly value: "spruce";
    readonly label: "Spruce";
}, {
    readonly value: "vale";
    readonly label: "Vale";
}];
/** Accepted values for the live voice setting. */
export declare const LIVE_VOICE_VALUES: ("arbor" | "breeze" | "cove" | "ember" | "juniper" | "maple" | "sol" | "spruce" | "vale")[];
/** Voice used when no live voice preference is configured. */
export declare const DEFAULT_LIVE_VOICE = "sol";
