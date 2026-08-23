import type { Context, Model } from "@oh-my-pi/pi-ai";
/** Drops oldest transient image blocks so outgoing vision requests fit the active provider's image cap. */
export declare function clampProviderContextImages(context: Context, model: Model): Context;
