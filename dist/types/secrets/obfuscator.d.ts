export interface SecretEntry {
    type: "plain" | "regex";
    content: string;
    mode?: "obfuscate" | "replace";
    replacement?: string;
    flags?: string;
    friendlyName?: string;
}
export type JsonValue = string | number | boolean | null | JsonValue[] | {
    [key: string]: JsonValue | undefined;
};
export type JsonRecord = {
    [key: string]: JsonValue | undefined;
};
export declare class SecretObfuscator {
    #private;
    constructor(entries: SecretEntry[], key?: string | (() => string));
    hasSecrets(): boolean;
    /** Obfuscate all secrets in text. Bidirectional placeholders for obfuscate mode, one-way for replace. */
    obfuscate(text: string, sharedRegexSecretValues?: ReadonlySet<string>): string;
    /** Deobfuscate keyed placeholders for provider output, tool-call arguments, replay, and display. */
    deobfuscate(text: string): string;
    /** Deep-walk an object, deobfuscating string values for LIVE paths (keyed placeholders only). */
    deobfuscateObject<T>(obj: T): T;
    /** Deep-walk an object, obfuscating all string values. */
    obfuscateObject<T>(obj: T): T;
    collectRegexSecretValuesForObfuscation(text: string): Set<string>;
    stripUnsafeFriendlyPlaceholderPrefixes(text: string, sharedRegexSecretValues: ReadonlySet<string>): string;
}
