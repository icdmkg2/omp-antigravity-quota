import type { SpecialHandler } from "./types.js";
/** Hard ceiling for decompressed rustdoc JSON: a 50 MB compressed payload can
 *  expand far enough to block the event loop or OOM without a cap. Exceeding it
 *  throws (RangeError), which the fetch path converts to a `null` result. */
export declare const MAX_RUSTDOC_GUNZIP_BYTES: number;
/** Decompress a docs.rs rustdoc gzip payload with the output-size cap applied.
 *  `maxOutputLength` is overridable only for tests exercising the cap contract. */
export declare function gunzipRustdocJson(compressed: Buffer, maxOutputLength?: number): string;
export declare const handleDocsRs: SpecialHandler;
