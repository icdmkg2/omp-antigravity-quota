import { AuthStorage } from "@oh-my-pi/pi-ai";
import { type FetchImpl } from "@oh-my-pi/pi-utils";
import { type BlobDestinationId } from "../blob-broker/destinations.js";
import type { BlobBrokerDoctorRequest, BlobBrokerDoctorResponse, BlobBrokerProbeRequest, BlobBrokerProbeResponse, BlobBrokerPurgeRequest, BlobBrokerPurgeResponse, BlobBrokerStatus, BlobBrokerWorkerConfig } from "../blob-broker/protocol.js";
import { ProviderFileCache, type ProviderFileCacheEntry, type ProviderFileCacheStatus, type ProviderFileClient, type ProviderFileProvider } from "../blob-broker/provider-file-types.js";
import { type BlobBrokerSavingsStatus } from "../blob-broker/savings.js";
import { Settings } from "../config/settings.js";
export declare const IMAGES_ACTIONS: readonly ["status", "doctor", "probe", "purge"];
export type ImagesAction = (typeof IMAGES_ACTIONS)[number];
export interface ImagesCommandArgs {
    readonly action: ImagesAction;
    readonly flags: {
        readonly json?: boolean;
        readonly apply?: boolean;
        readonly all?: boolean;
        readonly dir?: string;
        /** Positive request timeout in seconds. */
        readonly timeout?: number;
    };
}
export interface ImagesResolvedConfig {
    readonly enabled: boolean;
    readonly orderedBackends: readonly BlobDestinationId[];
    readonly configs: readonly BlobBrokerWorkerConfig[];
    readonly providerFileCachePath: string;
    readonly savingsJournalPath: string;
}
export interface ImagesProviderFileSnapshot {
    readonly entries: readonly ProviderFileCacheEntry[];
    readonly lastError?: string;
}
export type ImagesDoctorSeverity = "ok" | "warn" | "error";
export interface ImagesDoctorCheck {
    readonly name: string;
    readonly severity: ImagesDoctorSeverity;
    readonly detail: string;
}
export interface ImagesCliDependencies {
    readonly loadSettings: (projectDir: string) => Promise<Settings>;
    readonly resolveConfig: (settings: Settings, projectDir: string) => ImagesResolvedConfig;
    readonly readSavings: (journalPath: string) => Promise<BlobBrokerSavingsStatus>;
    readonly readProviderFileSnapshot: (indexPath: string) => Promise<ImagesProviderFileSnapshot>;
    readonly loadProviderFileCache: (indexPath: string) => ProviderFileCache;
    readonly openAuthStorage: () => Promise<AuthStorage>;
    readonly createProviderFileClient: (provider: ProviderFileProvider, credential: string, fetchImpl: FetchImpl) => ProviderFileClient | null;
    readonly queryStatus: (projectDir: string) => Promise<BlobBrokerStatus | null>;
    readonly queryDoctor: (projectDir: string, request?: BlobBrokerDoctorRequest) => Promise<BlobBrokerDoctorResponse | null>;
    readonly queryProbe: (projectDir: string, config: BlobBrokerWorkerConfig, request?: BlobBrokerProbeRequest) => Promise<BlobBrokerProbeResponse | null>;
    readonly queryPurge: (projectDir: string, request: BlobBrokerPurgeRequest) => Promise<BlobBrokerPurgeResponse | null>;
    readonly which: (binary: string) => string | null;
    readonly fetch: FetchImpl;
    readonly writeStdout: (text: string) => void;
    readonly writeStderr: (text: string) => void;
}
export interface SafeDaemonStatus {
    readonly state: "running" | "stopped";
    readonly baseUrl?: string;
    readonly lazy?: boolean;
    readonly metrics?: BlobBrokerStatus["metrics"];
    readonly recentFetches?: BlobBrokerStatus["recentFetches"];
}
export interface ImagesStatusResult {
    readonly action: "status";
    readonly exitCode: 0;
    readonly projectDir: string;
    readonly enabled: boolean;
    readonly backends: readonly BlobDestinationId[];
    readonly daemon: SafeDaemonStatus;
    readonly providerFiles: ProviderFileCacheStatus;
    readonly savings: BlobBrokerSavingsStatus;
}
export interface ImagesDoctorResult {
    readonly action: "doctor";
    readonly exitCode: 0 | 1;
    readonly projectDir: string;
    readonly healthy: boolean;
    readonly checks: readonly ImagesDoctorCheck[];
}
export interface ImagesProbeResult {
    readonly action: "probe";
    readonly exitCode: 0 | 1;
    readonly projectDir: string;
    readonly backend?: BlobDestinationId;
    readonly daemonState: "running" | "stopped";
    readonly ok: boolean;
    readonly durationMs?: number;
    readonly detail: string;
}
export interface ImagesDaemonPurgeResult {
    readonly applied: boolean;
    readonly purgedBlobs: number;
    readonly reclaimedBytes: number;
    readonly attempted: number;
    readonly deleted: number;
    readonly errors: readonly string[];
}
export interface ImagesProviderPurgeResult {
    readonly selected: number;
    readonly bytes: number;
    readonly deleted: number;
    readonly skippedAuth: number;
    readonly errors: readonly string[];
}
export interface ImagesPurgeResult {
    readonly action: "purge";
    readonly exitCode: 0 | 1;
    readonly projectDir: string;
    readonly applied: boolean;
    readonly all: boolean;
    readonly daemon: ImagesDaemonPurgeResult | null;
    readonly providerFiles: ImagesProviderPurgeResult;
}
export interface ImagesErrorResult {
    readonly action: ImagesAction;
    readonly exitCode: 1 | 2;
    readonly error: string;
}
export type ImagesCommandResult = ImagesStatusResult | ImagesDoctorResult | ImagesProbeResult | ImagesPurgeResult | ImagesErrorResult;
/** Execute one standalone images command with injectable, leak-free runtime seams. */
export declare function runImagesCommand(args: ImagesCommandArgs, overrides?: Partial<ImagesCliDependencies>): Promise<ImagesCommandResult>;
