import type { MnemopiOptions } from "@oh-my-pi/pi-mnemopi";
import type { Settings } from "../config/settings.js";
export type MnemopiLlmMode = "none" | "smol" | "remote";
export type MnemopiScoping = "global" | "per-project" | "per-project-tagged";
export type MnemopiProviderOptions = Pick<MnemopiOptions, "noEmbeddings" | "embeddingModel" | "embeddingApiUrl" | "embeddingApiKey" | "llm" | "debug">;
export interface MnemopiBackendConfig {
    dbPath: string;
    baseBank?: string;
    bank: string;
    globalBank?: string;
    retainBank?: string;
    recallBanks?: readonly string[];
    scoping?: MnemopiScoping;
    autoRecall: boolean;
    autoRetain: boolean;
    polyphonicRecall: boolean;
    enhancedRecall: boolean;
    proactiveLinking: boolean;
    retainEveryNTurns: number;
    recallLimit: number;
    recallContextTurns: number;
    recallMaxQueryChars: number;
    injectionTokenLimit: number;
    debug: boolean;
    providerOptions: MnemopiProviderOptions;
    llmMode: MnemopiLlmMode;
    llmBaseUrl?: string;
    llmApiKey?: string;
    llmModel?: string;
}
export declare function loadMnemopiConfig(settings: Settings, agentDir: string): MnemopiBackendConfig;
export interface MnemopiBankScope {
    baseBank: string;
    bank: string;
    globalBank: string;
    retainBank: string;
    recallBanks: readonly string[];
}
/**
 * Resolve write/recall banks for a session.
 *
 * Mnemopi has no tag-filtered recall, so `per-project-tagged` maps to a
 * project-local write bank plus a shared recall-visible bank. The project
 * bank is derived purely from {@link cwd} — see {@link projectBank} for the
 * stability contract.
 */
export declare function computeMnemopiBankScope(configured: string | undefined, cwd: string, scoping: MnemopiScoping): MnemopiBankScope;
/**
 * Discover sibling banks under `<dbDir>/banks/` whose `working_memory` rows
 * all carry the active `cwd` in `metadata_json.$.cwd`, and add those safe
 * single-cwd banks to the recall set. This rescues memories stranded by a
 * previous, less-stable bank derivation (#2412) without recalling mixed-cwd
 * legacy banks wholesale under per-project isolation.
 *
 * Robust by design: a missing banks directory, unreadable bank dir, or
 * corrupt SQLite file is silently skipped. Scanning is capped at
 * {@link LEGACY_BANK_SCAN_LIMIT} to bound startup cost.
 */
export declare function extendRecallWithLegacyBanks(resolved: readonly string[], dbPath: string, cwd: string): readonly string[];
export declare function truncateApproxTokens(text: string, tokenLimit: number): string;
