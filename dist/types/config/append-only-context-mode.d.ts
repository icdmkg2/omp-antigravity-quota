/** Provider metadata needed to resolve append-only context mode. */
export interface AppendOnlyContextModel {
    provider: string;
    baseUrl: string;
    /** Verbatim sparse compat config (explicit user intent), never the resolved record. */
    compatConfig?: object;
}
/** Resolves whether append-only context should be active for a model and setting. */
export declare function shouldEnableAppendOnlyContext(setting: "auto" | "on" | "off" | undefined, model: AppendOnlyContextModel | null | undefined): boolean;
