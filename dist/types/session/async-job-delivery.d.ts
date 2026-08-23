import type { AsyncJob, AsyncJobType } from "../async/index.js";
import type { CustomMessage } from "./messages.js";
/**
 * `customType` of the injected async-result follow-up message. The task
 * executor's run monitor matches on it to invalidate a previously recorded
 * yield: a result injected after the yield supersedes that yield's payload.
 */
export declare const ASYNC_RESULT_MESSAGE_TYPE = "async-result";
/** Result payloads longer than this spill to an artifact with an inline preview. */
export declare const ASYNC_INLINE_RESULT_MAX_CHARS = 12000;
export declare const ASYNC_PREVIEW_MAX_CHARS = 4000;
export interface AsyncResultEntry {
    jobId: string;
    result: string;
    job: AsyncJob | undefined;
    durationMs: number | undefined;
    /**
     * Owning session's async-delivery generation at enqueue time. A session
     * transition (`/new`, switch, handoff) bumps the generation, so an entry
     * whose generation no longer matches belongs to a replaced transcript and
     * is dropped at flush — even after its job id has been reused, which clears
     * the manager's per-id suppression marker.
     */
    epoch: number;
}
type AsyncResultJobDetails = {
    jobId: string;
    type?: AsyncJobType;
    label?: string;
    durationMs?: number;
};
export type AsyncResultDetails = {
    jobs: AsyncResultJobDetails[];
};
export declare function buildAsyncResultBatchMessage(entries: AsyncResultEntry[]): CustomMessage<AsyncResultDetails> | null;
export {};
