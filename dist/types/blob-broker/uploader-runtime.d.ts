import type { BlobDestinationId } from "./destinations.js";
import type { BlobPublication, BlobUploadRequest, RemoteDeleteAction } from "./publication.js";
/** Non-secret value accepted by a destination option record. */
export type DestinationOptionValue = string | number | boolean;
/** Fetch input accepted by destination HTTP requests. */
export type FetchInput = string | URL | Request;
/** Fetch implementation used for destination HTTP requests. */
export type FetchImpl = (input: FetchInput, init?: RequestInit) => Promise<Response>;
/** Runtime settings supplied to a built-in destination uploader. */
export interface DestinationRuntimeConfig {
    /** Non-secret, destination-specific settings. */
    readonly options: Readonly<Record<string, DestinationOptionValue>>;
    /** Destination credentials; values must never be included in errors or logs. */
    readonly credentials: Readonly<Record<string, string>>;
    /** Optional request implementation, primarily for embedding and isolation. */
    readonly fetch?: FetchImpl;
}
/** Additional durable metadata exposed by a destination after upload. */
export interface PublicationExtras {
    /** Unix epoch milliseconds after which the publication may disappear. */
    readonly expiresAt?: number;
    /** Replayable remote deletion request. */
    readonly delete?: RemoteDeleteAction;
    /** Provider-assigned identifier for the uploaded object. */
    readonly remoteId?: string;
}
/** Explicit failure used for destinations that cannot be contacted safely. */
export declare class DestinationUnavailableError extends Error {
    /** Destination that is unavailable. */
    readonly destination: BlobDestinationId;
    constructor(destination: BlobDestinationId, reason: string);
}
/** Read a required option without coercing its configured type. */
export declare function requireOption(config: DestinationRuntimeConfig, key: string): DestinationOptionValue;
/** Read a string option, returning a fallback when it is absent. */
export declare function optionString(config: DestinationRuntimeConfig, key: string, fallback?: string): string | undefined;
/** Read a number option, returning a fallback when it is absent. */
export declare function optionNumber(config: DestinationRuntimeConfig, key: string, fallback?: number): number | undefined;
/** Read a boolean option, returning a fallback when it is absent. */
export declare function optionBoolean(config: DestinationRuntimeConfig, key: string, fallback?: boolean): boolean | undefined;
/** Read a credential without exposing its value in an error. */
export declare function credentialString(config: DestinationRuntimeConfig, key: string): string | undefined;
/** Read a required credential without exposing its value in an error. */
export declare function requireCredential(config: DestinationRuntimeConfig, key: string): string;
/** Select the injected request implementation, or Bun's global fetch by default. */
export declare function fetchFor(config: DestinationRuntimeConfig): FetchImpl;
/** Produce a safe remote filename from an upload request. */
export declare function fileNameFor(request: BlobUploadRequest): string;
/** Build a native multipart form containing string fields and the uploaded file. */
export declare function multipartFile(request: BlobUploadRequest, fieldName?: string, fields?: Readonly<Record<string, string>>): FormData;
/** Return a successful response or throw a secret-safe HTTP status error. */
export declare function expectOk(response: Response, destination: BlobDestinationId | string): Promise<Response>;
/** Construct a durable publication while preserving all upstream metadata. */
export declare function publication(destination: BlobDestinationId, request: BlobUploadRequest, url: string, extras?: PublicationExtras): BlobPublication;
