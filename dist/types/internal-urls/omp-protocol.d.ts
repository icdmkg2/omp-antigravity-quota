import type { InternalResource, InternalUrl, ProtocolHandler, UrlCompletion } from "./types.js";
/**
 * Handler for omp:// URLs.
 *
 * Resolves documentation file names to their content, or lists available docs.
 */
export declare class OmpProtocolHandler implements ProtocolHandler {
    #private;
    readonly scheme = "omp";
    readonly immutable = true;
    resolve(url: InternalUrl): Promise<InternalResource>;
    complete(): Promise<UrlCompletion[]>;
}
