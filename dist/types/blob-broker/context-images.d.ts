/**
 * Pure context walkers for URL-mirrored images: decide which models may
 * receive image URLs, attach broker URLs to outgoing image blocks, and strip
 * them again when a provider rejects the request.
 *
 * All functions are structural and allocation-shy: untouched messages and
 * content arrays keep their identity so provider-side caches keyed on block
 * identity (e.g. Anthropic's resize memo) stay warm.
 */
import type { Context, ImageContent, Model } from "@oh-my-pi/pi-ai";
/**
 * Whether this model's provider fetches https image URLs server-side.
 *
 * Gated by API shape plus provider where the API is shared with backends that
 * cannot fetch (Bedrock never reaches out; the public generativelanguage API
 * restricts `fileUri` to Files API uploads). A wrong positive costs one failed
 * request — the stream fallback retries inline and quarantines the provider.
 */
export declare function supportsRemoteImageUrls(model: Model): boolean;
/**
 * Attach a broker URL to every image block lacking one. `urlFor` resolves a
 * block (by identity) to its stable URL, or `undefined` to leave it inline.
 */
export declare function decorateContextImages(context: Context, urlFor: (block: ImageContent) => string | undefined): Context;
/** Attach provider-native file references without disturbing independent URL mirrors. */
export declare function decorateContextProviderFiles(context: Context, referenceFor: (block: ImageContent) => ImageContent["providerFile"] | undefined): Context;
/** True when any user/developer/toolResult message carries an image block. */
export declare function contextHasImages(context: Context): boolean;
/**
 * Rewrite a decorated context back to pure inline base64 for a provider
 * retry: URLs are dropped, and URL-only placeholder blocks (lazy frames with
 * empty `data`) are filled through `resolveData`. A placeholder whose bytes
 * cannot be produced becomes a text note rather than an empty image the
 * provider would reject.
 */
export declare function inlineContextImages(context: Context, resolveData: (block: ImageContent) => Promise<string | null>): Promise<Context>;
/** Remove every image URL so the request carries pure inline base64. */
export declare function stripContextImageUrls(context: Context): Context;
/** Remove provider-native references without disturbing independent URL mirrors. */
export declare function stripContextProviderFiles(context: Context): Context;
/** True when any outgoing image block carries a provider-native reference. */
export declare function contextHasProviderFiles(context: Context): boolean;
/** True when any outgoing image block carries a URL mirror. */
export declare function contextHasImageUrls(context: Context): boolean;
