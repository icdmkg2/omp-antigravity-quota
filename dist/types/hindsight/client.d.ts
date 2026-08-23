/**
 * Minimal fetch-based client for the Hindsight HTTP API.
 *
 * Replaces the `@vectorize-io/hindsight-client` SDK with hand-rolled fetch
 * calls so we depend on nothing more than the API endpoints we actually use:
 * `retain`, `retainBatch`, `recall`, `reflect`, bank + document management,
 * and bulk listing. Centralising construction here keeps a single seam for
 * tests to spy on.
 */
import type { HindsightConfig } from "./config.js";
export type Budget = "low" | "mid" | "high" | string;
export type TagsMatch = "any" | "all" | "any_strict" | "all_strict";
export type UpdateMode = "replace" | "append";
export type ConsolidationState = "failed" | "pending" | "done";
/** Per-operation request deadlines (ms). Each falls back to a built-in default. */
export interface HindsightTimeouts {
    /** Default deadline for ops without a specific override. */
    request?: number;
    reflect?: number;
    recall?: number;
    retain?: number;
}
export interface HindsightApiOptions {
    baseUrl: string;
    apiKey?: string;
    userAgent?: string;
    /** Per-op deadlines; unset entries fall back to built-in defaults. */
    timeouts?: HindsightTimeouts;
}
/** Caller cancellation shared by Hindsight request option bags. */
export interface HindsightRequestOptions {
    signal?: AbortSignal;
}
export interface RecallResult {
    id?: string;
    text: string;
    type?: string | null;
    mentioned_at?: string | null;
    [key: string]: unknown;
}
export interface RecallResponse {
    results: RecallResult[];
    [key: string]: unknown;
}
export interface ReflectResponse {
    text?: string;
    [key: string]: unknown;
}
export interface RetainResponse {
    [key: string]: unknown;
}
export interface BankProfileResponse {
    [key: string]: unknown;
}
export interface ListMemoriesResponse {
    [key: string]: unknown;
}
export interface DocumentResponse {
    [key: string]: unknown;
}
export interface ListDocumentsResponse {
    [key: string]: unknown;
}
/** Mirrors the shape accepted by `POST /v1/default/banks/{bank_id}/memories`. */
export interface MemoryItemInput {
    content: string;
    timestamp?: Date | string;
    context?: string;
    metadata?: Record<string, string>;
    documentId?: string;
    tags?: string[];
    /** Scoping policy for observations derived from this item. */
    observationScopes?: "per_tag" | "combined" | "all_combinations" | string[][];
    /** Per-item extraction strategy override. */
    strategy?: string;
    updateMode?: UpdateMode;
}
export interface RetainOptions extends HindsightRequestOptions {
    timestamp?: Date | string;
    context?: string;
    metadata?: Record<string, string>;
    documentId?: string;
    async?: boolean;
    tags?: string[];
    updateMode?: UpdateMode;
}
export interface RetainBatchOptions extends HindsightRequestOptions {
    /** Document id applied to every item that doesn't carry its own. */
    documentId?: string;
    /** Tags attached to the resulting document(s), not individual items. */
    documentTags?: string[];
    async?: boolean;
}
export interface RecallOptions extends HindsightRequestOptions {
    types?: string[];
    maxTokens?: number;
    budget?: Budget;
    tags?: string[];
    tagsMatch?: TagsMatch;
}
export interface ReflectOptions extends HindsightRequestOptions {
    context?: string;
    budget?: Budget;
    tags?: string[];
    tagsMatch?: TagsMatch;
}
export interface CreateBankOptions extends HindsightRequestOptions {
    reflectMission?: string;
    retainMission?: string;
}
export interface ListMemoriesOptions extends HindsightRequestOptions {
    limit?: number;
    offset?: number;
    type?: string;
    q?: string;
    consolidationState?: ConsolidationState;
}
export interface ListDocumentsOptions extends HindsightRequestOptions {
    limit?: number;
    offset?: number;
}
export interface UpdateDocumentOptions extends HindsightRequestOptions {
    tags?: string[];
}
export type MentalModelDetail = "metadata" | "content" | "full";
export type MentalModelMode = "full" | "delta";
export interface MentalModelTrigger {
    mode?: MentalModelMode;
    refresh_after_consolidation?: boolean;
}
/** Shape returned by list/get on the mental-models endpoint. Fields are populated by `detail`. */
export interface MentalModelSummary {
    id: string;
    bank_id: string;
    name: string;
    tags?: string[];
    last_refreshed_at?: string | null;
    created_at?: string | null;
    source_query?: string;
    content?: string;
    max_tokens?: number;
    trigger?: MentalModelTrigger;
    [key: string]: unknown;
}
export interface MentalModelListResponse {
    items: MentalModelSummary[];
    [key: string]: unknown;
}
export interface MentalModelHistoryEntry {
    previous_content: string | null;
    changed_at: string;
    [key: string]: unknown;
}
export interface CreateMentalModelOptions extends HindsightRequestOptions {
    id?: string;
    tags?: string[];
    maxTokens?: number;
    trigger?: MentalModelTrigger;
}
export interface CreateMentalModelResponse {
    operation_id?: string;
    [key: string]: unknown;
}
export interface RefreshMentalModelResponse {
    operation_id?: string;
    [key: string]: unknown;
}
export interface ListMentalModelsOptions extends HindsightRequestOptions {
    detail?: MentalModelDetail;
}
export interface GetMentalModelOptions extends HindsightRequestOptions {
    detail?: MentalModelDetail;
}
export declare class HindsightError extends Error {
    statusCode?: number;
    details?: unknown;
    constructor(message: string, statusCode?: number, details?: unknown);
}
export declare class HindsightApi {
    #private;
    constructor(options: HindsightApiOptions);
    retain(bankId: string, content: string, options?: RetainOptions): Promise<RetainResponse>;
    /**
     * Retain multiple memories in a single request. Mirrors the official
     * client's `retainBatch` — items hit `POST /memories` together so the
     * server can dedupe and consolidate as a batch instead of N round-trips.
     *
     * Per-item `documentId` wins; `options.documentId` only fills the gaps.
     */
    retainBatch(bankId: string, items: MemoryItemInput[], options?: RetainBatchOptions): Promise<RetainResponse>;
    recall(bankId: string, query: string, options?: RecallOptions): Promise<RecallResponse>;
    reflect(bankId: string, query: string, options?: ReflectOptions): Promise<ReflectResponse>;
    createBank(bankId: string, options?: CreateBankOptions): Promise<BankProfileResponse>;
    /**
     * Bulk-list memory units in a bank with optional filters and pagination.
     * Endpoint: `GET /v1/default/banks/{bank_id}/memories/list`.
     */
    listMemories(bankId: string, options?: ListMemoriesOptions): Promise<ListMemoriesResponse>;
    /** Bulk-list documents in a bank. */
    listDocuments(bankId: string, options?: ListDocumentsOptions): Promise<ListDocumentsResponse>;
    /** Fetch a document. Returns `null` on 404 instead of throwing. */
    getDocument(bankId: string, documentId: string): Promise<DocumentResponse | null>;
    /** Update a document's mutable fields (currently just tags). */
    updateDocument(bankId: string, documentId: string, options: UpdateDocumentOptions): Promise<DocumentResponse>;
    /**
     * Delete a document and every memory derived from it. Returns `true` on
     * success, `false` if the document was already gone (404).
     */
    deleteDocument(bankId: string, documentId: string): Promise<boolean>;
    /**
     * List mental models in a bank. Default `detail=content` includes the
     * generated `content` text but excludes the heavyweight `reflect_response`
     * provenance chain (which can exceed 200KB). Use `detail=metadata` for
     * inventory and `detail=full` only for debug surfaces.
     */
    listMentalModels(bankId: string, options?: ListMentalModelsOptions): Promise<MentalModelListResponse>;
    /** Fetch a single mental model. Returns `null` on 404. */
    getMentalModel(bankId: string, mentalModelId: string, options?: GetMentalModelOptions): Promise<MentalModelSummary | null>;
    /**
     * Create a mental model. Asynchronous on the server: returns an
     * `operation_id`; the model's `content` populates after the background
     * reflect completes.
     */
    createMentalModel(bankId: string, name: string, sourceQuery: string, options?: CreateMentalModelOptions): Promise<CreateMentalModelResponse>;
    /** Trigger an out-of-band refresh of a mental model. Returns the operation handle. */
    refreshMentalModel(bankId: string, mentalModelId: string): Promise<RefreshMentalModelResponse>;
    /** Delete a mental model. Returns `true` on success, `false` if it was already gone (404). */
    deleteMentalModel(bankId: string, mentalModelId: string): Promise<boolean>;
    /**
     * Fetch the change history of a mental model. Each entry captures the
     * content snapshot BEFORE that change; the current content is read via
     * `getMentalModel`. Most-recent first.
     */
    getMentalModelHistory(bankId: string, mentalModelId: string): Promise<MentalModelHistoryEntry[]>;
}
export declare function createHindsightClient(config: HindsightConfig & {
    hindsightApiUrl: string;
}): HindsightApi;
