import type { CustomTool } from "../extensibility/custom-tools/types.js";
type TtsCodec = "mp3" | "wav";
type TtsBackend = "local" | "xai";
declare const ttsSchema: import("@oh-my-pi/omptype").FluentType<{
    bit_rate?: number | undefined;
    language: string;
    output_path: string;
    sample_rate?: number | undefined;
    text: string;
    voice_id: string;
}, {
    bit_rate?: number | undefined;
    language?: string | undefined;
    output_path: string;
    sample_rate?: number | undefined;
    text: string;
    voice_id?: string | undefined;
}>;
interface TtsToolDetails {
    bytes: number;
    voiceId: string;
    codec: TtsCodec;
    backend: TtsBackend;
}
/**
 * Pick the synthesis backend. Pure for testability.
 *
 * - `xai` / `local` are honored verbatim (the xAI path still surfaces its own
 *   "no credentials" error when creds are missing).
 * - `auto` prefers the local on-device backend, except when the caller asked for
 *   an `.mp3` and xAI credentials exist — only the cloud path can emit MP3, so we
 *   route there to satisfy the requested container rather than substituting WAV.
 */
export declare function resolveTtsBackend(opts: {
    preference: string;
    wantsMp3: boolean;
    hasXaiCreds: boolean;
}): TtsBackend;
/**
 * Resolve the on-disk path for local synthesis. Local output is always WAV (no
 * MP3 encoder is bundled), so an `.mp3` (or any non-`.wav`) request is rewritten
 * to a sibling `.wav` and flagged so the tool result can note the substitution.
 */
export declare function resolveLocalWavPath(outputPath: string): {
    wavPath: string;
    substituted: boolean;
};
export declare const ttsTool: CustomTool<typeof ttsSchema, TtsToolDetails>;
export {};
