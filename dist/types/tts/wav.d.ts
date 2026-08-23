/**
 * Assemble a mono PCM16 WAV byte buffer from Float32 PCM samples (the shape
 * transformers.js `RawAudio` emits: normalized [-1, 1] amplitudes plus a sample
 * rate). No external encoder is involved — we write a canonical 44-byte RIFF/
 * WAVE header followed by little-endian signed 16-bit samples. Samples are
 * clamped before quantization so out-of-range float values do not wrap.
 */
export declare function encodeWav(samples: Float32Array, sampleRate: number): Uint8Array;
