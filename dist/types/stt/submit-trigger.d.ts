/**
 * TTS/STT Submit Trigger options and evaluation logic.
 */
export declare const STT_SUBMIT_TRIGGER_VALUES: readonly ["never", "release", "release-complete", "say-submit"];
export type SttSubmitTrigger = (typeof STT_SUBMIT_TRIGGER_VALUES)[number];
export declare const STT_SUBMIT_TRIGGER_OPTIONS: ({
    value: "never";
    label: string;
    description: string;
} | {
    value: "release";
    label: string;
    description: string;
} | {
    value: "release-complete";
    label: string;
    description: string;
} | {
    value: "say-submit";
    label: string;
    description: string;
})[];
/**
 * Evaluate the submit trigger against a transcribed utterance.
 * Returns whether to submit, and the number of characters to trim from the end of the utterance.
 */
export declare function evaluateSubmitTrigger(utterance: string, trigger: SttSubmitTrigger): {
    submit: boolean;
    trimTrailing: number;
};
