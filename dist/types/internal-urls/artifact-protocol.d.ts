import type { InternalResource, InternalUrl, ProtocolHandler, ResolveContext, UrlCompletion } from "./types.js";
/** Filesystem location for a session artifact, resolved without materializing its content. */
export interface ResolvedArtifactFile {
    id: string;
    path: string;
    size: number;
}
/** Resolve an `artifact://` URL to its backing file without reading artifact bytes. */
export declare function resolveArtifactFile(url: InternalUrl, context?: ResolveContext): Promise<ResolvedArtifactFile>;
export declare class ArtifactProtocolHandler implements ProtocolHandler {
    readonly scheme = "artifact";
    readonly immutable = true;
    resolve(url: InternalUrl, context?: ResolveContext): Promise<InternalResource>;
    complete(): Promise<UrlCompletion[]>;
}
