import type { InternalResource, InternalUrl, ProtocolHandler, ResolveContext, WriteContext } from "./types.js";
type ContentType = InternalResource["contentType"];
type VaultParamValue = string | true;
type VaultParams = Record<string, VaultParamValue>;
type FileOp = "outline" | "backlinks" | "links" | "tags" | "properties" | "tasks" | "wordcount" | "history" | "base";
type VaultOp = "search" | "daily" | "daily-path" | "tags" | "tag" | "tasks" | "orphans" | "unresolved" | "deadends" | "bases" | "bookmarks" | "recents" | "templates" | "aliases" | "properties" | "property";
export interface VaultReference {
    vault: string | null;
    active: boolean;
    forwardVault: boolean;
    display: string;
}
export type ParsedVaultUrl = {
    kind: "list-vaults";
    url: string;
    params: VaultParams;
} | {
    kind: "vault-info";
    url: string;
    ref: VaultReference;
    params: VaultParams;
} | {
    kind: "fs-dir";
    url: string;
    ref: VaultReference;
    relativePath: string;
    params: VaultParams;
} | {
    kind: "fs-file";
    url: string;
    ref: VaultReference;
    relativePath: string;
    params: VaultParams;
} | {
    kind: "file-op";
    url: string;
    ref: VaultReference;
    relativePath: string;
    op: FileOp;
    params: VaultParams;
} | {
    kind: "vault-op";
    url: string;
    ref: VaultReference;
    op: VaultOp;
    params: VaultParams;
};
export interface ObsidianSpawnResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}
export interface VaultProtocolHandlerOptions {
    spawnObsidian?: typeof spawnObsidian;
    resolveObsidianBinary?: () => string | null;
}
interface CliInvocation {
    args: string[];
    contentType: ContentType;
    opLabel: string;
}
export declare function parseVaultUrl(input: string | InternalUrl): ParsedVaultUrl;
export declare function spawnObsidian(bin: string, args: string[], signal?: AbortSignal, timeoutMs?: number): Promise<ObsidianSpawnResult>;
export declare function resolveObsidianBinary(): string | null;
/**
 * Whether the `vault://` protocol is enabled in the active settings profile.
 *
 * Reads `vault.enabled` from the global settings singleton. Falls back to the
 * schema default when settings are not yet initialized (e.g. during isolated
 * unit tests that exercise the handler before the host calls `Settings.init`).
 */
export declare function isVaultEnabled(): boolean;
export declare function hasObsidian(): boolean;
export declare class VaultDisabledError extends Error {
    constructor();
}
export declare function resolveVaultUrlToPath(input: string | InternalUrl): string;
export declare function buildObsidianCliInvocation(parsed: Extract<ParsedVaultUrl, {
    kind: "file-op" | "vault-op";
}>): CliInvocation;
export declare class VaultProtocolHandler implements ProtocolHandler {
    #private;
    readonly scheme = "vault";
    readonly immutable = false;
    constructor(options?: VaultProtocolHandlerOptions);
    static resetForTests(): void;
    static setObsidianBinaryForTests(value: string | null | undefined): void;
    static setVaultDirectoryForTests(entries: ReadonlyMap<string, string> | Record<string, string> | undefined): void;
    static setActiveVaultPathForTests(vaultPath: string | undefined): void;
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
    write(url: InternalUrl, content: string, context?: WriteContext): Promise<void>;
}
export {};
