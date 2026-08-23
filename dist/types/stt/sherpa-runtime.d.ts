interface SherpaOfflineResult {
    text?: string;
}
interface SherpaOfflineStream {
    acceptWaveform(audio: {
        samples: Float32Array;
        sampleRate: number;
    }): void;
}
interface SherpaOfflineConfig {
    modelConfig: {
        transducer: {
            encoder: string;
            decoder: string;
            joiner: string;
        };
        tokens: string;
        modelType: string;
        numThreads: number;
        provider: string;
        debug: number;
    };
    decodingMethod: string;
}
/** A sherpa-onnx recognizer instance used by the STT worker. */
export interface SherpaOfflineRecognizer {
    createStream(): SherpaOfflineStream;
    decodeAsync(stream: SherpaOfflineStream): Promise<SherpaOfflineResult>;
}
/** The native sherpa-onnx module surface used by the STT worker. */
export interface SherpaRuntime {
    OfflineRecognizer: {
        createAsync(config: SherpaOfflineConfig): Promise<SherpaOfflineRecognizer>;
    };
}
/** Loads the nearest working source-workspace sherpa wrapper, including hoisted fallbacks. */
export declare function loadSourceSherpaRuntime(sourceUrl: string): SherpaRuntime;
export {};
