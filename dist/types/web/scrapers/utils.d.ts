import { isRecord } from "@oh-my-pi/pi-utils";
export { isRecord };
export declare function asRecord(value: unknown): Record<string, unknown> | null;
export declare function asString(value: unknown): string | null;
export declare function asNumber(value: unknown): number | null;
export interface BinaryFetchSuccess {
    ok: true;
    buffer: Uint8Array;
    contentDisposition?: string;
}
export type BinaryFetchResult = BinaryFetchSuccess | {
    ok: false;
    error?: string;
};
/**
 * Fetch binary content from a URL
 */
export declare function fetchBinary(url: string, timeout?: number, signal?: AbortSignal): Promise<BinaryFetchResult>;
/**
 * Convert binary content to markdown using markit.
 */
export declare function convertWithMarkit(buffer: Uint8Array, extension: string, timeout?: number, signal?: AbortSignal): Promise<{
    content: string;
    ok: boolean;
    error?: string;
}>;
