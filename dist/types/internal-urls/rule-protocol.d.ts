import type { InternalResource, InternalUrl, ProtocolHandler, UrlCompletion } from "./types.js";
export declare class RuleProtocolHandler implements ProtocolHandler {
    readonly scheme = "rule";
    readonly immutable = true;
    resolve(url: InternalUrl): Promise<InternalResource>;
    complete(): Promise<UrlCompletion[]>;
}
