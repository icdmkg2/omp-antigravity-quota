import type { Context, ImageContent, Message, Model } from "@oh-my-pi/pi-ai";
import { type ImageResizeOptions } from "./image-resize.js";
export declare const MAX_IMAGE_INPUT_BYTES: number;
export declare const SUPPORTED_INPUT_IMAGE_MIME_TYPES: Set<string>;
/**
 * Ollama and its local-backend family decode image input through llama.cpp /
 * `stb_image`, which is compiled without WebP support, so a WebP upload fails
 * with an opaque HTTP 400. Detect those models so the resize pipeline encodes
 * to PNG/JPEG instead — the automatic equivalent of `OMP_NO_WEBP=1`.
 */
export declare function modelLacksWebpSupport(model: Pick<Model, "provider" | "api" | "imageInputDecoder"> | undefined): boolean;
/**
 * `true` when `model` cannot decode WebP, otherwise `undefined` so the
 * `OMP_NO_WEBP` env fallback in {@link resizeImage} still applies. Feed straight
 * into {@link ImageResizeOptions.excludeWebP}.
 */
export declare function webpExclusionForModel(model: Pick<Model, "provider" | "api"> | undefined): true | undefined;
export interface LoadImageInputOptions {
    path: string;
    cwd: string;
    autoResize: boolean;
    maxBytes?: number;
    resolvedPath?: string;
    detectedMimeType?: string;
    /** Force non-WebP output (e.g. for Ollama). Leave unset to honor `OMP_NO_WEBP`. */
    excludeWebP?: boolean;
}
/** Options for loading an in-memory chat image attachment as a vision-model input. */
export interface LoadImageAttachmentInputOptions {
    image: ImageContent;
    label: string;
    uri: string;
    autoResize: boolean;
    maxBytes?: number;
    /** Force non-WebP output (e.g. for Ollama). Leave unset to honor `OMP_NO_WEBP`. */
    excludeWebP?: boolean;
}
export interface LoadedImageInput {
    resolvedPath: string;
    mimeType: string;
    data: string;
    textNote: string;
    dimensionNote?: string;
    bytes: number;
}
export declare class ImageInputTooLargeError extends Error {
    readonly bytes: number;
    readonly maxBytes: number;
    constructor(bytes: number, maxBytes: number);
}
/** Converts an image to PNG, rejecting when the runtime cannot decode or encode it. */
export declare function convertImageToPng(image: ImageContent): Promise<ImageContent>;
export declare function ensureSupportedImageInput(image: ImageContent): Promise<ImageContent | null>;
export interface NormalizeModelContextImagesOptions {
    /** Model the images are bound for; used to derive encoder constraints (WebP exclusion for Ollama). */
    model?: Model;
    resize?: ImageResizeOptions;
}
/**
 * Normalize image blocks before they enter agent/model context. This keeps
 * provider request construction from having to resize an unbounded batch of
 * large images on the streaming hot path. Images are processed sequentially on
 * purpose: `resizeImage` may fan out multiple encoders for one image, so the
 * outer image batch must stay bounded.
 */
export declare function normalizeModelContextImages(images: ImageContent[] | undefined, options?: NormalizeModelContextImagesOptions): Promise<ImageContent[] | undefined>;
/**
 * Rewrites historical/resumed WebP blocks in the ephemeral provider request.
 * Persisted session messages remain untouched, while STB-backed local servers
 * never receive a format they cannot decode.
 */
export declare function normalizeModelContextMessages(messages: Message[], model: Model | undefined): Promise<Message[]>;
/** Normalizes historical image blocks in an ephemeral provider request. */
export declare function normalizeProviderContextImagesForModel(context: Context, model: Model): Promise<Context>;
export declare function loadImageInput(options: LoadImageInputOptions): Promise<LoadedImageInput | null>;
/** Loads a chat attachment image through the same size and encoder policy as file-backed image inputs. */
export declare function loadImageAttachmentInput(options: LoadImageAttachmentInputOptions): Promise<LoadedImageInput | null>;
